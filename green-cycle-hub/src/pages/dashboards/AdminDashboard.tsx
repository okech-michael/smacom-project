import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { StatCard } from "@/components/smacom/StatCard";
import { IoTUnitCard } from "@/components/smacom/IoTUnitCard";
import { StatusBadge, Status } from "@/components/smacom/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Activity, Users, Receipt, TrendingUp, BookOpen, FileText, Download, Trash, Pencil } from "lucide-react";
import { IOT_UNITS, COURSES, PRODUCTION_TREND } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const NAV: NavItem[] = [
  { label: "Overview", to: "/dashboard/admin", icon: LayoutDashboard },
  { label: "IoT Status", to: "/dashboard/admin?tab=iot", icon: Activity },
  { label: "Users", to: "/dashboard/admin?tab=users", icon: Users },
  { label: "Transactions", to: "/dashboard/admin?tab=tx", icon: Receipt },
  { label: "Revenue", to: "/dashboard/admin?tab=revenue", icon: TrendingUp },
  { label: "Learning", to: "/dashboard/admin?tab=learning", icon: BookOpen },
  { label: "Reports", to: "/dashboard/admin?tab=reports", icon: FileText },
];

export default function AdminDashboard() {
  return (
    <DashboardShell role="admin" roleLabel="Admin" userName="SMACOM Admin" nav={NAV}>
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
              <StatCard label="Waste Collected (Month)" value="42 MT" trend="+8% MoM" />
              <StatCard label="Compost Produced" value="21 MT" />
              <StatCard label="Platform Revenue" value="KES 128,400" />
              <StatCard label="Active Users" value="3,214" />
            </div>

            <Card className="p-6 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Environmental impact</h2>
                <span className="text-xs font-medium text-primary uppercase tracking-widest">Admin view only</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Metric label="CO₂ Saved" value="18.4 Tonnes" />
                <Metric label="Waste Diverted" value="42 MT" />
                <Metric label="Carbon Credits" value="9.2" />
                <Metric label="Environmental Score" value="84/100" />
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
            <Card>
              <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold">Users</h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="producer">Producer</SelectItem>
                    <SelectItem value="processor">Processor</SelectItem>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="learner">Learner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Registered</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Wanjiku Mwangi","Farmer","optimal","Verified","12 Apr 2026"],
                    ["GreenCycle Processors","Processor","optimal","Verified","04 Mar 2026"],
                    ["Sarit Centre Foods","Producer","pending","Pending","05 May 2026"],
                    ["Brian Mutua","Learner","optimal","Verified","18 Apr 2026"],
                    ["EcoFeed Africa","Processor","alert","Suspended","22 Feb 2026"],
                  ].map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r[0]}</TableCell>
                      <TableCell>{r[1]}</TableCell>
                      <TableCell><StatusBadge status={r[2] as Status} label={r[3]} /></TableCell>
                      <TableCell>{r[4]}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Verify</Button>
                        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="tx" className="mt-6 space-y-4">
            <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-warning text-warning-foreground text-xs font-semibold">8</span>
                <span className="font-medium">Pending orders need approval</span>
              </div>
              <Button>Approve all orders</Button>
            </Card>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Commission</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["TX-9042","Marketplace Purchase","KES 9,000","7%","04 May 2026","optimal","Settled"],
                    ["TX-9041","Disposal Fee","KES 350","5%","05 May 2026","pending","Pending"],
                    ["TX-9040","Marketplace Purchase","KES 4,800","7%","04 May 2026","optimal","Settled"],
                    ["TX-9039","Disposal Fee","KES 480","5%","03 May 2026","optimal","Settled"],
                  ].map((r) => (
                    <TableRow key={r[0]}>
                      <TableCell className="font-medium">{r[0]}</TableCell>
                      <TableCell>{r[1]}</TableCell>
                      <TableCell>{r[2]}</TableCell>
                      <TableCell>{r[3]}</TableCell>
                      <TableCell>{r[4]}</TableCell>
                      <TableCell><StatusBadge status={r[5] as Status} label={r[6]} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard label="Disposal Fee Revenue (5%)" value="KES 42,000" />
              <StatCard label="Marketplace Commission (7%)" value="KES 86,400" />
              <StatCard label="Total SMACOM Revenue" value="KES 128,400" trend="+12% MoM" />
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard label="Active Courses" value="14" />
              <StatCard label="Total Enrolments" value="1,082" />
              <StatCard label="Course Revenue" value="KES 1.84M" />
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Title</TableHead><TableHead>Instructor</TableHead><TableHead>Enrolments</TableHead><TableHead>Fee</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {COURSES.map((c, i) => (
                    <TableRow key={c.title}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell>{c.instructor}</TableCell>
                      <TableCell>{[420, 318, 344][i]}</TableCell>
                      <TableCell>{c.fee}</TableCell>
                      <TableCell><StatusBadge status="optimal" label="Active" /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Trash className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6 space-y-4">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Generate report</h2>
              <div className="flex flex-wrap items-center gap-3">
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Generate report</Button>
                <Button variant="outline"><Download className="h-4 w-4" />Download PDF</Button>
                <Button variant="outline"><Download className="h-4 w-4" />Download CSV</Button>
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Last generated</p>
              <h3 className="font-semibold mt-1">Monthly platform report — April 2026</h3>
              <p className="text-sm text-muted-foreground mt-1">Generated 01 May 2026 · 18 pages</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">Waste collected</p><p className="font-semibold">38 MT</p></div>
                <div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">Revenue</p><p className="font-semibold">KES 114,200</p></div>
                <div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">New users</p><p className="font-semibold">218</p></div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
