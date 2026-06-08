import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';

export default function TopBar({ user, onMenuClick }) {
  const { data: notifications = [] } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: () => apiClient.entities.Notification.filter({ user_id: user?.id, is_read: false }, '-created_date', 5),
    enabled: !!user?.id,
  });

  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border h-14 flex items-center px-4 lg:px-6 gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden w-11 h-11"
        onClick={onMenuClick}
      >
        <Menu className="w-7 h-7" />
      </Button>

      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </Link>
        <Link to="/settings">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            {user?.full_name?.[0] || 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
}