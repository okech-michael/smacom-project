import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';

export default function AdminMarketplace() {
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => apiClient.entities.Product.list('-created_date', 200),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders-list'],
    queryFn: () => apiClient.entities.Order.list('-created_date', 200),
  });

  return (
    <div>
      <PageHeader title="Marketplace Management" description="Manage products and orders." />

      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="capitalize text-xs">{p.category?.replace('_', ' ')}</TableCell>
                        <TableCell>KES {p.price?.toLocaleString()}/{p.unit}</TableCell>
                        <TableCell>{p.stock_quantity || 0}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.seller_name || 'N/A'}</TableCell>
                        <TableCell><StatusBadge status={p.is_active ? 'active' : 'offline'} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(o => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium text-xs">{o.order_number || o.id?.slice(0,8)}</TableCell>
                        <TableCell className="text-xs">{o.buyer_name || 'N/A'}</TableCell>
                        <TableCell className="text-xs">{o.seller_name || 'N/A'}</TableCell>
                        <TableCell>KES {o.total_amount?.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status={o.status} /></TableCell>
                        <TableCell><StatusBadge status={o.payment_status} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{o.created_date ? format(new Date(o.created_date), 'MMM d') : ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}