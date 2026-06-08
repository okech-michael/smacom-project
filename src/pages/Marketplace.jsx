import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShoppingCart, Star, Package } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'compost', label: 'Compost' },
  { value: 'liquid_fertiliser', label: 'Liquid Fertiliser' },
  { value: 'animal_feed', label: 'Animal Feed' },
  { value: 'biochar', label: 'Biochar' },
  { value: 'compost_tea', label: 'Compost Tea' },
  { value: 'worm_castings', label: 'Worm Castings' },
  { value: 'eco_packaging', label: 'Eco Packaging' },
  { value: 'eco_mart', label: 'Eco Mart' },
];

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['marketplace-products'],
    queryFn: () => apiClient.entities.Product.filter({ is_active: true }, '-created_date', 100),
  });

  const filtered = useMemo(() => {
    let result = products;
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (sortBy === 'price_low') result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price_high') result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'rating') result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [products, category, search, sortBy]);

  return (
    <div>
      <PageHeader title="Eco Marketplace" description="Sustainable products from verified bio processors." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <Link key={product.id} to={`/marketplace/product/${product.id}`}>
              <Card className="h-full hover:shadow-md transition-all group cursor-pointer">
                <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
                  {product.image_urls?.[0] ? (
                    <img
                      src={product.image_urls[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div className="w-full h-full items-center justify-center" style={{ display: product.image_urls?.[0] ? 'none' : 'flex' }}>
                    <Package className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  <Badge variant="secondary" className="text-[10px] capitalize">{product.category?.replace('_', ' ')}</Badge>
                  <h3 className="text-sm font-semibold line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-base font-bold text-primary">KES {product.price?.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/{product.unit}</span></p>
                    {product.rating > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{product.rating?.toFixed(1)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}