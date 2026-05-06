import { useState } from "react";
import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { StatCard } from "@/components/smacom/StatCard";
import { IoTUnitCard } from "@/components/smacom/IoTUnitCard";
import { PickupRequestCard } from "@/components/smacom/PickupRequestCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Activity, Truck, ClipboardList, Boxes, Wallet } from "lucide-react";
import { IOT_UNITS, PICKUP_REQUESTS, INTAKE_LOG } from "@/lib/mock-data";

const NAV: NavItem[] = [
  { label: "Overview", to: "/dashboard/processor", icon: LayoutDashboard },
  { label: "IoT Units", to: "/dashboard/processor?tab=iot", icon: Activity },
  { label: "Pickups", to: "/dashboard/processor?tab=pickups", icon: Truck },
  { label: "Intake", to: "/dashboard/processor?tab=intake", icon: ClipboardList },
  { label: "Inventory", to: "/dashboard/processor?tab=inventory", icon: Boxes },
  { label: "Earnings", to: "/dashboard/processor?tab=earnings", icon: Wallet },
];

export default function ProcessorDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardShell role="processor" roleLabel="Bio-Processor" userName="GreenCycle Processors" nav={NAV}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, GreenCycle</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening at your facility today.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pickups">Pickup Requests</TabsTrigger>
            <TabsTrigger value="intake">Waste Intake</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Waste Intake Today" value="1.7 MT" trend="+12% vs yesterday" />
              <StatCard label="Compost Inventory" value="3.5 MT" />
              <StatCard label="Feed Inventory" value="1.2 MT" />
              <StatCard label="Pending Pickups" value="4" />
            </div>
            <div>
              <h2 className="font-semibold mb-3">Composting Units</h2>
              <div className="grid lg:grid-cols-3 gap-4">
                {IOT_UNITS.map((u) => (<IoTUnitCard key={u.name} {...u} />))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pickups" className="space-y-4 mt-6">
            {PICKUP_REQUESTS.map((p) => (<PickupRequestCard key={p.id} {...p} />))}
          </TabsContent>

          <TabsContent value="intake" className="space-y-6 mt-6">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Record Waste Intake</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Source / Producer ID</Label><Input placeholder="GP-1042" /></div>
                <div className="space-y-1.5"><Label>Quantity Received (kg)</Label><Input type="number" placeholder="120" /></div>
              </div>
              <Button className="mt-4">Confirm Intake & Assign Batch</Button>
            </Card>
            <Card>
              <div className="p-6 pb-3"><h2 className="font-semibold">Recent Intake Log</h2></div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Date</TableHead><TableHead>Producer</TableHead><TableHead>Type</TableHead><TableHead>Quantity</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {INTAKE_LOG.map((row, i) => (
                    <TableRow key={i}><TableCell>{row.date}</TableCell><TableCell>{row.producer}</TableCell><TableCell>{row.type}</TableCell><TableCell>{row.quantity}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Inventory</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <StatCard label="Compost — Premium" value="2.1 MT" />
                <StatCard label="Compost — Standard" value="1.4 MT" />
                <StatCard label="Animal Feed" value="1.2 MT" />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard label="Total Payout Received" value="KES 412,800" />
              <StatCard label="Pending Payouts" value="KES 38,400" />
              <StatCard label="Last Payout" value="KES 86,200" />
            </div>
            <Card>
              <div className="p-6 pb-3"><h2 className="font-semibold">Payout History</h2></div>
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Reference</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {[
                    ["28 Apr 2026","PO-2042","KES 86,200","Paid"],
                    ["14 Apr 2026","PO-2041","KES 72,400","Paid"],
                    ["31 Mar 2026","PO-2040","KES 91,800","Paid"],
                  ].map((r, i) => (
                    <TableRow key={i}>{r.map((c, j) => <TableCell key={j}>{c}</TableCell>)}</TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
