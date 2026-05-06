import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { AlertTriangle, Bell, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {NOTIFICATIONS.map((n) => {
            const Icon = n.level === "alert" ? AlertTriangle : n.level === "warning" ? Bell : Info;
            const color = n.level === "alert" ? "text-destructive" : n.level === "warning" ? "text-warning" : "text-primary";
            return (
              <div key={n.id} className="flex gap-3 rounded-md border border-border p-3">
                <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", color)} />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
