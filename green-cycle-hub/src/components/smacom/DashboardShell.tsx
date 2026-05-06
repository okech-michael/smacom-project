import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "./Logo";
import { NotificationPanel } from "./NotificationPanel";
import { ROLES, RoleId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  to: string;
  icon: any;
}

interface Props {
  role: RoleId;
  roleLabel: string;
  userName: string;
  nav: NavItem[];
  children: ReactNode;
}

export function DashboardShell({ role, roleLabel, userName, nav, children }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  const sidebar = (
    <nav className="flex flex-col gap-1 p-3">
      {nav.map((item) => {
        const active = pathname === item.to || (item.to !== nav[0].to && pathname.startsWith(item.to));
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                (isActive || active)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4 border-b border-border"><Logo /></div>
                {sidebar}
              </SheetContent>
            </Sheet>
            <Logo />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Viewing as:</span>
              <Select value={role} onValueChange={(val) => navigate(`/dashboard/${val}`)}>
                <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setNotifOpen(true)} aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary text-primary-foreground">{userName.split(" ").map(w => w[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-tight">{userName}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-border min-h-[calc(100vh-4rem)] bg-card">
          {sidebar}
        </aside>
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card">
        <div className="grid grid-cols-4">
          {nav.slice(0, 4).map((item) => {
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={cn("flex flex-col items-center gap-1 py-2.5 text-xs", active ? "text-primary" : "text-muted-foreground")}>
                <item.icon className="h-5 w-5" />
                <span className="truncate max-w-[64px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />
    </div>
  );
}
