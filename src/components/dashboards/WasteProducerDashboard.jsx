import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { Trash2, Truck, Wallet, Award, Plus, ArrowRight } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

export default function WasteProducerDashboard({ user }) {
  const { data: reports = [] } = useQuery({
    queryKey: ['my-waste-reports'],
    queryFn: () => apiClient.entities.WasteReport.filter({ created_by_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const { data: wallet } = useQuery({
    queryKey: ['my-wallet'],
    queryFn: async () => {
      const wallets = await apiClient.entities.CreditWallet.filter({ user_id: user?.id });
      return wallets[0] || { balance: 0, total_earned: 0, total_redeemed: 0 };
    },
    enabled: !!user?.id,
  });

  const totalWaste = reports.reduce((sum, r) => sum + (r.quantity_kg || 0), 0);
  const pendingPickups = reports.filter(r => r.status === 'pending_pickup').length;
  const completedPickups = reports.filter(r => r.status === 'collected' || r.status === 'completed').length;
  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Producer'}`}
        description="Track your waste contributions and environmental impact."
        actions={
          <Link to="/waste/report">
            <Button><Plus className="w-4 h-4 mr-2" />Report Waste</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Waste Reported" value={`${totalWaste.toFixed(0)} kg`} icon={Trash2} />
        <StatCard title="Pending Pickups" value={pendingPickups} icon={Truck} />
        <StatCard title="Completed" value={completedPickups} icon={Award} />
        <StatCard title="Credit Balance" value={wallet?.balance?.toFixed(0) || '0'} subtitle="credits" icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Waste Reports</CardTitle>
            <Link to="/waste/pickups" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No waste reports yet. Start reporting to earn credits.</p>
            ) : (
              <div className="space-y-3">
                {recentReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium capitalize">{report.waste_type?.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{report.quantity_kg} kg - {report.created_date ? format(new Date(report.created_date), 'MMM d, yyyy') : ''}</p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Eco Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Waste diverted from landfill</span>
                <span className="text-sm font-semibold">{totalWaste.toFixed(0)} kg</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${Math.min((totalWaste / 1000) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">Goal: 1,000 kg diverted</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Est. CO2 saved</span>
                <span className="text-sm font-semibold text-primary">{(totalWaste * 0.5).toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Eco Score</span>
                <span className="text-sm font-semibold">{user?.eco_score || 0} pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}