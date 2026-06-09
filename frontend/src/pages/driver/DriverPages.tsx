// Driver Portal — All Pages
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { LiveMap } from '@/components/maps/LiveMap';
import { SuppliersMap } from '@/components/maps/SuppliersMap';
import { RatingDisplay } from '@/components/common/StarRating';
import { MOCK_ROUTE_POINTS } from '@/data/mockData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
  Package, Truck, CheckCircle2, Star, Navigation, MapPin,
  Clock, Phone, PlayCircle, CheckSquare, TrendingUp, Award, X
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { Water3DEffect } from '@/components/effects/Water3DEffect';

// Shared hook for driver data
function useDriverData() {
  const { user } = useAuthStore();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        // We use any for the query to avoid type error since driverId is not natively typed
        const apiOrders = await api.orders.getAll({ supplierId: user.id } as any).catch(() => []) || [];
        const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        const myLocalOrders = localOrders.filter((o: any) => o.driver_id === user.id);
        
        const apiOrderIds = new Set(apiOrders.map((o: any) => o.id));
        const uniqueLocal = myLocalOrders.filter((o: any) => !apiOrderIds.has(o.id));
        
        setDeliveries([...apiOrders, ...uniqueLocal]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const updateDeliveryStatus = async (id: string, newStatus: string) => {
    try {
      // If it's rejecting, we reset driver_id to null and status back to confirmed
      const apiStatus = newStatus === 'pending' || newStatus === 'rejected' ? 'confirmed' : newStatus;
      const apiDriverId = newStatus === 'pending' || newStatus === 'rejected' ? null : undefined;
      
      try {
        await api.orders.update(id, { status: apiStatus, ...(apiDriverId === null ? { driver_id: null } : {}) });
      } catch (e) {
        // Might be a local mock order, continue
      }
      
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const updatedLocal = localOrders.map((o: any) => {
        if (o.id === id) {
          if (newStatus === 'pending' || newStatus === 'rejected') {
            return { ...o, status: 'confirmed', driver_id: null };
          }
          return { ...o, status: newStatus };
        }
        return o;
      });
      localStorage.setItem('local_orders', JSON.stringify(updatedLocal));
      
      setDeliveries(prev => prev.map(o => {
        if (o.id === id) {
          if (newStatus === 'pending' || newStatus === 'rejected') {
            return { ...o, status: 'confirmed', driver_id: null };
          }
          return { ...o, status: newStatus };
        }
        return o;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return { driver: user, deliveries: deliveries.filter(d => d.driver_id === user?.id), loading, updateDeliveryStatus };
}

// ─── DRIVER DASHBOARD ────────────────────────────────────────
export function DriverDashboard() {
  const { driver, deliveries, loading } = useDriverData();
  
  if (loading || !driver) return <div className="p-8 text-center text-muted">Loading dashboard...</div>;

  const activeDelivery = deliveries.find(o => o.status === 'en_route') ?? deliveries.find(o => o.status === 'dispatched');
  const todayDone = deliveries.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 3D Water Effect Header */}
      <Water3DEffect 
        title={`Welcome, ${driver.name || 'Driver'}! 🚚`}
        subtitle="Your daily delivery route, active shipments, and earnings overview."
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <Avatar name={driver.name || 'Driver'} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-dark">{driver.name || 'Driver'}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingDisplay rating={0} size="sm" />
              <span className="text-muted text-sm">• Driver</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Today's Deliveries" value={deliveries.length} icon={Truck} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <KPICard title="Completed"          value={todayDone} icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <KPICard title="Today's Earnings"   value={formatCurrency(0)} icon={Package} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <KPICard title="Rating"             value={0} icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <div className="card border-l-4 border-primary-500 bg-primary-50/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-dark flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary-500" />Active Delivery
            </h3>
            <StatusBadge status={activeDelivery.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted">Customer</span><div className="font-semibold mt-0.5">{activeDelivery.customerName}</div></div>
            <div><span className="text-muted">Quantity</span><div className="font-semibold mt-0.5">{activeDelivery.quantity.toLocaleString()}L</div></div>
            <div><span className="text-muted">Address</span><div className="font-semibold mt-0.5">{activeDelivery.deliveryAddress?.street || 'Local Address'}</div></div>
            <div><span className="text-muted">Time Slot</span><div className="font-semibold mt-0.5">{activeDelivery.scheduledTime}</div></div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary flex-1"><PlayCircle className="w-4 h-4" /> Start Delivery</button>
            <button className="btn-secondary"><Phone className="w-4 h-4" /></button>
            <button className="btn-secondary"><Navigation className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Assignment map */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-dark">Today's Route Map</h3>
          <p className="text-xs text-muted mt-0.5">Live delivery stops near you</p>
        </div>
        <SuppliersMap
          points={[
            { id: 'me',  lat: 19.070, lng: 72.870, label: 'My Location', type: 'driver' },
            { id: 'd1',  lat: 19.082, lng: 72.882, label: 'Stop 1', type: 'customer' },
            { id: 'd2',  lat: 19.090, lng: 72.890, label: 'Stop 2', type: 'customer' },
            { id: 'd3',  lat: 19.095, lng: 72.895, label: 'Stop 3', type: 'customer' },
          ]}
          height="280px"
        />
      </div>

      {/* Deliveries list */}
      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Assigned Deliveries</h3>
        <div className="space-y-3">
          {deliveries.length === 0 ? (
            <div className="text-muted text-center py-6">No deliveries assigned yet.</div>
          ) : deliveries.slice(0, 5).map((o, i) => (
            <div key={o.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                o.status === 'delivered' ? 'bg-success text-white' : 'bg-primary-100 text-primary-700'
              )}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-dark truncate">{o.customers?.full_name || o.customerName || 'Customer'}</div>
                <div className="text-xs text-muted truncate">{o.deliveryAddress?.street || o.delivery_date}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <StatusBadge status={o.status} />
                <div className="text-xs text-muted mt-0.5">{o.scheduledTime || o.eta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DELIVERY MANAGEMENT ──────────────────────────────────────
export function DeliveryManagementPage() {
  const { deliveries, loading, updateDeliveryStatus } = useDriverData();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleUpdate = async (id: string, status: string) => {
    setProcessing(id);
    await updateDeliveryStatus(id, status);
    setProcessing(null);
  };

  if (loading) return <div className="p-8 text-center text-muted">Loading deliveries...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Delivery Management</h1>
      <div className="space-y-4">
        {deliveries.length === 0 && <div className="card text-center text-muted py-12">No deliveries assigned.</div>}
        {deliveries.slice(0, 8).map((o, i) => {
          const status = o.status;
          const isProcessing = processing === o.id;
          
          return (
            <div key={o.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-dark">Stop {i+1}: {o.customers?.full_name || o.customerName || 'Customer'}</span>
                    <StatusBadge status={status as any} />
                  </div>
                  <div className="text-sm text-muted mt-1">
                    <MapPin className="w-3 h-3 inline mr-1" />{o.deliveryAddress?.street || 'Local Address'}, {o.deliveryAddress?.city || ''}
                  </div>
                  <div className="text-sm text-muted">
                    <Clock className="w-3 h-3 inline mr-1" />Scheduled: {o.scheduledDate || ''} {o.scheduledTime || o.eta}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-dark">{Number(o.quantity).toLocaleString()}L</div>
                  <div className="text-xs text-muted font-mono">{o.id}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {status === 'confirmed' ? (
                  <>
                    <button onClick={() => handleUpdate(o.id, 'dispatched')} disabled={isProcessing} className="btn-success btn-sm flex-1">
                      <CheckSquare className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button onClick={() => handleUpdate(o.id, 'rejected')} disabled={isProcessing} className="btn-danger btn-sm flex-1">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                ) : status === 'dispatched' ? (
                  <button onClick={() => handleUpdate(o.id, 'en_route')} disabled={isProcessing} className="btn-primary btn-sm flex-1">
                    <PlayCircle className="w-3.5 h-3.5" /> Start Delivery
                  </button>
                ) : status === 'en_route' ? (
                  <button onClick={() => handleUpdate(o.id, 'delivered')} disabled={isProcessing} className="btn-success btn-sm flex-1">
                    <CheckSquare className="w-3.5 h-3.5" /> Mark Delivered
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-success text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Delivered
                  </div>
                )}
                <button className="btn-secondary btn-sm"><Phone className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ROUTE PAGE ───────────────────────────────────────────────
export function RoutePage() {
  const { deliveries, loading } = useDriverData();
  
  if (loading) return <div className="p-8 text-center text-muted">Loading route...</div>;
  
  const stops = deliveries.slice(0, 4);
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Today's Route</h1>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-dark">Live Route Map</h3>
          <p className="text-xs text-muted mt-0.5">Optimized delivery path</p>
        </div>
        <LiveMap
          routePoints={MOCK_ROUTE_POINTS}
          startPoint={{ lat: 19.065, lng: 72.865 }}
          endPoint={{ lat: 19.095, lng: 72.895 }}
          height="320px"
        />
      </div>

      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Delivery Stops (Optimized)</h3>
        <div className="space-y-3">
          {stops.map((o, i) => (
            <div key={o.id} className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary-bg rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0 border-l-2 border-dashed border-primary-200 pl-3">
                <div className="font-semibold text-sm text-dark">{o.customers?.full_name || o.customerName || 'Customer'}</div>
                <div className="text-xs text-muted">{o.deliveryAddress?.street || o.delivery_date}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-primary-600">~{10 + i * 8} min</div>
                <div className="text-xs text-muted">{Number(o.quantity).toLocaleString()}L</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PERFORMANCE PAGE ─────────────────────────────────────────
const WEEKLY_DATA = [
  { day: 'Mon', deliveries: 8, distance: 64 },
  { day: 'Tue', deliveries: 11, distance: 88 },
  { day: 'Wed', deliveries: 7, distance: 56 },
  { day: 'Thu', deliveries: 13, distance: 104 },
  { day: 'Fri', deliveries: 9, distance: 72 },
  { day: 'Sat', deliveries: 14, distance: 112 },
  { day: 'Sun', deliveries: 6, distance: 48 },
];

export function DriverPerformancePage() {
  const { deliveries } = useDriverData();
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Performance Metrics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Deliveries" value={deliveries.length}       icon={Package}    iconBg="bg-blue-50"    iconColor="text-blue-600"   change={0} />
        <KPICard title="Distance Covered" value={`0km`} icon={Navigation} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <KPICard title="Rating"           value={0}                icon={Star}       iconBg="bg-yellow-50"  iconColor="text-yellow-600" />
        <KPICard title="Success Rate"     value={`100%`} icon={TrendingUp} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Weekly Deliveries</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#0EA5E9" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Achievements</h3>
          <div className="space-y-3">
            {[
              { icon: '⚡', label: '100+ Deliveries',   desc: 'Completed 100 deliveries',       earned: true  },
              { icon: '⭐', label: 'Top Rated Driver',   desc: 'Maintained 4.5+ rating',         earned: true  },
              { icon: '🚀', label: 'Speed Champion',     desc: 'Avg delivery under 2 hrs',       earned: false },
              { icon: '🏆', label: 'Perfect Week',       desc: '0 complaints in 7 days',         earned: true  },
            ].map(a => (
              <div key={a.label} className={cn('flex items-center gap-3 p-3 rounded-xl', a.earned ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50')}>
                <div className="text-2xl">{a.icon}</div>
                <div>
                  <div className={cn('font-semibold text-sm', a.earned ? 'text-amber-800' : 'text-slate-400')}>{a.label}</div>
                  <div className="text-xs text-muted">{a.desc}</div>
                </div>
                {a.earned && <Award className="w-4 h-4 text-amber-500 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
