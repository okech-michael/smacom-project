import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && <p className="text-xs text-success">{trend}</p>}
        </div>
        {Icon && (
          <div className="rounded-md bg-accent p-2 text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
