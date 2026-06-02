import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { StatCard } from "@/components/smacom/StatCard";
import { IoTUnitCard } from "@/components/smacom/IoTUnitCard";
import { StatusBadge, Status } from "@/components/smacom/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Activity, Users, Receipt, TrendingUp, BookOpen, FileText, Download, Trash, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getAdminStats, getRoleLabel } from "@/lib/api";
import { useDashboardAuth } from "@/hooks/useDashboardAuth";

const NAV: NavItem[] = [
  { label: "Overview", to: "/dashboard/admin", icon: LayoutDashboard },
  { label: "IoT Status", to: "/dashboard/admin?tab=iot", icon: Activity },
  { label: "Users", to: "/dashboard/admin?tab=users", icon: Users },
  { label: "Transactions", to: "/dashboard/admin?tab=tx", icon: Receipt },
  { label: "Revenue", to: "/dashboard/admin?tab=revenue", icon: TrendingUp },
  { label: "Learning", to: "/dashboard/admin?tab=learning", icon: BookOpen },
  { label: "Reports", to: "/dashboard/admin?tab=reports", icon: FileText },
];

const IOT_UNITS = [
  { name: "Unit 1 West", temp: 62, moisture: 58, co2: 1240, fill: 74, stage: "Active Composting", progress: 65, status: "optimal" as const },
  { name: "Unit 2 East", temp: 42, moisture: 61, co2: 890, fill: 52, stage: "Active Composting", progress: 40, status: "alert" as const },
  { name: "Unit 3 North", temp: 58, moisture: 87, co2: 1100, fill: 87, stage: "Maturation", progress: 80, status: "warning" as const },
];

const PRODUCTION_TREND = [
  { month: "Dec", compost: 14, feed: 6 },
  { month: "Jan", compost: 18, feed: 8 },
  { month: "Feb", compost: 16, feed: 7 },
  { month: "Mar", compost: 22, feed: 10 },
  { month: "Apr", compost: 19, feed: 11 },
  { month: "May", compost: 21, feed: 12 },
];

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useDashboardAuth("admin");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const adminStats = await getAdminStats(token);
          setStats(adminStats);
        }
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin dashboard...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center"><p>Access Denied</p></div>;
  }

  return (
    <DashboardShell role="admin" roleLabel={getRoleLabel(user.role)} userName={user.full_name || user.email} nav={NAV}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Platform overview</h1>
          <p className="text-sm text-muted-foreground">Real-time control across the entire SMACOM ecosystem.</p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="iot">IoT Status</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tx">Transactions</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Waste Collected (Month)" value={`${stats?.waste_collected || 42} MT`} trend="+8% MoM" />
              <StatCard label="Compost Produced" value={`${stats?.compost_produced || 21} MT`} />
              <StatCard label="Platform Revenue" value={`KES ${stats?.revenue || 128400}`} />
              <StatCard label="Active Users" value={`${stats?.active_users || 3214}`} />
            </div>

            <Card className="p-6 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Environmental impact</h2>
                <span className="text-xs font-medium text-primary uppercase tracking-widest">Admin view only</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Metric label="CO₂ Saved" value={`${stats?.co2_saved || 18.4} Tonnes`} />
                <Metric label="Waste Diverted" value={`${stats?.waste_diverted || 42} MT`} />
                <Metric label="Carbon Credits" value={`${stats?.carbon_credits || 9.2}`} />
                <Metric label="Environmental Score" value={`${stats?.environmental_score || 84}/100`} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold mb-4">Monthly production trend</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PRODUCTION_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="compost" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Compost (MT)" />
                    <Line type="monotone" dataKey="feed" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 4 }} name="Feed (MT)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="iot" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-4">
              {[...IOT_UNITS, ...IOT_UNITS.map(u => ({ ...u, name: u.name.replace("Unit", "Digester") }))].map((u, i) => (
                <IoTUnitCard key={i} {...u} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "John Producer", role: "producer", status: "optimal", date: "Jan 2026" },
                    { name: "Jane Processor", role: "processor", status: "optimal", date: "Feb 2026" },
                    { name: "Bob Farmer", role: "farmer", status: "optimal", date: "Mar 2026" },
                  ].map((u, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>
                      <TableCell><StatusBadge status={u.status as Status} label="Active" /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.date}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Trash className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="tx" className="mt-6">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Transaction history will be loaded from API</p>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Revenue analytics will be loaded from API</p>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Learning statistics will be loaded from API</p>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Button><Download className="h-4 w-4 mr-2" />Export Monthly Report</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}