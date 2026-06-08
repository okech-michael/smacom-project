import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Package, CreditCard, AlertTriangle, GraduationCap, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const typeIcons = {
  waste_pickup: Package,
  order_update: Package,
  payment: CreditCard,
  system: Bell,
  alert: AlertTriangle,
  course: GraduationCap,
  subscription: CreditCard,
  iot_alert: Cpu,
};

export default function Notifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: () => apiClient.entities.Notification.filter({ user_id: user?.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => apiClient.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read);
      for (const n of unread) {
        await apiClient.entities.Notification.update(n.id, { is_read: true });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        actions={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllReadMutation.mutate()}>
              <Check className="w-4 h-4 mr-2" />Mark All Read
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => {
            const Icon = typeIcons[notif.type] || Bell;
            return (
              <Card
                key={notif.id}
                className={cn("cursor-pointer transition-colors", !notif.is_read && "bg-primary/5 border-primary/10")}
                onClick={() => !notif.is_read && markReadMutation.mutate(notif.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", notif.is_read ? "bg-muted" : "bg-primary/10")}>
                    <Icon className={cn("w-4 h-4", notif.is_read ? "text-muted-foreground" : "text-primary")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm", !notif.is_read && "font-semibold")}>{notif.title}</p>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {notif.created_date ? format(new Date(notif.created_date), 'MMM d, HH:mm') : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                  {!notif.is_read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}