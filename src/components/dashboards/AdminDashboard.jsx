import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { Users, Trash2, ShoppingCart, DollarSign, Leaf, Cpu, ArrowRight } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0', '#DCFCE7', '#F0FDF4', '#EAB308', '#EF4444'];

export default function AdminDashboard({ user }) {
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.entities.User.list('-created_date', 200),
  });

  const { data: wasteReports = [] } = useQuery({
    queryKey: ['admin-waste'],
    queryFn: () => apiClient.entities.WasteReport.list('-created_date', 200),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => apiClient.entities.Order.list('-created_date', 200),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => apiClient.entities.Transaction.list('-created_date', 200),
  });

  const totalRevenue = transactions.filter(t => t.status === 'completed' && t.type === 'commission').reduce((s, t) => s + (t.amount || 0), 0);
  const totalWasteDiverted = wasteReports.filter(r => r.status === 'collected' || r.status === 'completed').reduce((s, r) => s + (r.quantity_kg || 0), 0);
  const co2Saved = totalWasteDiverted * 0.5;

  const roleCounts = users.reduce((acc, u) => {
    const role = u.role || 'unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const roleData = Object.entries(roleCounts).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
  }));

  const wasteTypeCounts = wasteReports.reduce((acc, r) => {
    const type = r.waste_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const wasteData = Object.entries(wasteTypeCounts).map(([name, value]) => ({
    name: name.replace('_', ' '),
    count: value,
  }));

  const pendingApprovals = users.filter(u => u.verification_status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview and management"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={users.length} subtitle={`${pendingApprovals} pending`} icon={Users} />
        <StatCard title="Waste Reports" value={wasteReports.length} icon={Trash2} />
        <StatCard title="Marketplace Orders" value={orders.length} icon={ShoppingCart} />
        <StatCard title="Platform Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Waste Diverted" value={`${totalWasteDiverted.toFixed(0)} kg`} icon={Trash2} />
        <StatCard title="CO2 Saved" value={`${co2Saved.toFixed(0)} kg`} icon={Leaf} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Waste by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {wasteData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No waste data yet.</p>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wasteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            {roleData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No users yet.</p>
            ) : (
              <div className="h-[250px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {roleData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
          <Link to="/admin/users" className="text-xs text-primary hover:underline flex items-center gap-1">
            Manage users <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {pendingApprovals === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No pending approvals.</p>
          ) : (
            <p className="text-sm text-muted-foreground">{pendingApprovals} user(s) waiting for approval. <Link to="/admin/users" className="text-primary hover:underline">Review now.</Link></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}