import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/api/apiClient';
import { useMutation } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    phone: '', bio: '', company_name: '', address: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.phone || '',
        bio: user.bio || '',
        company_name: user.company_name || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => apiClient.auth.updateMe(data),
    onSuccess: () => toast.success('Profile updated'),
  });

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Settings" description="Manage your profile and preferences." />

      <Card>
        <CardHeader><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); updateMutation.mutate(form); }} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={user?.full_name || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user?.role?.replace('_', ' ') || ''} disabled className="bg-muted capitalize" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 712 345 678" />
            </div>
            <div className="space-y-2">
              <Label>Company/Organization</Label>
              <Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="Your company name" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Your address" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." rows={3} />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}