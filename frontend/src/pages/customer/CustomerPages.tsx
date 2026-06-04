import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Tabs, Tab, Card, CardContent, Grid, Paper, Divider, 
  Stepper, Step, StepLabel, StepContent, TextField, Rating, Avatar as MuiAvatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Chip
} from '@mui/material';
import { 
  Package, Droplets, MapPin, Clock, Navigation, CheckCircle2, Phone, Truck, 
  CreditCard, ArrowUpRight, ArrowDownLeft, Wallet, Plus, Star 
} from 'lucide-react';
import { ORDERS } from '@/data/orders';
import { getMockTrackingEvents, MOCK_ROUTE_POINTS } from '@/data/mockData';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, formatDate, formatDateTime, timeAgo, cn } from '@/lib/utils';
import { StatusBadge, TrustBadgeComp } from '@/components/common/Badge';
import { RatingDisplay } from '@/components/common/StarRating';
import { Avatar } from '@/components/common/Avatar';
import { MockMap } from '@/components/maps/MockMap';

// ─── ORDERS PAGE ──────────────────────────────────────────────
export function OrdersPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      api.orders.getAll({ customerId: user.id }).then(data => setOrders(data || []));
    }
  }, [user]);

  const tabs = ['active', 'completed', 'cancelled'] as const;
  const tab = tabs[tabIndex];

  const filtered = orders.filter(o => {
    if (tab === 'active')    return ['pending','accepted','dispatched','in_transit'].includes(o.status);
    if (tab === 'completed') return o.status === 'delivered';
    return o.status === 'cancelled';
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">My Orders</Typography>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => navigate('/customer/book')}>
          New Order
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
        <Tabs value={tabIndex} onChange={(_, nv) => setTabIndex(nv)} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
          {tabs.map((t, idx) => {
            const count = orders.filter(o => {
              if (t === 'active') return ['pending','accepted','dispatched','in_transit'].includes(o.status);
              if (t === 'completed') return o.status === 'delivered';
              return o.status === 'cancelled';
            }).length;
            return <Tab key={t} label={`${t} (${count})`} sx={{ textTransform: 'capitalize', fontWeight: 'bold' }} />;
          })}
        </Tabs>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <Package size={48} className="text-muted mx-auto mb-2 opacity-40" />
            <Typography variant="h6" fontWeight="bold" color="text.primary">No {tab} orders</Typography>
          </Card>
        ) : filtered.map(order => (
          <Card key={order.id} sx={{ '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' }, transition: 'all 0.2s', cursor: 'pointer' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{xs: 12, sm: 8}}    sx={{ display: 'flex', gap: 2 }}>
                  <MuiAvatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, borderRadius: 2 }}>
                    <Droplets size={24} color="white" />
                  </MuiAvatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{order.suppliers?.name}</Typography>
                      <StatusBadge status={order.status} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                      {order.id.slice(0,8)} • {formatDate(order.created_at)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}    sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="h6" fontWeight="bold">{formatCurrency(order.amount)}</Typography>
                  <Typography variant="body2" color="text.secondary">{order.quantity.toLocaleString()}L</Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MapPin size={14} /> {order.suppliers?.coverage_area?.[0] || 'Local'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Clock size={14} /> {formatDate(order.delivery_date)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {['confirmed','dispatched','en_route'].includes(order.status) && (
                  <Button variant="contained" size="small" startIcon={<Navigation size={14} />} onClick={() => navigate('/customer/track')}>
                    Track
                  </Button>
                )}
                {order.status === 'delivered' && !order.rating && (
                  <Button variant="outlined" size="small" startIcon={<Star size={14} />} onClick={() => navigate('/customer/reviews')}>
                    Rate
                  </Button>
                )}
                {order.status === 'delivered' && (
                  <Button variant="outlined" size="small" onClick={() => navigate('/customer/book', { state: { supplierId: order.supplierId } })}>
                    Reorder
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

// ─── TRACKING PAGE ────────────────────────────────────────────
const ORDER_STEPS = [
  { status: 'pending',    label: 'Order Placed',    desc: 'Your order has been received'         },
  { status: 'confirmed',  label: 'Confirmed',       desc: 'Supplier confirmed your order'        },
  { status: 'dispatched', label: 'Dispatched',      desc: 'Tanker dispatched from depot'         },
  { status: 'en_route',   label: 'En Route',        desc: 'Driver heading to your location'      },
  { status: 'delivered',  label: 'Delivered',       desc: 'Water delivered successfully!'        },
];
const ACTIVE_ORDER = ORDERS.find(o => o.status === 'en_route') ?? ORDERS[4];

export function TrackingPage() {
  const [currentStep] = useState(3);
  const events = getMockTrackingEvents(ACTIVE_ORDER.id);

  const mapPoints = [
    { id: 'driver', lat: 19.082, lng: 72.882, type: 'driver' as const, label: 'Driver', isAnimated: true },
    { id: 'home',   lat: 19.090, lng: 72.890, type: 'customer' as const, label: 'You' },
  ];

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Box>
        <Typography variant="h4" fontWeight="bold">Live Tracking</Typography>
        <Typography variant="body1" color="text.secondary">
          Order <Typography component="span" fontFamily="monospace">{ACTIVE_ORDER.id}</Typography>
        </Typography>
      </Box>

      {/* Live Map */}
      <Card sx={{ overflow: 'hidden' }}>
        <MockMap points={mapPoints} routePoints={MOCK_ROUTE_POINTS} height="300px" />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.50', borderTop: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MuiAvatar sx={{ bgcolor: 'primary.100', color: 'primary.main', borderRadius: 2 }}>
              <Truck size={20} className="animate-bounce-gentle" />
            </MuiAvatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">{ACTIVE_ORDER.driverName}</Typography>
              <Typography variant="caption" color="text.secondary">Your driver</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main">~25 min</Typography>
            <Typography variant="caption" color="text.secondary">Estimated arrival</Typography>
          </Box>
          <Button variant="outlined" size="small" startIcon={<Phone size={16} />} href="tel:+919876543210">
            Call Driver
          </Button>
        </Box>
      </Card>

      {/* Status Stepper */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Order Progress</Typography>
          <Stepper activeStep={currentStep} orientation="vertical">
            {ORDER_STEPS.map((step, index) => (
              <Step key={step.status} completed={index < currentStep}>
                <StepLabel 
                  StepIconComponent={(props) => (
                    <MuiAvatar sx={{ 
                      width: 32, height: 32, 
                      bgcolor: props.completed ? 'success.main' : props.active ? 'primary.main' : 'grey.200',
                      color: props.completed || props.active ? 'white' : 'text.secondary'
                    }}>
                      {props.completed ? <CheckCircle2 size={16} /> : <Typography variant="caption" fontWeight="bold">{index + 1}</Typography>}
                    </MuiAvatar>
                  )}
                >
                  <Typography variant="subtitle2" fontWeight={index === currentStep ? 'bold' : 'normal'} color={index === currentStep ? 'primary.main' : 'inherit'}>
                    {step.label}
                    {index === currentStep && <Chip label="Current" color="primary" size="small" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{step.desc}</Typography>
                  {index < currentStep && events[index] && (
                    <Typography sx={{ display: 'block', mt: 0.5 }} variant="caption" color="text.secondary">
                      {formatDateTime(events[index].timestamp)}
                    </Typography>
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Order Info */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>Order Details</Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Supplier',  value: ACTIVE_ORDER.supplierName  },
              { label: 'Quantity',  value: `${ACTIVE_ORDER.quantity.toLocaleString()}L` },
              { label: 'Amount',    value: formatCurrency(ACTIVE_ORDER.amount) },
              { label: 'Tanker',    value: ACTIVE_ORDER.tankerId ?? '-' },
            ].map(row => (
              <Grid size={{xs: 6}}   key={row.label}>
                <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                <Typography variant="subtitle2" fontWeight="bold">{row.value}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

// ─── PAYMENTS PAGE ────────────────────────────────────────────
export function PaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      api.orders.getAll({ customerId: user.id }).then(data => setOrders(data || []));
    }
  }, [user]);

  const paidOrders = orders.filter(o => o.status === 'delivered' || o.status === 'accepted').slice(0, 20);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Typography variant="h4" fontWeight="bold">Payment History</Typography>

      <Grid container spacing={3}>
        {[
          { label: 'Total Spent',    value: formatCurrency(18450), icon: <CreditCard size={24} />, color: 'primary' },
          { label: 'This Month',     value: formatCurrency(3200),  icon: <ArrowUpRight size={24} />, color: 'success' },
          { label: 'Pending Refund', value: formatCurrency(600),   icon: <ArrowDownLeft size={24} />, color: 'warning' },
        ].map((stat, i) => (
          <Grid size={{xs: 12, sm: 4}}    key={i}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MuiAvatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.main`, width: 56, height: 56, borderRadius: 2 }}>
                  {stat.icon}
                </MuiAvatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                  <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>Transactions</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paidOrders.map(o => (
                  <TableRow key={o.id}>
                    <TableCell><Typography variant="caption" fontFamily="monospace">{o.id.slice(0,8)}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{o.suppliers?.name}</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">{formatCurrency(o.amount)}</Typography></TableCell>
                    <TableCell><Chip label="Wallet" size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{formatDate(o.created_at)}</Typography></TableCell>
                    <TableCell><Chip label="Paid" color="success" size="small" /></TableCell>
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

// ─── WALLET PAGE ──────────────────────────────────────────────
export function WalletPage() {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      api.wallet.getByCustomer(user.id).then(data => setTransactions(data || []));
    }
  }, [user]);

  const walletBalance = transactions.reduce((acc, t) => {
    return t.type === 'debit' ? acc - t.amount : acc + t.amount;
  }, 0);

  return (
    <Box sx={{ maxWidth: '700px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Typography variant="h4" fontWeight="bold">My Wallet</Typography>

      <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
        <CardContent sx={{ position: 'relative' }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>Available Balance</Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>{formatCurrency(walletBalance)}</Typography>
          <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }} startIcon={<Plus size={16} />} onClick={() => setShowAddMoney(!showAddMoney)}>
            Add Money
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'warning.50', borderColor: 'warning.200' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MuiAvatar sx={{ bgcolor: 'warning.100', color: 'warning.main', borderRadius: 2 }}>
            <Star size={20} />
          </MuiAvatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Referral Bonus</Typography>
            <Typography variant="caption" color="warning.main">₹150 credits expiring on June 30, 2026</Typography>
          </Box>
        </CardContent>
      </Card>

      {showAddMoney && (
        <Card className="animate-slide-up">
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Add Money to Wallet</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {[500, 1000, 2000, 5000].map(a => (
                <Chip 
                  key={a} 
                  label={`₹${a.toLocaleString()}`} 
                  onClick={() => setAddAmount(String(a))}
                  color={addAmount === String(a) ? "primary" : "default"}
                  variant={addAmount === String(a) ? "filled" : "outlined"}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                size="small" 
                type="number" 
                placeholder="Enter amount" 
                fullWidth 
                value={addAmount} 
                onChange={e => setAddAmount(e.target.value)} 
              />
              <Button variant="contained" sx={{ minWidth: 120 }}>
                Add ₹{(+addAmount || 0).toLocaleString()}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Transaction History</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {transactions.map(txn => (
              <Box key={txn.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, '&:hover': { bgcolor: 'grey.50' }, borderRadius: 1 }}>
                <MuiAvatar sx={{ 
                  bgcolor: (txn.type === 'credit' || txn.type === 'promo') ? 'success.50' : txn.type === 'refund' ? 'info.50' : 'error.50',
                  color: (txn.type === 'credit' || txn.type === 'promo') ? 'success.main' : txn.type === 'refund' ? 'info.main' : 'error.main',
                  borderRadius: 2
                }}>
                  {txn.type === 'debit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </MuiAvatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>{txn.type} Transaction</Typography>
                  <Typography variant="caption" color="text.secondary">{timeAgo(txn.created_at)}</Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="bold" color={txn.type === 'debit' ? 'error.main' : 'success.main'}>
                  {txn.type === 'debit' ? '-' : '+'}{formatCurrency(txn.amount)}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// ─── REVIEWS PAGE ────────────────────────────────────────────
export function ReviewsPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    api.orders.getAll({ customerId: user.id }).then(data => {
      const delivered = (data || []).filter((o: any) => o.status === 'delivered');
      setPendingOrders(delivered.slice(0, 3));
    });
  }, [user]);

  const handleSubmit = (orderId: string) => {
    setSubmitted(s => [...s, orderId]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="animate-fade-in">
      <Typography variant="h4" fontWeight="bold">Ratings & Reviews</Typography>

      {pendingOrders.length > 0 && (
        <Card sx={{ borderLeft: '4px solid', borderColor: 'warning.main' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star size={20} className="text-warning-main" /> Rate Your Recent Deliveries
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pendingOrders.map(order => (
                <Paper key={order.id} variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', opacity: submitted.includes(order.id) ? 0.6 : 1 }}>
                  {submitted.includes(order.id) ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                      <CheckCircle2 size={20} />
                      <Typography variant="subtitle2" fontWeight="bold">Review submitted! Thank you.</Typography>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar name={order.suppliers?.name || 'Supplier'} size="sm" />
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">{order.suppliers?.name || 'Supplier'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.quantity.toLocaleString()}L • {formatDate(order.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Rating 
                          value={ratings[order.id] ?? 0} 
                          onChange={(_, v) => setRatings(r => ({ ...r, [order.id]: v || 0 }))} 
                          size="large" 
                        />
                      </Box>
                      <TextField
                        multiline
                        rows={2}
                        fullWidth
                        placeholder="Share your experience with this supplier..."
                        value={comments[order.id] ?? ''}
                        onChange={e => setComments(c => ({ ...c, [order.id]: e.target.value }))}
                        sx={{ mb: 2 }}
                        size="small"
                      />
                      <Button 
                        variant="contained" 
                        disabled={!ratings[order.id]}
                        onClick={() => handleSubmit(order.id)}
                      >
                        Submit Review
                      </Button>
                    </>
                  )}
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>My Reviews</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {myReviews.map(r => (
              <Box key={r.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar name={'Supplier'} size="sm" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Supplier</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={r.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">{formatDate(r.created_at || new Date().toISOString())}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">{r.review_text || r.comment}</Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
