import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function MyPickups() {
  const { user } = useAuth();
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['my-waste-reports'],
    queryFn: () => apiClient.entities.WasteReport.filter({ created_by_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  if (isLoading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader
        title="My Pickups"
        description="Track your waste collection requests."
        actions={<Link to="/waste/report"><Button><Plus className="w-4 h-4 mr-2" />New Report</Button></Link>}
      />

      {reports.length === 0 ? (
        <EmptyState icon={Trash2} title="No waste reports yet" description="Submit your first waste report to start earning credits." actionLabel="Report Waste" onAction={() => window.location.href = '/waste/report'} />
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <Card key={report.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold capitalize">{report.waste_type?.replace('_', ' ')}</p>
                      <StatusBadge status={report.status} />
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{report.waste_nature?.replace('_', ' ')} - {report.quantity_kg} kg</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.address}</span>
                      {report.scheduled_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(report.scheduled_date), 'MMM d, yyyy')}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">Fee</p>
                    <p className="text-sm font-semibold">KES {report.disposal_fee?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-primary font-medium">+{report.credits_earned || 0} credits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}