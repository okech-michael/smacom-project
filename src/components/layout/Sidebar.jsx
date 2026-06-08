import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Trash2, ShoppingCart, GraduationCap, Users,
  Settings, Bell, Package, MapPin, Cpu, BarChart3, CreditCard,
  Leaf, TrendingUp, BookOpen, ShoppingBag, Truck, Wallet,
  Award, ChevronLeft, ChevronRight, LogOut, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/api/apiClient';

const roleNavItems = {
  waste_producer: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Report Waste', path: '/waste/report', icon: Trash2 },
    { label: 'My Pickups', path: '/waste/pickups', icon: Truck },
    { label: 'Credits Wallet', path: '/wallet', icon: Wallet },
    { label: 'Eco Marketplace', path: '/marketplace', icon: ShoppingCart },
    { label: 'Learning', path: '/learning', icon: GraduationCap },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ],
  bio_processor: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Pickup Requests', path: '/processor/pickups', icon: MapPin },
    { label: 'Inventory', path: '/processor/inventory', icon: Package },
    { label: 'My Products', path: '/processor/products', icon: ShoppingBag },
    { label: 'Earnings', path: '/processor/earnings', icon: TrendingUp },
    { label: 'IoT Devices', path: '/iot', icon: Cpu },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ],
  farmer: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Eco Marketplace', path: '/marketplace', icon: ShoppingCart },
    { label: 'My Orders', path: '/orders', icon: ShoppingBag },
    { label: 'AI Advisor', path: '/ai-advisor', icon: Leaf },
    { label: 'Learning', path: '/learning', icon: GraduationCap },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ],
  learner: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Courses', path: '/learning', icon: GraduationCap },
    { label: 'My Courses', path: '/learning/my-courses', icon: BookOpen },
    { label: 'Certificates', path: '/learning/certificates', icon: Award },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Waste Reports', path: '/admin/waste', icon: Trash2 },
    { label: 'Marketplace', path: '/admin/marketplace', icon: ShoppingCart },
    { label: 'Courses', path: '/admin/courses', icon: GraduationCap },
    { label: 'IoT Monitoring', path: '/admin/iot', icon: Cpu },
    { label: 'Finances', path: '/admin/finances', icon: CreditCard },
    { label: 'Environment', path: '/admin/environment', icon: Leaf },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
};

export default function Sidebar({ user, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const role = user?.role || 'waste_producer';
  const items = roleNavItems[role] || roleNavItems.waste_producer;

  const handleLogout = () => {
    apiClient.auth.logout('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-foreground tracking-tight">SMACOM</h1>
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">Solutions</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-foreground">
              {user?.full_name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-sidebar-foreground/50 capitalize">{role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5 text-sidebar-foreground/60" />
          </button>
        </div>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}>
        <NavContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}