import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, Leaf, GraduationCap, ArrowRight } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function FarmerDashboard({ user }) {
  const { data: orders = [] } = useQuery({
    queryKey: ['farmer-orders'],
    queryFn: () => apiClient.entities.Order.filter({ buyer_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['farmer-enrollments'],
    queryFn: () => apiClient.entities.Enrollment.filter({ user_id: user?.id }, '-created_date', 10),
    enabled: !!user?.id,
  });

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
  const totalSpent = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Farmer'}`}
        description="Explore eco-friendly products and learn sustainable farming."
        actions={
          <Link to="/marketplace">
            <Button><ShoppingCart className="w-4 h-4 mr-2" />Shop Now</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} />
        <StatCard title="Active Orders" value={activeOrders} icon={ShoppingCart} />
        <StatCard title="Total Spent" value={`KES ${totalSpent.toLocaleString()}`} icon={Leaf} />
        <StatCard title="Courses Enrolled" value={enrollments.length} icon={GraduationCap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            <Link to="/orders" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No orders yet. Visit the marketplace to get started.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{order.order_number || `ORD-${order.id?.slice(0,6)}`}</p>
                      <p className="text-xs text-muted-foreground">KES {order.total_amount?.toLocaleString()} - {order.created_date ? format(new Date(order.created_date), 'MMM d') : ''}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/marketplace" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Browse Marketplace</p>
                <p className="text-xs text-muted-foreground">Find organic products for your farm</p>
              </div>
            </Link>
            <Link to="/ai-advisor" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Leaf className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">AI Soil Advisor</p>
                <p className="text-xs text-muted-foreground">Get personalized recommendations</p>
              </div>
            </Link>
            <Link to="/learning" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <GraduationCap className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Learn Sustainable Farming</p>
                <p className="text-xs text-muted-foreground">Free and premium courses</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}