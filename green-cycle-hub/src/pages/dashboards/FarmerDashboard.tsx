import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { ProductCard } from "@/components/smacom/ProductCard";
import { StatusBadge, Status } from "@/components/smacom/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, ShoppingBag, Sparkles, Award, LifeBuoy, Medal } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";
import { useState } from "react";
import { useDashboardAuth } from "@/hooks/useDashboardAuth";
import { getRoleLabel } from "@/lib/api";

const NAV: NavItem[] = [
  { label: "Marketplace", to: "/dashboard/farmer", icon: Store },
  { label: "Orders", to: "/dashboard/farmer?tab=orders", icon: ShoppingBag },
  { label: "AI Recs", to: "/dashboard/farmer?tab=ai", icon: Sparkles },
  { label: "Eco Badge", to: "/dashboard/farmer?tab=badge", icon: Award },
  { label: "Support", to: "/dashboard/farmer?tab=support", icon: LifeBuoy },
];

export default function FarmerDashboard() {
  const { user, loading: authLoading } = useDashboardAuth("farmer");
  const [price, setPrice] = useState([0, 5000]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardShell role="farmer" roleLabel={getRoleLabel(user.role)} userName={user.full_name || user.email} nav={NAV}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Eco-Marketplace</h1>
          <p className="text-sm text-muted-foreground">Verified compost, fertiliser and feed from trusted processors.</p>
        </div>

        <Tabs defaultValue="marketplace">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="ai">AI Recommendation</TabsTrigger>
            <TabsTrigger value="badge">Eco Badge</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="mt-6 space-y-6">
            <Card className="p-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select defaultValue="all">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="fertiliser">Fertiliser</SelectItem>
                      <SelectItem value="packaging">Packaging</SelectItem>
                      <SelectItem value="feed">Feed</SelectItem>
                      <SelectItem value="eco">Eco Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Price range (KES) — up to {price[1].toLocaleString()}</Label>
                  <Slider value={price} onValueChange={setPrice} min={0} max={10000} step={500} />
                </div>
                <div className="space-y-1.5">
                  <Label>Seller</Label>
                  <Select defaultValue="all">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sellers</SelectItem>
                      <SelectItem value="gc">GreenCycle Processors</SelectItem>
                      <SelectItem value="bf">BioFarm Solutions</SelectItem>
                      <SelectItem value="ef">EcoFeed Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PRODUCTS.map((p) => (<ProductCard key={p.name} {...p} />))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <div className="p-6 pb-3"><h2 className="font-semibold">My Orders</h2></div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Order</TableHead><TableHead>Product</TableHead><TableHead>Qty</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["ORD-1042","Premium Organic Compost","2 MT","KES 9,000","delivered","02 May 2026"],
                    ["ORD-1041","Liquid Fertiliser","4 × 20L","KES 4,800","info","04 May 2026"],
                    ["ORD-1040","Animal Feed Mix","100 kg","KES 5,600","pending","05 May 2026"],
                  ].map((r) => (
                    <TableRow key={r[0]}>
                      <TableCell className="font-medium">{r[0]}</TableCell>
                      <TableCell>{r[1]}</TableCell>
                      <TableCell>{r[2]}</TableCell>
                      <TableCell>{r[3]}</TableCell>
                      <TableCell>
                        <StatusBadge status={r[4] as Status} label={r[4] === "delivered" ? "Delivered" : r[4] === "info" ? "In Transit" : "Pending"} />
                      </TableCell>
                      <TableCell>{r[5]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-6 space-y-4">
            <Card className="p-6">
              <h2 className="font-semibold">Soil sample summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[["Nitrogen (N)","1.2 mg/kg"],["Phosphorus (P)","0.8 mg/kg"],["Potassium (K)","2.1 mg/kg"],["Crop","Maize"]].map(([l,v]) => (
                  <div key={l} className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="font-semibold mt-0.5">{v}</p></div>
                ))}
              </div>
            </Card>
            <Card className="p-6 border-primary/40 bg-accent/40">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">Recommended product</h3>
                  <p className="text-sm mt-1">Apply <span className="font-semibold">1.5 MT Premium Organic Compost</span> — 30 days before sowing.</p>
                  <p className="text-sm text-muted-foreground mt-1.5">Reason: low nitrogen levels detected. This product provides NPK 3-2-2 which suits your soil profile.</p>
                  <Button className="mt-4">Add to Cart</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="badge" className="mt-6">
            <Card className="p-8 text-center">
              <div className="inline-flex h-20 w-20 rounded-full bg-accent items-center justify-center mb-4">
                <Medal className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Silver Eco Contributor</h2>
              <p className="text-sm text-muted-foreground mt-1">12 verified eco-purchases · KES 64,800 total spend</p>
              <div className="max-w-md mx-auto mt-6">
                <div className="flex justify-between text-xs mb-1.5"><span>Progress to Gold</span><span className="font-medium">68%</span></div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: "68%" }} /></div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <Card className="p-6">
              <h2 className="font-semibold">Need help?</h2>
              <p className="text-sm text-muted-foreground mt-1">Send us a message and we'll get back within 24 hours.</p>
              <div className="space-y-3 mt-4">
                <Input placeholder="Subject" />
                <textarea className="w-full min-h-[120px] rounded-md border border-input bg-background p-3 text-sm" placeholder="How can we help?" />
                <Button>Send message</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
