import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet as WalletIcon, Award, Gift, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Wallet() {
  const { user } = useAuth();

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const wallets = await apiClient.entities.CreditWallet.filter({ user_id: user?.id });
      return wallets[0] || { balance: 0, total_earned: 0, total_redeemed: 0 };
    },
    enabled: !!user?.id,
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['wallet-reports'],
    queryFn: () => apiClient.entities.WasteReport.filter({ created_by_id: user?.id }, '-created_date', 20),
    enabled: !!user?.id,
  });

  return (
    <div>
      <PageHeader title="Credits Wallet" description="View your earned credits and rewards." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Balance" value={`${wallet?.balance || 0} credits`} icon={WalletIcon} />
        <StatCard title="Total Earned" value={`${wallet?.total_earned || 0} credits`} icon={Award} />
        <StatCard title="Total Redeemed" value={`${wallet?.total_redeemed || 0} credits`} icon={Gift} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Credit History</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No credit transactions yet. Report waste to start earning.</p>
          ) : (
            <div className="space-y-3">
              {reports.filter(r => r.credits_earned).map(report => (
                <div key={report.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">Waste Report - {report.waste_type?.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{report.quantity_kg} kg - {report.created_date ? format(new Date(report.created_date), 'MMM d, yyyy') : ''}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-600">+{report.credits_earned} credits</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}