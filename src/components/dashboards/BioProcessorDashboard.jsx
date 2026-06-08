import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { MapPin, Package, TrendingUp, Truck, ArrowRight } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function BioProcessorDashboard({ user }) {
  const { data: pickups = [] } = useQuery({
    queryKey: ['processor-pickups'],
    queryFn: () => apiClient.entities.WasteReport.filter({ assigned_processor_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const { data: nearbyPickups = [] } = useQuery({
    queryKey: ['nearby-pickups'],
    queryFn: () => apiClient.entities.WasteReport.filter({ status: 'pending_pickup' }, '-created_date', 20),
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['processor-inventory'],
    queryFn: () => apiClient.entities.Inventory.filter({ processor_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['processor-earnings'],
    queryFn: () => apiClient.entities.Transaction.filter({ user_id: user?.id, type: 'marketplace_sale' }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const activePickups = pickups.filter(p => !['collected', 'completed', 'cancelled'].includes(p.status)).length;
  const totalCollected = pickups.filter(p => p.status === 'collected' || p.status === 'completed').reduce((s, p) => s + (p.quantity_kg || 0), 0);
  const totalEarnings = transactions.reduce((s, t) => s + (t.net_amount || t.amount || 0), 0);
  const inventoryCount = inventory.reduce((s, i) => s + (i.quantity_kg || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Processor'}`}
        description="Manage pickups, inventory, and earnings."
        actions={
          <Link to="/processor/pickups">
            <Button><MapPin className="w-4 h-4 mr-2" />View Pickups</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Pickups" value={activePickups} icon={Truck} />
        <StatCard title="Nearby Requests" value={nearbyPickups.length} icon={MapPin} />
        <StatCard title="Inventory" value={`${inventoryCount.toFixed(0)} kg`} icon={Package} />
        <StatCard title="Earnings" value={`KES ${totalEarnings.toLocaleString()}`} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Nearby Pickup Requests</CardTitle>
            <Link to="/processor/pickups" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {nearbyPickups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No nearby pickup requests at the moment.</p>
            ) : (
              <div className="space-y-3">
                {nearbyPickups.slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium capitalize">{req.waste_type?.replace('_', ' ')} - {req.quantity_kg} kg</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{req.address}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Inventory Summary</CardTitle>
            <Link to="/processor/inventory" className="text-xs text-primary hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No inventory items. Start processing waste to build inventory.</p>
            ) : (
              <div className="space-y-3">
                {inventory.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium capitalize">{item.item_type?.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity_kg} kg - Batch {item.batch_number || 'N/A'}</p>
                    </div>
                    <StatusBadge status={item.status} />
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