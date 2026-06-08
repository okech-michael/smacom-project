import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Cpu, Thermometer, Droplets, Wind, Gauge, Plus, AlertTriangle, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { format } from 'date-fns';

const sensorIcons = { temperature: Thermometer, moisture: Droplets, co2: Wind, fill_level: Gauge, multi_sensor: Cpu };

export default function IoTDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [form, setForm] = useState({ device_id: '', name: '', type: '', location: '' });
  const isAdmin = user?.role === 'admin';

  const { data: devices = [] } = useQuery({
    queryKey: ['iot-devices'],
    queryFn: () => isAdmin
      ? apiClient.entities.IoTDevice.list('-created_date', 100)
      : apiClient.entities.IoTDevice.filter({ owner_id: user?.id }, '-created_date', 100),
    enabled: !!user?.id,
  });

  const { data: readings = [] } = useQuery({
    queryKey: ['sensor-readings', selectedDevice?.id],
    queryFn: () => apiClient.entities.SensorReading.filter({ device_id: selectedDevice?.device_id }, '-created_date', 50),
    enabled: !!selectedDevice,
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['iot-alerts'],
    queryFn: () => apiClient.entities.SensorReading.filter({ is_alert: true }, '-created_date', 20),
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.IoTDevice.create({ ...data, owner_id: user.id, status: 'offline' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iot-devices'] });
      setOpen(false);
      setForm({ device_id: '', name: '', type: '', location: '' });
      toast.success('Device registered');
    },
  });

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const alertCount = alerts.length;

  const chartData = readings.map(r => ({
    time: r.created_date ? format(new Date(r.created_date), 'HH:mm') : '',
    value: r.value,
  })).reverse();

  return (
    <div>
      <PageHeader
        title="IoT Monitoring"
        description="Real-time sensor data and device management."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Register Device</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Register IoT Device</DialogTitle></DialogHeader>
              <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
                <div className="space-y-2"><Label>Device ID</Label><Input value={form.device_id} onChange={e => setForm(f => ({ ...f, device_id: e.target.value }))} placeholder="e.g. SENSOR-001" /></div>
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Compost Bin Temp" /></div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="moisture">Moisture</SelectItem>
                      <SelectItem value="co2">CO2</SelectItem>
                      <SelectItem value="fill_level">Fill Level</SelectItem>
                      <SelectItem value="multi_sensor">Multi-Sensor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Warehouse A" /></div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Register
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Devices" value={devices.length} icon={Cpu} />
        <StatCard title="Online" value={onlineCount} icon={Cpu} />
        <StatCard title="Active Alerts" value={alertCount} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Devices</CardTitle></CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No devices registered.</p>
              ) : (
                <div className="space-y-2">
                  {devices.map(device => {
                    const Icon = sensorIcons[device.type] || Cpu;
                    return (
                      <button
                        key={device.id}
                        onClick={() => setSelectedDevice(device)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedDevice?.id === device.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                      >
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{device.name}</p>
                          <p className="text-[10px] text-muted-foreground">{device.location}</p>
                        </div>
                        <StatusBadge status={device.status} />
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedDevice ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{selectedDevice.name} - Readings</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No readings recorded for this device.</p>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center">
                <Cpu className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select a device to view its readings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}