import { cn } from "@/lib/utils";

export type Status = "optimal" | "alert" | "warning" | "pending" | "info" | "delivered";

const styles: Record<Status, string> = {
  optimal: "bg-success/10 text-success border-success/20",
  alert: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  pending: "bg-muted text-muted-foreground border-border",
  info: "bg-accent text-accent-foreground border-accent",
  delivered: "bg-success/10 text-success border-success/20",
};

const dotStyles: Record<Status, string> = {
  optimal: "bg-success",
  alert: "bg-destructive",
  warning: "bg-warning",
  pending: "bg-muted-foreground",
  info: "bg-primary",
  delivered: "bg-success",
};

export function StatusBadge({ status, label, className }: { status: Status; label?: string; className?: string }) {
  const text = label ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[status])} />
      {text}
    </span>
  );
}
