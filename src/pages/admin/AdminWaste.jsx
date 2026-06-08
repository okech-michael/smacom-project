import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminWaste() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: reports = [] } = useQuery({
    queryKey: ['admin-waste-reports'],
    queryFn: () => apiClient.entities.WasteReport.list('-created_date', 200),
  });

  const filtered = reports.filter(r => {
    const matchSearch = !search || r.address?.toLowerCase().includes(search.toLowerCase()) || r.waste_type?.includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalKg = filtered.reduce((s, r) => s + (r.quantity_kg || 0), 0);

  return (
    <div>
      <PageHeader title="Waste Reports" description={`${filtered.length} reports - ${totalKg.toFixed(0)} kg total`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending_pickup">Pending Pickup</SelectItem>
            <SelectItem value="processor_assigned">Assigned</SelectItem>
            <SelectItem value="en_route">En Route</SelectItem>
            <SelectItem value="collected">Collected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="capitalize font-medium">{r.waste_type?.replace('_', ' ')}</TableCell>
                    <TableCell>{r.quantity_kg} kg</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">{r.address}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : ''}</TableCell>
                    <TableCell className="text-xs">KES {r.disposal_fee?.toLocaleString() || '0'}</TableCell>
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