import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, ShoppingBag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Earnings() {
  const { user } = useAuth();
  const { data: transactions = [] } = useQuery({
    queryKey: ['my-earnings-transactions'],
    queryFn: () => apiClient.entities.Transaction.filter({ user_id: user?.id }, '-created_date', 100),
    enabled: !!user?.id,
  });

  const totalEarnings = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + (t.net_amount || t.amount || 0), 0);
  const pendingEarnings = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + (t.net_amount || t.amount || 0), 0);
  const salesCount = transactions.filter(t => t.type === 'marketplace_sale').length;
  const disposalCount = transactions.filter(t => t.type === 'disposal_fee').length;

  return (
    <div>
      <PageHeader title="Earnings" description="Track your income and payouts." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Earnings" value={`KES ${totalEarnings.toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Pending" value={`KES ${pendingEarnings.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Sales" value={salesCount} icon={ShoppingBag} />
        <StatCard title="Disposal Jobs" value={disposalCount} icon={Trash2} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState icon={TrendingUp} title="No transactions yet" description="Start accepting pickups and selling products to earn." />
          ) : (
            <div className="space-y-3">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium capitalize">{t.type?.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">{t.description || ''} - {t.created_date ? format(new Date(t.created_date), 'MMM d, yyyy') : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">KES {(t.net_amount || t.amount)?.toLocaleString()}</p>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}