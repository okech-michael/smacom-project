import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

export default function Orders() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => apiClient.entities.Order.filter({ buyer_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  if (isLoading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="My Orders" description="Track your marketplace purchases." />
      {orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders yet" description="Visit the marketplace to make your first purchase." />
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{order.order_number || `ORD-${order.id?.slice(0,6)}`}</p>
                      <StatusBadge status={order.status} />
                      <StatusBadge status={order.payment_status} />
                    </div>
                    <div className="space-y-0.5">
                      {order.items?.map((item, i) => (
                        <p key={i} className="text-xs text-muted-foreground">{item.quantity}x {item.product_name} - KES {item.total?.toLocaleString()}</p>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy HH:mm') : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold">KES {order.total_amount?.toLocaleString()}</p>
                    {order.seller_name && <p className="text-xs text-muted-foreground">From {order.seller_name}</p>}
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