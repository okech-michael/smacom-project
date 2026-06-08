import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/api/apiClient';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Leaf, Loader2, Trash2, Recycle, Sprout, GraduationCap } from 'lucide-react';

const roles = [
  { value: 'waste_producer', label: 'Waste Producer', desc: 'Report waste and earn credits', icon: Trash2 },
  { value: 'bio_processor', label: 'Bio Processor', desc: 'Collect and process waste', icon: Recycle },
  { value: 'farmer', label: 'Farmer', desc: 'Buy eco products and get AI advice', icon: Sprout },
  { value: 'learner', label: 'Learner', desc: 'Learn sustainability and earn certificates', icon: GraduationCap },
];

export default function Onboarding() {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('waste_producer');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiClient.auth.updateMe({
        role: selectedRole,
        phone,
        company_name: company,
        verification_status: 'pending',
        is_approved: false,
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
          <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map(role => (
              <label
                key={role.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === role.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={role.value} className="mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <role.icon className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">{role.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{role.desc}</p>
                </div>
              </label>
            ))}
          </RadioGroup>

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