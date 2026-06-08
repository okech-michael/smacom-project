import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  pending_pickup: 'bg-amber-100 text-amber-700 border-amber-200',
  processor_assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  en_route: 'bg-purple-100 text-purple-700 border-purple-200',
  collected: 'bg-green-100 text-green-700 border-green-200',
  processing: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  paid: 'bg-green-100 text-green-700 border-green-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
  active: 'bg-green-100 text-green-700 border-green-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  suspended: 'bg-gray-100 text-gray-700 border-gray-200',
  online: 'bg-green-100 text-green-700 border-green-200',
  offline: 'bg-gray-100 text-gray-700 border-gray-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
  in_production: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  ready: 'bg-green-100 text-green-700 border-green-200',
  listed: 'bg-blue-100 text-blue-700 border-blue-200',
  sold: 'bg-gray-100 text-gray-700 border-gray-200',
  free: 'bg-gray-100 text-gray-700 border-gray-200',
  premium: 'bg-amber-100 text-amber-700 border-amber-200',
  refunded: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const label = status?.replace(/_/g, ' ');
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium capitalize border", style)}>
      {label}
    </Badge>
  );
}