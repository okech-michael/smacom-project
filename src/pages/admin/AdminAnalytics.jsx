import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#EAB308', '#F97316', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function AdminAnalytics() {
  const { data: users = [] } = useQuery({
    queryKey: ['analytics-users'],
    queryFn: () => apiClient.entities.User.list('-created_date', 500),
  });
  const { data: reports = [] } = useQuery({
    queryKey: ['analytics-reports'],
    queryFn: () => apiClient.entities.WasteReport.list('-created_date', 500),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['analytics-orders'],
    queryFn: () => apiClient.entities.Order.list('-created_date', 500),
  });
  const { data: enrollments = [] } = useQuery({
    queryKey: ['analytics-enrollments'],
    queryFn: () => apiClient.entities.Enrollment.list('-created_date', 500),
  });

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role || 'unknown'] = (acc[u.role || 'unknown'] || 0) + 1;
    return acc;
  }, {});
  const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  const orderStatusCounts = orders.reduce((acc, o) => {
    acc[o.status || 'unknown'] = (acc[o.status || 'unknown'] || 0) + 1;
    return acc;
  }, {});
  const orderStatusData = Object.entries(orderStatusCounts).map(([name, value]) => ({ name, value }));

  const wasteTrend = reports.reduce((acc, r) => {
    const day = r.created_date ? format(new Date(r.created_date), 'MMM d') : 'N/A';
    const existing = acc.find(a => a.date === day);
    if (existing) {
      existing.kg += (r.quantity_kg || 0);
    } else {
      acc.push({ date: day, kg: r.quantity_kg || 0 });
    }
    return acc;
  }, []).reverse().slice(-14);

  return (
    <div>
      <PageHeader title="Analytics" description="Platform-wide insights and trends." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Users by Role</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Order Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Waste Collection Trend</CardTitle></CardHeader>
        <CardContent>
          {wasteTrend.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No waste data yet.</p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wasteTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="kg" stroke="hsl(142, 71%, 45%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-xs text-muted-foreground">Total Users</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{reports.length}</p>
          <p className="text-xs text-muted-foreground">Waste Reports</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-xs text-muted-foreground">Orders</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{enrollments.length}</p>
          <p className="text-xs text-muted-foreground">Enrollments</p>
        </Card>
      </div>
    </div>
  );
}