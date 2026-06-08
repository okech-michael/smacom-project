import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShoppingBag, Plus, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'compost', label: 'Compost' },
  { value: 'liquid_fertiliser', label: 'Liquid Fertiliser' },
  { value: 'animal_feed', label: 'Animal Feed' },
  { value: 'biochar', label: 'Biochar' },
  { value: 'compost_tea', label: 'Compost Tea' },
  { value: 'worm_castings', label: 'Worm Castings' },
  { value: 'eco_packaging', label: 'Eco Packaging' },
];

export default function ProcessorProducts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', unit: 'kg', stock_quantity: '' });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: () => apiClient.entities.Product.filter({ seller_id: user?.id }, '-created_date', 100),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Product.create({
      ...data,
      price: parseFloat(data.price),
      stock_quantity: parseInt(data.stock_quantity) || 0,
      seller_id: user.id,
      seller_name: user.full_name,
      is_active: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      setOpen(false);
      setForm({ name: '', description: '', category: '', price: '', unit: 'kg', stock_quantity: '' });
      toast.success('Product listed');
    },
  });

  return (
    <div>
      <PageHeader
        title="My Products"
        description="Manage your marketplace listings."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />List Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>List New Product</DialogTitle></DialogHeader>
              <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
                <div className="space-y-2"><Label>Product Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Price (KES)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={form.unit} onValueChange={v => setForm(f => ({ ...f, unit: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="litre">Litre</SelectItem>
                        <SelectItem value="bag">Bag</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Stock Quantity</Label><Input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} /></div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}List Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : products.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No products listed" description="List your first product on the marketplace." actionLabel="List Product" onAction={() => setOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{product.category?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-primary">KES {product.price?.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/{product.unit}</span></p>
                  <p className="text-xs text-muted-foreground">{product.stock_quantity || 0} in stock</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}