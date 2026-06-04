import os

filepath = r"c:\Users\harshal\.gemini\antigravity-ide\scratch\aquanovax\frontend\src\pages\supplier\SupplierPages.tsx"

new_content = """// Supplier Portal — All Pages (MUI v6 + Supabase Integration)
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Grid2 as Grid, Paper, Chip, 
  CircularProgress, Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge, TrustBadgeComp } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { TANKERS, getTankersBySupplier } from '@/data/tankers';
import { DRIVERS } from '@/data/drivers';
import { QUALITY_REPORTS, REVENUE_DATA } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Package, DollarSign, Truck, Star, Check, X,
  Plus, Edit2, FileText, AlertCircle
} from 'lucide-react';

// ─── SUPPLIER DASHBOARD ───────────────────────────────────────
export function SupplierDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.orders.getAll({ supplierId: user.id }),
      api.suppliers.getOne(user.id).catch(() => ({ name: user.name, rating: 0, trust_score: 0, badge: 'bronze' }))
    ]).then(([ordersData, supData]) => {
      setOrders(ordersData || []);
      setSupplier(supData);
      setLoading(false);
    });
  }, [user]);

  const myTankers = getTankersBySupplier(user?.id || '');
  const activeTankers = myTankers.filter(t => t.status === 'in_use').length;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const orderStatusData = [
    { name: 'Delivered',  value: orders.filter(o => o.status === 'delivered').length,  color: '#10B981' },
    { name: 'Active',     value: orders.filter(o => ['confirmed','dispatched','en_route'].includes(o.status)).length, color: '#0EA5E9' },
    { name: 'Cancelled',  value: orders.filter(o => o.status === 'cancelled').length,   color: '#EF4444' },
    { name: 'Pending',    value: orders.filter(o => o.status === 'pending').length,     color: '#F59E0B' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Box>
        <Typography variant="h4" fontWeight="bold">{supplier?.name || user?.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <TrustBadgeComp badge={supplier?.badge || 'bronze'} />
          <Typography variant="body2" color="text.secondary">
            Trust Score: <Typography component="span" fontWeight="bold" color="text.primary">{supplier?.trust_score || 0}/100</Typography>
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <KPICard title="Total Orders" value={orders.length} icon={Package} iconBg="bg-blue-50" iconColor="text-blue-600" />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <KPICard title="Revenue" value={formatCurrency(revenue)} icon={DollarSign} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <KPICard title="Active Tankers" value={`${activeTankers}/${myTankers.length}`} icon={Truck} iconBg="bg-amber-50" iconColor="text-amber-600" />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <KPICard title="Avg Rating" value={supplier?.rating || 0} icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
        </Grid>
      </Grid>

      {pendingOrders > 0 && (
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
          <AlertCircle className="text-warning-600" />
          <Typography fontWeight="bold" color="warning.dark" sx={{ flex: 1 }}>
            {pendingOrders} new orders awaiting your response
          </Typography>
          <Button variant="contained" color="warning" size="small" href="#orders">View Orders</Button>
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid size={{xs: 12, lg: 8}}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Revenue Trend (Mock)</Typography>
              <Box sx={{ height: 220, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fill="url(#rv)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, lg: 4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Order Distribution</Typography>
              <Box sx={{ height: 180, width: '100%', mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {orderStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {orderStatusData.map(d => (
                  <Box key={d.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color }} />
                      <Typography variant="body2" color="text.secondary">{d.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">{d.value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card id="orders">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Recent Orders</Typography>
            {pendingOrders > 0 && <Chip label={`${pendingOrders} pending`} color="warning" size="small" />}
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(0, 8).map(o => (
                  <TableRow key={o.id} hover>
                    <TableCell><Typography variant="caption" fontFamily="monospace">{o.id.split('-')[0]}</Typography></TableCell>
                    <TableCell>{o.customers?.full_name || 'Customer'}</TableCell>
                    <TableCell>{Number(o.quantity).toLocaleString()}L</TableCell>
                    <TableCell fontWeight="bold">{formatCurrency(o.amount)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">No recent orders.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

// ─── ORDER MANAGEMENT ─────────────────────────────────────────
export function SupplierOrdersPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'pending'|'active'|'completed'>('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = () => {
    setLoading(true);
    api.orders.getAll({ supplierId: user?.id }).then(data => {
      setOrders(data || []);
      setLoading(false);
    });
  };

  const filtered = useMemo(() => {
    if (tab === 'pending')   return orders.filter(o => o.status === 'pending');
    if (tab === 'active')    return orders.filter(o => ['confirmed','dispatched','en_route'].includes(o.status));
    return orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
  }, [tab, orders]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Typography variant="h4" fontWeight="bold">Order Management</Typography>
      
      <Box sx={{ display: 'flex', gap: 1, p: 0.5, bgcolor: 'grey.100', borderRadius: 2, width: 'fit-content' }}>
        {(['pending','active','completed'] as const).map(t => (
          <Button 
            key={t} 
            onClick={() => setTab(t)}
            variant={tab === t ? 'contained' : 'text'}
            color={tab === t ? 'inherit' : 'inherit'}
            sx={{ textTransform: 'capitalize', bgcolor: tab === t ? 'white' : 'transparent', color: tab === t ? 'text.primary' : 'text.secondary', boxShadow: tab === t ? 1 : 0 }}
          >
            {t}
          </Button>
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(o => (
            <Card key={o.id} sx={{ transition: 'all 0.2s', '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{o.customers?.full_name || 'Customer'}</Typography>
                      <StatusBadge status={o.status} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                      {o.id} • {formatDate(o.created_at)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold">{formatCurrency(o.amount)}</Typography>
                    <Typography variant="caption" color="text.secondary">{Number(o.quantity).toLocaleString()}L</Typography>
                  </Box>
                </Box>
                {tab === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button variant="contained" color="success" size="small" startIcon={<Check size={14} />}>Accept</Button>
                    <Button variant="outlined" color="error" size="small" startIcon={<X size={14} />}>Reject</Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card sx={{ textAlign: 'center', py: 8 }}>
              <Package size={48} className="text-muted mx-auto mb-2 opacity-40" />
              <Typography variant="h6" color="text.secondary">No {tab} orders</Typography>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}

// ─── TANKER MANAGEMENT ────────────────────────────────────────
export function TankerManagementPage() {
  const { user } = useAuthStore();
  const myTankers = getTankersBySupplier(user?.id || '');
  const myDrivers = DRIVERS.filter(d => d.supplierId === user?.id);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">Tanker Fleet (Mock)</Typography>
        <Button variant="contained" startIcon={<Plus size={16} />}>Add Tanker</Button>
      </Box>
      
      <Grid container spacing={2}>
        <Grid size={{xs: 12, sm: 4}}>
          <Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4" fontWeight="bold">{myTankers.length}</Typography><Typography variant="body2" color="text.secondary">Total</Typography></CardContent></Card>
        </Grid>
        <Grid size={{xs: 12, sm: 4}}>
          <Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4" fontWeight="bold" color="success.main">{myTankers.filter(t => t.status === 'available').length}</Typography><Typography variant="body2" color="text.secondary">Available</Typography></CardContent></Card>
        </Grid>
        <Grid size={{xs: 12, sm: 4}}>
          <Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h4" fontWeight="bold" color="primary.main">{myTankers.filter(t => t.status === 'in_use').length}</Typography><Typography variant="body2" color="text.secondary">In Use</Typography></CardContent></Card>
        </Grid>
      </Grid>
      
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reg. No</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myTankers.slice(0, 5).map(t => (
                  <TableRow key={t.id}>
                    <TableCell><Typography fontFamily="monospace" variant="body2">{t.registrationNumber}</Typography></TableCell>
                    <TableCell>{t.capacity.toLocaleString()}L</TableCell>
                    <TableCell><Chip size="small" label={t.status.replace('_',' ')} color={t.status === 'available' ? 'success' : 'primary'} /></TableCell>
                    <TableCell><IconButton size="small"><Edit2 size={14} /></IconButton></TableCell>
                  </TableRow>
                ))}
                {myTankers.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No tankers configured</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

// ─── WATER QUALITY PAGE ────────────────────────────────────────
export function WaterQualityPage() {
  const { user } = useAuthStore();
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    if (user) api.suppliers.getOne(user.id).then(setSupplier).catch(() => {});
  }, [user]);

  const tds = supplier?.tds || 50;
  const ph = supplier?.ph || 7.2;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Typography variant="h4" fontWeight="bold">Water Quality (Mock)</Typography>
      
      <Card sx={{ textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h2" fontWeight="bold" color="primary.main">85</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>Overall Quality Score</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {[
          { label: 'TDS', value: `${tds} ppm` },
          { label: 'pH Level', value: ph },
        ].map(m => (
          <Grid size={{xs: 12, sm: 6}} key={m.label}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">{m.value}</Typography>
                <Typography variant="body2" color="text.secondary">{m.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ─── SUPPLIER ANALYTICS ────────────────────────────────────────
export function SupplierAnalyticsPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Typography variant="h4" fontWeight="bold">Analytics (Mock)</Typography>
      <Grid container spacing={3}>
        <Grid size={{xs: 12, lg: 6}}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Monthly Revenue</Typography>
              <Box sx={{ height: 240, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ─── SUPPLIER PROFILE MANAGEMENT ──────────────────────────────
export function SupplierProfileManagementPage() {
  const { user } = useAuthStore();
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    if (user) api.suppliers.getOne(user.id).then(setSupplier).catch(() => {});
  }, [user]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600, mx: 'auto' }} className="animate-fade-in">
      <Typography variant="h4" fontWeight="bold">Profile Management</Typography>
      
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Business Information</Typography>
          <TextField label="Business Name" defaultValue={supplier?.name || user?.name || ''} fullWidth size="small" />
          <TextField label="Email" defaultValue={user?.email || ''} fullWidth size="small" />
          <TextField label="Price per KL" defaultValue={supplier?.price || ''} fullWidth size="small" type="number" />
          <Button variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
"""

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)
