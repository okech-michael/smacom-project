import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Check, Truck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function PickupRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: available = [] } = useQuery({
    queryKey: ['available-pickups'],
    queryFn: () => apiClient.entities.WasteReport.filter({ status: 'pending_pickup' }, '-created_date', 50),
  });

  const { data: myPickups = [] } = useQuery({
    queryKey: ['my-processor-pickups'],
    queryFn: () => apiClient.entities.WasteReport.filter({ assigned_processor_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const acceptMutation = useMutation({
    mutationFn: (report) => apiClient.entities.WasteReport.update(report.id, {
      assigned_processor_id: user.id,
      status: 'processor_assigned',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-pickups'] });
      queryClient.invalidateQueries({ queryKey: ['my-processor-pickups'] });
      toast.success('Pickup accepted');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => apiClient.entities.WasteReport.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-processor-pickups'] });
      toast.success('Status updated');
    },
  });

  const PickupCard = ({ report, showActions }) => (
    <Card key={report.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">{report.waste_type?.replace('_', ' ')}</p>
              <StatusBadge status={report.status} />
            </div>
            <p className="text-xs text-muted-foreground">{report.quantity_kg} kg - {report.waste_nature?.replace('_', ' ')}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{report.address}</p>
            {report.scheduled_date && <p className="text-xs text-muted-foreground">{format(new Date(report.scheduled_date), 'MMM d, yyyy')}</p>}
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            {showActions === 'accept' && (
              <Button size="sm" onClick={() => acceptMutation.mutate(report)} disabled={acceptMutation.isPending}>
                {acceptMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}Accept
              </Button>
            )}
            {showActions === 'status' && report.status === 'processor_assigned' && (
              <Button size="sm" onClick={() => updateStatusMutation.mutate({ id: report.id, status: 'en_route' })}>
                <Truck className="w-3 h-3 mr-1" />En Route
              </Button>
            )}
            {showActions === 'status' && report.status === 'en_route' && (
              <Button size="sm" onClick={() => updateStatusMutation.mutate({ id: report.id, status: 'collected' })}>
                <Check className="w-3 h-3 mr-1" />Collected
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <PageHeader title="Pickup Requests" description="Manage nearby waste collection requests." />
      <Tabs defaultValue="available">
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available ({available.length})</TabsTrigger>
          <TabsTrigger value="mine">My Pickups ({myPickups.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          {available.length === 0 ? (
            <EmptyState icon={MapPin} title="No pickup requests nearby" description="Check back later for new requests." />
          ) : (
            <div className="space-y-3">{available.map(r => <PickupCard key={r.id} report={r} showActions="accept" />)}</div>
          )}
        </TabsContent>
        <TabsContent value="mine">
          {myPickups.length === 0 ? (
            <EmptyState icon={Truck} title="No active pickups" description="Accept a request to get started." />
          ) : (
            <div className="space-y-3">{myPickups.map(r => <PickupCard key={r.id} report={r} showActions="status" />)}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}