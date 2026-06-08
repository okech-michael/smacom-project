import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ShoppingCart, Star, Package, Minus, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = window.location.pathname.split('/').pop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data: products = [] } = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: () => apiClient.entities.Product.filter({ id: productId }),
    enabled: !!productId,
  });
  const product = products[0];

  const orderMutation = useMutation({
    mutationFn: async () => {
      const subtotal = product.price * quantity;
      const deliveryFee = 200;
      const commission = Math.round(subtotal * 0.07);
      const total = subtotal + deliveryFee;
      const orderNum = `ORD-${Date.now().toString(36).toUpperCase()}`;

      await apiClient.entities.Order.create({
        order_number: orderNum,
        buyer_id: user.id,
        buyer_name: user.full_name,
        seller_id: product.seller_id,
        seller_name: product.seller_name,
        items: [{
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_price: product.price,
          total: subtotal,
        }],
        subtotal,
        delivery_fee: deliveryFee,
        commission,
        total_amount: total,
        status: 'pending',
        payment_status: 'pending',
      });

      // Update stock
      await apiClient.entities.Product.update(product.id, {
        stock_quantity: Math.max(0, (product.stock_quantity || 0) - quantity),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-orders'] });
      toast.success('Order placed successfully');
      navigate('/orders');
    },
  });

  if (!product) return (
    <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square bg-muted rounded-xl overflow-hidden">
          {product.image_urls?.[0] ? (
            <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Badge variant="secondary" className="capitalize">{product.category?.replace('_', ' ')}</Badge>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">{product.description}</p>

          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{product.rating?.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({product.total_reviews} reviews)</span>
            </div>
          )}

          <div className="text-3xl font-bold text-primary">
            KES {product.price?.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">per {product.unit}</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {(product.stock_quantity || 0) > 0 ? `${product.stock_quantity} ${product.unit}(s) in stock` : 'Out of stock'}
          </p>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Input type="number" min="1" max={product.stock_quantity || 999} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center" />
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>KES {(product.price * quantity).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>KES 200</span></div>
                <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>KES {(product.price * quantity + 200).toLocaleString()}</span></div>
              </div>

              <Button
                className="w-full"
                disabled={orderMutation.isPending || (product.stock_quantity || 0) <= 0}
                onClick={() => orderMutation.mutate()}
              >
                {orderMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                Place Order
              </Button>
            </CardContent>
          </Card>

          {product.seller_name && (
            <p className="text-xs text-muted-foreground">Sold by <span className="font-medium">{product.seller_name}</span></p>
          )}
        </div>
      </div>
    </div>
  );
}