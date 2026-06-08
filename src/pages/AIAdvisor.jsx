import React, { useState } from 'react';
import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIAdvisor() {
  const [form, setForm] = useState({
    soil_type: '', crop_type: '', farm_size: '', region: '', soil_ph: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { data: products = [] } = useQuery({
    queryKey: ['marketplace-products-for-ai'],
    queryFn: () => apiClient.entities.Product.filter({ is_active: true }, '-created_date', 50),
  });

  const getRecommendation = async () => {
    setLoading(true);
    const productList = products.map(p => `${p.name} (${p.category?.replace('_', ' ')}) - KES ${p.price}/${p.unit}`).join('\n');

    const res = await apiClient.integrations.Core.InvokeLLM({
      prompt: `You are an agricultural AI advisor for SMACOM Solutions, a waste-to-wealth platform in Kenya. 
      
A farmer needs recommendations based on:
- Soil Type: ${form.soil_type || 'Not specified'}
- Crop: ${form.crop_type || 'Not specified'}
- Farm Size: ${form.farm_size || 'Not specified'}
- Region: ${form.region || 'Not specified'}
- Soil pH: ${form.soil_ph || 'Not specified'}
- Additional Notes: ${form.notes || 'None'}

Available products on our marketplace:
${productList || 'No products available'}

Provide:
1. Soil analysis insights
2. Recommended products from our marketplace with quantities
3. Application methods and timing
4. Sustainable farming tips specific to their situation
5. Expected yield improvement estimates

Format the response in clear markdown sections.`,
      response_json_schema: {
        type: "object",
        properties: {
          analysis: { type: "string", description: "Full recommendation in markdown format" },
          recommended_products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                reason: { type: "string" },
                quantity: { type: "string" }
              }
            }
          }
        }
      }
    });

    setResult(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="AI Soil Advisor" description="Get personalized farming recommendations powered by AI." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Your Farm Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Soil Type</Label>
              <Select value={form.soil_type} onValueChange={v => setForm(f => ({ ...f, soil_type: v }))}>
                <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loam">Loam</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                  <SelectItem value="peat">Peat</SelectItem>
                  <SelectItem value="chalky">Chalky</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Crop Type</Label>
              <Input value={form.crop_type} onChange={e => setForm(f => ({ ...f, crop_type: e.target.value }))} placeholder="e.g. Maize, Beans, Tea..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Farm Size (acres)</Label>
                <Input value={form.farm_size} onChange={e => setForm(f => ({ ...f, farm_size: e.target.value }))} placeholder="e.g. 5" />
              </div>
              <div className="space-y-2">
                <Label>Soil pH</Label>
                <Input value={form.soil_ph} onChange={e => setForm(f => ({ ...f, soil_ph: e.target.value }))} placeholder="e.g. 6.5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="e.g. Central Kenya" />
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any specific concerns or questions..." rows={3} />
            </div>
            <Button className="w-full" onClick={getRecommendation} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Get AI Recommendation
            </Button>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{result.analysis}</ReactMarkdown>
                </div>
                {result.recommended_products?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold">Recommended Products</h4>
                    {result.recommended_products.map((p, i) => (
                      <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.reason}</p>
                        {p.quantity && <p className="text-xs font-medium text-primary mt-1">Suggested: {p.quantity}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center space-y-3">
                <Sparkles className="w-10 h-10 text-primary/30 mx-auto" />
                <p className="text-sm text-muted-foreground">Fill in your farm details and click "Get AI Recommendation" to receive personalized advice.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}