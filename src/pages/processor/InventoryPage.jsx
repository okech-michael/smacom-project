import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ITEM_TYPES = [
  { value: 'raw_waste', label: 'Raw Waste' },
  { value: 'compost', label: 'Compost' },
  { value: 'animal_feed', label: 'Animal Feed' },
  { value: 'biochar', label: 'Biochar' },
  { value: 'liquid_fertiliser', label: 'Liquid Fertiliser' },
  { value: 'compost_tea', label: 'Compost Tea' },
  { value: 'worm_castings', label: 'Worm Castings' },
];

export default function InventoryPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item_type: '', quantity_kg: '', batch_number: '', quality_grade: '', notes: '' });

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['my-inventory'],
    queryFn: () => apiClient.entities.Inventory.filter({ processor_id: user?.id }, '-created_date', 100),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Inventory.create({
      ...data,
      processor_id: user.id,
      quantity_kg: parseFloat(data.quantity_kg),
      production_date: new Date().toISOString().split('T')[0],
      status: 'in_production',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-inventory'] });
      setOpen(false);
      setForm({ item_type: '', quantity_kg: '', batch_number: '', quality_grade: '', notes: '' });
      toast.success('Inventory item added');
    },
  });

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage your production inventory."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
              <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Item Type</Label>
                  <Select value={form.item_type} onValueChange={v => setForm(f => ({ ...f, item_type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{ITEM_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity (kg)</Label>
                  <Input type="number" value={form.quantity_kg} onChange={e => setForm(f => ({ ...f, quantity_kg: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Input value={form.batch_number} onChange={e => setForm(f => ({ ...f, batch_number: e.target.value }))} placeholder="e.g. BATCH-001" />
                </div>
                <div className="space-y-2">
                  <Label>Quality Grade</Label>
                  <Select value={form.quality_grade} onValueChange={v => setForm(f => ({ ...f, quality_grade: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add Item
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : inventory.length === 0 ? (
        <EmptyState icon={Package} title="No inventory items" description="Add your first production item." actionLabel="Add Item" onAction={() => setOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold capitalize">{item.item_type?.replace('_', ' ')}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-2xl font-bold">{item.quantity_kg} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {item.batch_number && <span>Batch: {item.batch_number}</span>}
                  {item.quality_grade && <span>Grade: {item.quality_grade}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}