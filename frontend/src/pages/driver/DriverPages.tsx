// Driver Portal — All Pages
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { MockMap } from '@/components/maps/MockMap';
import { StarRating, RatingDisplay } from '@/components/common/StarRating';
import { DRIVERS } from '@/data/drivers';
import { ORDERS, getOrdersByDriver } from '@/data/orders';
import { MOCK_ROUTE_POINTS } from '@/data/mockData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
  Package, Truck, CheckCircle2, Star, Navigation, MapPin,
  Clock, Phone, PlayCircle, CheckSquare, TrendingUp, Award,
} from 'lucide-react';

const MY_DRIVER = DRIVERS[0];
const myDeliveries = getOrdersByDriver(MY_DRIVER.id);
const activeDelivery = myDeliveries.find(o => o.status === 'en_route') ?? myDeliveries.find(o => o.status === 'dispatched');
const todayDone = myDeliveries.filter(o => o.status === 'delivered').length;

// ─── DRIVER DASHBOARD ────────────────────────────────────────
export function DriverDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={MY_DRIVER.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-dark">{MY_DRIVER.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingDisplay rating={MY_DRIVER.rating} size="sm" />
              <span className="text-muted text-sm">• {MY_DRIVER.supplierName}</span>
            </div>
          </div>
        </div>
        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
          MY_DRIVER.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')}>
          <div className={cn('w-2 h-2 rounded-full', MY_DRIVER.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
          {MY_DRIVER.isAvailable ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Today's Deliveries" value={3}   icon={Truck}        iconBg="bg-blue-50"    iconColor="text-blue-600"   />
        <KPICard title="Completed"          value={todayDone} icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <KPICard title="Today's Earnings"   value={formatCurrency(1850)} icon={Package} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <KPICard title="Rating"             value={MY_DRIVER.rating}     icon={Star}   iconBg="bg-yellow-50" iconColor="text-yellow-600" />
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
            <div><span className="text-muted">Address</span><div className="font-semibold mt-0.5">{activeDelivery.deliveryAddress.street}</div></div>
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
        <div className="p-4 border-b border-border"><h3 className="font-semibold text-dark">Today's Assignments</h3></div>
        <MockMap
          points={[
            { id: 'me', lat: 19.070, lng: 72.870, type: 'driver', label: 'Me', isAnimated: true },
            { id: 'd1', lat: 19.082, lng: 72.882, type: 'customer', label: 'Stop 1' },
            { id: 'd2', lat: 19.090, lng: 72.890, type: 'customer', label: 'Stop 2' },
            { id: 'd3', lat: 19.095, lng: 72.895, type: 'customer', label: 'Stop 3' },
          ]}
          routePoints={MOCK_ROUTE_POINTS}
          height="240px"
        />
      </div>

      {/* Deliveries list */}
      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Assigned Deliveries</h3>
        <div className="space-y-3">
          {myDeliveries.slice(0, 5).map((o, i) => (
            <div key={o.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                o.status === 'delivered' ? 'bg-success text-white' : 'bg-primary-100 text-primary-700'
              )}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-dark truncate">{o.customerName}</div>
                <div className="text-xs text-muted truncate">{o.deliveryAddress.street}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <StatusBadge status={o.status} />
                <div className="text-xs text-muted mt-0.5">{o.scheduledTime}</div>
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
  const [deliveryStatus, setDeliveryStatus] = useState<Record<string, string>>({});

  const updateStatus = (id: string, status: string) => {
    setDeliveryStatus(s => ({ ...s, [id]: status }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Delivery Management</h1>
      <div className="space-y-4">
        {myDeliveries.slice(0, 8).map((o, i) => {
          const status = deliveryStatus[o.id] ?? o.status;
          return (
            <div key={o.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-dark">Stop {i+1}: {o.customerName}</span>
                    <StatusBadge status={status as any} />
                  </div>
                  <div className="text-sm text-muted mt-1">
                    <MapPin className="w-3 h-3 inline mr-1" />{o.deliveryAddress.street}, {o.deliveryAddress.city}
                  </div>
                  <div className="text-sm text-muted">
                    <Clock className="w-3 h-3 inline mr-1" />Scheduled: {o.scheduledDate} {o.scheduledTime}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-dark">{o.quantity.toLocaleString()}L</div>
                  <div className="text-xs text-muted font-mono">{o.id}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {status === 'pending' || status === 'confirmed' ? (
                  <button onClick={() => updateStatus(o.id, 'en_route')} className="btn-primary btn-sm flex-1">
                    <PlayCircle className="w-3.5 h-3.5" /> Start Delivery
                  </button>
                ) : status === 'en_route' || status === 'dispatched' ? (
                  <button onClick={() => updateStatus(o.id, 'delivered')} className="btn-success btn-sm flex-1">
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
  const stops = myDeliveries.slice(0, 4);
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Today's Route</h1>

      <div className="card p-0 overflow-hidden">
        <MockMap
          points={[
            { id: 'depot', lat: 19.065, lng: 72.865, type: 'depot', label: 'Depot' },
            ...stops.map((o, i) => ({
              id: `stop${i}`,
              lat: 19.070 + i * 0.008,
              lng: 72.870 + i * 0.008,
              type: 'customer' as const,
              label: `Stop ${i+1}`,
            })),
          ]}
          routePoints={MOCK_ROUTE_POINTS}
          height="300px"
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
                <div className="font-semibold text-sm text-dark">{o.customerName}</div>
                <div className="text-xs text-muted">{o.deliveryAddress.street}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-primary-600">~{10 + i * 8} min</div>
                <div className="text-xs text-muted">{o.quantity.toLocaleString()}L</div>
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
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Performance Metrics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Deliveries" value={MY_DRIVER.totalDeliveries}       icon={Package}    iconBg="bg-blue-50"    iconColor="text-blue-600"   change={8} />
        <KPICard title="Distance Covered" value={`${MY_DRIVER.distanceCovered}km`} icon={Navigation} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <KPICard title="Rating"           value={MY_DRIVER.rating}                icon={Star}       iconBg="bg-yellow-50"  iconColor="text-yellow-600" />
        <KPICard title="Success Rate"     value={`${Math.round(MY_DRIVER.completedDeliveries/MY_DRIVER.totalDeliveries*100)}%`} icon={TrendingUp} iconBg="bg-purple-50" iconColor="text-purple-600" />
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
