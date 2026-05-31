import { useState } from "react";
import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { StatusBadge, Status } from "@/components/smacom/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recycle, ListChecks, Coins, BarChart3, Upload, MapPin, Navigation } from "lucide-react";
import { useDashboardAuth } from "@/hooks/useDashboardAuth";
import { getRoleLabel } from "@/lib/api";

const NAV: NavItem[] = [
  { label: "Report Waste", to: "/dashboard/producer", icon: Recycle },
  { label: "My Requests", to: "/dashboard/producer?tab=requests", icon: ListChecks },
  { label: "Credits", to: "/dashboard/producer?tab=credits", icon: Coins },
  { label: "Insights", to: "/dashboard/producer?tab=insights", icon: BarChart3 },
];

const SUBTYPES: Record<string, string[]> = {
  food: ["Raw Vegetable", "Cooked", "Fruit Peels", "Mixed Kitchen"],
  yard: ["Grass Clippings", "Garden Trim", "Leaves"],
  agri: ["Crop Residue", "Manure", "Husks"],
  restaurant: ["Cooked", "Mixed Plate Waste", "Used Cooking Oil"],
  industrial: ["Brewery Sludge", "Dairy Byproduct", "Other Organic"],
  other: ["Specify in notes"],
};

export default function ProducerDashboard() {
  const { user, loading: authLoading } = useDashboardAuth("producer");
  const [category, setCategory] = useState("food");
  const [locMode, setLocMode] = useState<"gps" | "address">("gps");

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardShell role="producer" roleLabel={getRoleLabel(user.role)} userName={user.full_name || user.email} nav={NAV}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Report waste</h1>
          <p className="text-sm text-muted-foreground">Log your waste in under a minute. A nearby processor will accept the pickup.</p>
        </div>

        <Tabs defaultValue="report">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="report">Report Waste</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="insights">Quality Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="mt-6">
            <Card className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Waste Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food Waste</SelectItem>
                      <SelectItem value="yard">Yard Waste</SelectItem>
                      <SelectItem value="agri">Agricultural Waste</SelectItem>
                      <SelectItem value="restaurant">Restaurant Waste</SelectItem>
                      <SelectItem value="industrial">Industrial Organic Waste</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Sub-type</Label>
                  <Select defaultValue={SUBTYPES[category][0]}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUBTYPES[category].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Quantity (kg)</Label>
                  <Input type="number" placeholder="120" />
                </div>
                <div className="space-y-1.5">
                  <Label>Additional notes</Label>
                  <Input placeholder="Any special handling info" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Photos</Label>
                <label className="flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition">
                  <Upload className="h-7 w-7 text-muted-foreground" />
                  <p className="text-sm font-medium">Upload Waste Photo</p>
                  <p className="text-xs text-muted-foreground">Min 1, max 5 photos · JPEG, PNG, HEIC · max 10MB each</p>
                  <input type="file" multiple className="sr-only" />
                </label>
              </div>

              <div className="space-y-2">
                <Label>Pickup location</Label>
                <div className="flex gap-2">
                  <Button variant={locMode === "gps" ? "default" : "outline"} size="sm" onClick={() => setLocMode("gps")}><Navigation className="h-4 w-4" />Use my GPS</Button>
                  <Button variant={locMode === "address" ? "default" : "outline"} size="sm" onClick={() => setLocMode("address")}><MapPin className="h-4 w-4" />Enter address / drop pin</Button>
                </div>
                <div className="aspect-[16/6] rounded-md border border-border bg-secondary flex items-center justify-center text-sm text-muted-foreground">
                  <div className="text-center"><MapPin className="h-6 w-6 mx-auto mb-1" />Map preview</div>
                </div>
                {locMode === "address" && <Input placeholder="Enter address" />}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md bg-accent border border-accent-foreground/10 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated disposal fee</p>
                  <p className="text-xl font-bold text-accent-foreground">KES 350</p>
                </div>
                <Button size="lg">Submit collection request</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="mt-6 space-y-3">
            {[
              { id: "REQ-3041", date: "06 May 2026", type: "Food Waste — Cooked", qty: "85 kg", status: "pending", label: "Pending Pickup" },
              { id: "REQ-3040", date: "05 May 2026", type: "Food Waste — Raw Vegetable", qty: "120 kg", status: "info", label: "Processor Assigned" },
              { id: "REQ-3039", date: "04 May 2026", type: "Yard Waste", qty: "240 kg", status: "warning", label: "En Route" },
              { id: "REQ-3038", date: "03 May 2026", type: "Food Waste — Mixed", qty: "180 kg", status: "optimal", label: "Collected" },
            ].map((r) => (
              <Card key={r.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{r.id} · {r.type}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.date} · {r.qty}</p>
                </div>
                <StatusBadge status={r.status as Status} label={r.label} />
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="credits" className="mt-6">
            <Card className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Available credits</p>
              <p className="text-5xl font-extrabold tracking-tight mt-2">1,240</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-8 max-w-md mx-auto text-left">
                <div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">Last deposit</p><p className="font-semibold">+120 credits · 2 days ago</p></div>
                <div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">Next payout</p><p className="font-semibold">1 June 2026</p></div>
              </div>
              <Button className="mt-6">Redeem credits</Button>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card className="p-6">
              <h2 className="font-semibold">Last submission quality</h2>
              <p className="text-sm text-muted-foreground">Food Waste — Cooked · 80 kg</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <div className="rounded-md border border-border p-4"><p className="text-xs text-muted-foreground">Moisture level</p><p className="text-2xl font-bold mt-1">68%</p><StatusBadge status="optimal" label="Acceptable" className="mt-2" /></div>
                <div className="rounded-md border border-warning/40 p-4 bg-warning/5"><p className="text-xs text-muted-foreground">Contamination</p><p className="text-2xl font-bold mt-1">12%</p><StatusBadge status="warning" label="Improvement needed" className="mt-2" /></div>
              </div>
              <div className="mt-4 rounded-md border border-border bg-secondary/40 p-4 text-sm">
                <p className="font-medium">Tip</p>
                <p className="text-muted-foreground mt-1">Separate cooked food from packaging before logging to reduce contamination.</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
