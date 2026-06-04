// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Droplets, Star, Wallet, TrendingUp, MapPin, Clock, ChevronRight } from 'lucide-react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar as MuiAvatar, CircularProgress
} from '@mui/material';
import { MockMap } from '@/components/maps/MockMap';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrustBadgeComp, StatusBadge } from '@/components/common/Badge';
import { RatingDisplay } from '@/components/common/StarRating';
import { Avatar } from '@/components/common/Avatar';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.orders.getAll({ customerId: user.id }),
      api.suppliers.getAll()
    ]).then(([ordersData, suppliersData]) => {
      setOrders(ordersData || []);
      setSuppliers(suppliersData || []);
      setWalletBalance(3450); // Mock wallet balance for now
      setLoading(false);
    });
  }, [user]);

  const activeOrders = orders.filter(o => ['pending','accepted','in_transit'].includes(o.status));
  const topSuppliers = suppliers.sort((a,b) => b.trust_score - a.trust_score).slice(0,5);

  const MAP_POINTS = suppliers.slice(0,8).map((s,i) => ({
    id: s.id,
    lat: 19.07 + (i*0.02),
    lng: 72.87 + (i*0.02),
    type: 'supplier' as const,
    label: s.name.slice(0,8),
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 4 }} className="animate-fade-in">
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          Good morning, {user?.name?.split(' ')[0] || 'User'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your water supply overview for today
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 3}}    >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MuiAvatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Package size={20} />
                </MuiAvatar>
                <Typography variant="subtitle2" color="text.secondary">Active Orders</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">{activeOrders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}    >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MuiAvatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <Wallet size={20} />
                </MuiAvatar>
                <Typography variant="subtitle2" color="text.secondary">Wallet Balance</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">{formatCurrency(walletBalance)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}    >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MuiAvatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Droplets size={20} />
                </MuiAvatar>
                <Typography variant="subtitle2" color="text.secondary">Quality Score</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">94<Typography component="span" variant="body2" color="text.secondary">/100</Typography></Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}    >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MuiAvatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Star size={20} />
                </MuiAvatar>
                <Typography variant="subtitle2" color="text.secondary">Saved Suppliers</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">8</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Nearby Suppliers Map */}
        <Grid size={{xs: 12, lg: 8}}   >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Nearby Suppliers</Typography>
                <Typography variant="body2" color="text.secondary">8 suppliers found within 15 km</Typography>
              </Box>
              <Button variant="outlined" size="small" onClick={() => navigate('/customer/marketplace')}>
                View All
              </Button>
            </Box>
            <Box sx={{ flex: 1 }}>
              <MockMap points={MAP_POINTS} height="300px" />
            </Box>
          </Card>
        </Grid>

        {/* Active Orders */}
        <Grid size={{xs: 12, lg: 4}}   >
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Active Orders</Typography>
                <Button variant="text" size="small" endIcon={<ChevronRight size={16} />} onClick={() => navigate('/customer/orders')}>
                  View all
                </Button>
              </Box>

              {activeOrders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Package size={40} className="text-muted mx-auto mb-2 opacity-40" />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>No active orders</Typography>
                  <Button variant="contained" size="small" onClick={() => navigate('/customer/book')}>
                    Book Now
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {activeOrders.slice(0,3).map(order => (
                    <Box key={order.id} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: 'primary.50' } }} onClick={() => navigate('/customer/track')}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" fontFamily="monospace" color="text.secondary">{order.id.slice(0,8)}</Typography>
                        <StatusBadge status={order.status} />
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">{order.suppliers?.name || 'Supplier'}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Droplets size={12} />{order.quantity.toLocaleString()}L
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold">{formatCurrency(order.amount)}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recommended Suppliers */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">Recommended Suppliers</Typography>
              <Typography variant="body2" color="text.secondary">Based on your location and water quality preferences</Typography>
            </Box>
            <Button variant="outlined" size="small" onClick={() => navigate('/customer/marketplace')}>
              Browse All
            </Button>
          </Box>
          <Grid container spacing={2}>
            {topSuppliers.map(sup => (
              <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}}      key={sup.id}>
                <Paper variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { borderColor: 'primary.main', boxShadow: 1 } }} onClick={() => navigate(`/customer/supplier/${sup.id}`)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar name={sup.name} size="sm" />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>{sup.name}</Typography>
                      <TrustBadgeComp badge={sup.badge} className="text-xs" />
                    </Box>
                  </Box>
                  <RatingDisplay rating={sup.rating} count={42} size="sm" />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Droplets size={12} />TDS: {sup.tds || 50}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                      {formatCurrency(sup.price)}<Typography component="span" variant="caption" color="text.secondary">/KL</Typography>
                    </Typography>
                  </Box>
                  <Button variant="contained" fullWidth size="small" sx={{ mt: 2 }}>
                    Book Now
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Recent Orders</Typography>
            <Button variant="text" size="small" endIcon={<ChevronRight size={16} />} onClick={() => navigate('/customer/orders')}>
              View all
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(0,6).map(order => (
                  <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate('/customer/orders')}>
                    <TableCell><Typography variant="caption" fontFamily="monospace" color="text.secondary">{order.id.slice(0,8)}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight="medium">{order.suppliers?.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{order.quantity.toLocaleString()}L</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight="bold">{formatCurrency(order.amount)}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{formatDate(order.created_at)}</Typography></TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
