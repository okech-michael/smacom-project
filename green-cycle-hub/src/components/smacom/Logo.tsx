import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-3 font-bold tracking-tight", className)}>
      <img
        src="/waste-to-wealth-logo.svg"
        alt="Waste to Wealth Clean Solutions logo"
        className="h-12 w-auto"
      />
      <span className="sr-only">Waste to Wealth Clean Solutions</span>
    </Link>
  );
}
