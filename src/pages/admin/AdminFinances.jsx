import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Trash2, GraduationCap, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function AdminFinances() {
  const { data: transactions = [] } = useQuery({
    queryKey: ['admin-all-transactions'],
    queryFn: () => apiClient.entities.Transaction.list('-created_date', 500),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: () => apiClient.entities.Order.list('-created_date', 500),
  });

  const completedTx = transactions.filter(t => t.status === 'completed');
  const totalRevenue = completedTx.reduce((s, t) => s + (t.commission_amount || 0), 0);
  const disposalRevenue = completedTx.filter(t => t.type === 'disposal_fee').reduce((s, t) => s + (t.commission_amount || t.amount || 0), 0);
  const marketplaceRevenue = completedTx.filter(t => t.type === 'commission').reduce((s, t) => s + (t.amount || 0), 0);
  const lmsRevenue = completedTx.filter(t => t.type === 'lms_purchase').reduce((s, t) => s + (t.amount || 0), 0);

  const monthlyData = completedTx.reduce((acc, t) => {
    const month = t.created_date ? format(new Date(t.created_date), 'MMM') : 'N/A';
    const existing = acc.find(a => a.month === month);
    if (existing) {
      existing.revenue += (t.commission_amount || t.amount || 0);
    } else {
      acc.push({ month, revenue: t.commission_amount || t.amount || 0 });
    }
    return acc;
  }, []);

  return (
    <div>
      <PageHeader title="Financial Overview" description="Revenue, transactions, and commission tracking." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Marketplace Revenue" value={`KES ${marketplaceRevenue.toLocaleString()}`} icon={ShoppingCart} />
        <StatCard title="Disposal Revenue" value={`KES ${disposalRevenue.toLocaleString()}`} icon={Trash2} />
        <StatCard title="LMS Revenue" value={`KES ${lmsRevenue.toLocaleString()}`} icon={GraduationCap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No revenue data yet.</p>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No transactions yet.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {transactions.slice(0, 15).map(t => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-xs font-medium capitalize">{t.type?.replace('_', ' ')}</p>
                      <p className="text-[10px] text-muted-foreground">{t.created_date ? format(new Date(t.created_date), 'MMM d, HH:mm') : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">KES {t.amount?.toLocaleString()}</p>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}