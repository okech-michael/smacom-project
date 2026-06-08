import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const WASTE_TYPES = [
  { value: 'organic', label: 'Organic' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'metal', label: 'Metal' },
  { value: 'paper', label: 'Paper' },
  { value: 'glass', label: 'Glass' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'textile', label: 'Textile' },
  { value: 'hazardous', label: 'Hazardous' },
  { value: 'mixed', label: 'Mixed' },
];

const WASTE_NATURES = [
  { value: 'household', label: 'Household' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'institutional', label: 'Institutional' },
];

export default function ReportWaste() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    waste_type: '', waste_nature: '', quantity_kg: '',
    address: '', scheduled_date: '', scheduled_time: '', notes: '',
    latitude: null, longitude: null,
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      setUploading(true);
      let photo_urls = [];
      for (const file of photoFiles) {
        const { file_url } = await apiClient.integrations.Core.UploadFile({ file });
        photo_urls.push(file_url);
      }
      const fee = parseFloat(data.quantity_kg) * 5;
      const credits = Math.floor(parseFloat(data.quantity_kg) * 2);
      await apiClient.entities.WasteReport.create({
        ...data,
        quantity_kg: parseFloat(data.quantity_kg),
        photo_urls,
        disposal_fee: fee,
        credits_earned: credits,
        status: 'pending_pickup',
      });
      setUploading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-waste-reports'] });
      toast.success('Waste report submitted successfully');
      navigate('/waste/pickups');
    },
  });

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setForm(f => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
        () => toast.error('Could not detect location')
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.waste_type || !form.waste_nature || !form.quantity_kg || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Report Waste" description="Submit a new waste collection request." />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Waste Type *</Label>
                <Select value={form.waste_type} onValueChange={v => setForm(f => ({ ...f, waste_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {WASTE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Waste Nature *</Label>
                <Select value={form.waste_nature} onValueChange={v => setForm(f => ({ ...f, waste_nature: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select nature" /></SelectTrigger>
                  <SelectContent>
                    {WASTE_NATURES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quantity (kg) *</Label>
              <Input type="number" min="0.1" step="0.1" value={form.quantity_kg} onChange={e => setForm(f => ({ ...f, quantity_kg: e.target.value }))} placeholder="e.g. 50" />
            </div>

            <div className="space-y-2">
              <Label>Pickup Address *</Label>
              <div className="flex gap-2">
                <Input className="flex-1" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Enter full address" />
                <Button type="button" variant="outline" size="icon" onClick={detectLocation}>
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
              {form.latitude && <p className="text-xs text-muted-foreground">GPS: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Input type="date" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Preferred Time</Label>
                <Select value={form.scheduled_time} onValueChange={v => setForm(f => ({ ...f, scheduled_time: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm-4pm)</SelectItem>
                    <SelectItem value="evening">Evening (4pm-7pm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload photos</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={e => setPhotoFiles([...e.target.files])} />
                </label>
                {photoFiles.length > 0 && <span className="text-xs text-muted-foreground">{photoFiles.length} file(s) selected</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any special instructions..." rows={3} />
            </div>

            {form.quantity_kg && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Disposal Fee</span>
                  <span className="font-semibold">KES {(parseFloat(form.quantity_kg) * 5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Credits to Earn</span>
                  <span className="font-semibold text-primary">{Math.floor(parseFloat(form.quantity_kg) * 2)} credits</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={createMutation.isPending || uploading}>
              {(createMutation.isPending || uploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Waste Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}