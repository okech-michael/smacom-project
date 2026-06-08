import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Check, X, Ban, UserPlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('waste_producer');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: () => apiClient.entities.User.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
      toast.success('User updated');
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const role = inviteRole === 'admin' ? 'admin' : 'user';
      await apiClient.users.inviteUser(inviteEmail, role);
    },
    onSuccess: () => {
      setInviteOpen(false);
      setInviteEmail('');
      toast.success('Invitation sent');
    },
  });

  const filtered = users.filter(u => {
    const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.verification_status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="User Management"
        description={`${users.length} total users`}
        actions={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild><Button><UserPlus className="w-4 h-4 mr-2" />Invite User</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite User</DialogTitle></DialogHeader>
              <form onSubmit={e => { e.preventDefault(); inviteMutation.mutate(); }} className="space-y-4">
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="user@example.com" /></div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waste_producer">Waste Producer</SelectItem>
                      <SelectItem value="bio_processor">Bio Processor</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={inviteMutation.isPending}>
                  {inviteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Send Invitation
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="waste_producer">Waste Producer</SelectItem>
            <SelectItem value="bio_processor">Bio Processor</SelectItem>
            <SelectItem value="farmer">Farmer</SelectItem>
            <SelectItem value="learner">Learner</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{u.email}</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize text-[10px]">{u.role?.replace('_', ' ') || 'user'}</Badge></TableCell>
                    <TableCell><StatusBadge status={u.verification_status || 'pending'} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.created_date ? format(new Date(u.created_date), 'MMM d, yyyy') : ''}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {u.verification_status !== 'approved' && (
                          <Button size="sm" variant="ghost" className="h-7 text-green-600" onClick={() => updateMutation.mutate({ id: u.id, data: { verification_status: 'approved', is_approved: true, is_verified: true } })}>
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        {u.verification_status !== 'suspended' && (
                          <Button size="sm" variant="ghost" className="h-7 text-red-600" onClick={() => updateMutation.mutate({ id: u.id, data: { verification_status: 'suspended' } })}>
                            <Ban className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}