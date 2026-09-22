import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/api/apiClient';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Loader2 } from 'lucide-react';

export default function Onboarding() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiClient.auth.updateMe({
        full_name: user?.full_name || '',
      });
      // Also create a credit wallet for the user
      await apiClient.entities.CreditWallet.create({ user_id: user.id, balance: 0, total_earned: 0, total_redeemed: 0 });
      window.location.href = '/';
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Welcome to SMACOM Solutions</CardTitle>
          <p className="text-sm text-muted-foreground">Let's set up your account. Choose your role.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            Your assigned role is <span className="font-medium text-foreground capitalize">{user?.role?.replace('_', ' ')}</span>. Contact an administrator if it needs to change.
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 712 345 678" />
            </div>
            <div className="space-y-2">
              <Label>Company/Organization (optional)</Label>
              <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company name" />
            </div>
          </div>

          <Button className="w-full" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}