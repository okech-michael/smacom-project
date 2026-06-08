import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Leaf, Wind, Trash2, TreePine } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminEnvironment() {
  const { data: reports = [] } = useQuery({
    queryKey: ['env-waste-reports'],
    queryFn: () => apiClient.entities.WasteReport.list('-created_date', 500),
  });

  const collected = reports.filter(r => r.status === 'collected' || r.status === 'completed');
  const totalDiverted = collected.reduce((s, r) => s + (r.quantity_kg || 0), 0);
  const co2Saved = totalDiverted * 0.5;
  const carbonCredits = Math.floor(co2Saved / 1000);
  const envScore = Math.min(100, Math.round((totalDiverted / 10000) * 100));

  const wasteByType = reports.reduce((acc, r) => {
    const type = r.waste_type || 'unknown';
    acc[type] = (acc[type] || 0) + (r.quantity_kg || 0);
    return acc;
  }, {});

  const chartData = Object.entries(wasteByType).map(([name, value]) => ({
    name: name.replace('_', ' '),
    kg: Math.round(value),
  }));

  return (
    <div>
      <PageHeader title="Environmental Impact" description="Track the platform's contribution to sustainability." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Waste Diverted" value={`${totalDiverted.toFixed(0)} kg`} icon={Trash2} />
        <StatCard title="CO2 Saved" value={`${co2Saved.toFixed(0)} kg`} icon={Wind} />
        <StatCard title="Carbon Credits" value={carbonCredits} icon={TreePine} />
        <StatCard title="Eco Impact Score" value={`${envScore}/100`} icon={Leaf} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Waste Diverted by Type</CardTitle></CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="kg" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Sustainability Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Waste Diversion Rate</span>
                <span className="font-semibold">{reports.length > 0 ? Math.round((collected.length / reports.length) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${reports.length > 0 ? (collected.length / reports.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Carbon Offset Progress</span>
                <span className="font-semibold">{co2Saved.toFixed(0)} / 10,000 kg</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-green-500 rounded-full h-3 transition-all" style={{ width: `${Math.min((co2Saved / 10000) * 100, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Platform Eco Score</span>
                <span className="font-semibold">{envScore}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-emerald-500 rounded-full h-3 transition-all" style={{ width: `${envScore}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}