// Admin Portal — All Pages
import { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge, TrustBadgeComp, RiskBadge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { RatingDisplay } from '@/components/common/StarRating';
import { DemandHeatmap, MockMap } from '@/components/maps/MockMap';
import { SUPPLIERS } from '@/data/suppliers';
import { CUSTOMERS } from '@/data/customers';
import { DRIVERS } from '@/data/drivers';
import { ORDERS } from '@/data/orders';
import { COMPLAINTS, REVENUE_DATA, HEATMAP_ZONES, FORECAST_DATA, QUALITY_REPORTS } from '@/data/mockData';
import { matchSuppliers, suggestPrice } from '@/lib/aquaMatch';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
  Users, Store, Truck, Package, DollarSign, TrendingUp,
  Search, Check, X, Eye, AlertCircle, ShieldCheck, BarChart3,
  Zap, CheckCircle2, XCircle, Clock, Activity, Globe,
} from 'lucide-react';

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
const totalRevenue = ORDERS.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.amount, 0);
const activeOrders = ORDERS.filter(o => ['confirmed','dispatched','en_route'].includes(o.status)).length;

export function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark">Platform Overview</h1>
        <p className="text-muted mt-1">AquanovaX Admin Dashboard • Real-time platform metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users"     value={CUSTOMERS.length}  icon={Users}       iconBg="bg-blue-50"    iconColor="text-blue-600"    change={14} changeLabel="this month" />
        <KPICard title="Active Suppliers" value={SUPPLIERS.filter(s => s.isActive).length} icon={Store} iconBg="bg-emerald-50" iconColor="text-emerald-600" change={6} />
        <KPICard title="Active Drivers"  value={DRIVERS.filter(d => d.isAvailable).length} icon={Truck} iconBg="bg-amber-50"  iconColor="text-amber-600"   change={9} />
        <KPICard title="Today's Orders"  value={activeOrders}      icon={Package}     iconBg="bg-violet-50"  iconColor="text-violet-600"  change={22} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Platform Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign}  iconBg="bg-primary-50"  iconColor="text-primary-600"  change={18} />
        <KPICard title="Total Orders"     value={ORDERS.length}                icon={BarChart3}   iconBg="bg-pink-50"    iconColor="text-pink-600"    change={12} />
        <KPICard title="Open Complaints"  value={COMPLAINTS.filter(c => c.status === 'open').length} icon={AlertCircle} iconBg="bg-red-50" iconColor="text-red-600" />
        <KPICard title="Verified Suppliers" value={SUPPLIERS.filter(s => s.verification.overallStatus === 'verified').length} icon={ShieldCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-dark mb-4">Revenue & Growth Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adminCust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="rev" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <YAxis yAxisId="cust" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#0EA5E9" fill="url(#adminRev)" strokeWidth={2} name="Revenue" />
              <Area yAxisId="cust" type="monotone" dataKey="customers" stroke="#10B981" fill="url(#adminCust)" strokeWidth={2} name="Customers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Order Success Rate', value: '94.2%', color: 'text-emerald-600' },
              { label: 'Avg Delivery Time',  value: '2.8 hrs', color: 'text-primary-600' },
              { label: 'Fleet Utilization',  value: '78%',   color: 'text-amber-600'   },
              { label: 'Customer Sat.',      value: '4.6/5', color: 'text-violet-600'  },
              { label: 'Revenue MoM',        value: '+12%',  color: 'text-emerald-600' },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted">{s.label}</span>
                <span className={cn('text-sm font-bold', s.color)}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic demand */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-dark">Geographic Demand Distribution</h3>
          <p className="text-xs text-muted mt-0.5">Order density by zone</p>
        </div>
        <DemandHeatmap zones={HEATMAP_ZONES} height="300px" />
      </div>

      {/* Recent registrations */}
      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Recent Registrations</h3>
        <div className="space-y-3">
          {[...CUSTOMERS.slice(0,3).map(c => ({ ...c, type: 'customer' })),
            ...SUPPLIERS.slice(0,2).map(s => ({ ...s, name: s.businessName, type: 'supplier' }))
          ].map((u, i) => (
            <div key={i} className="flex items-center gap-3">
              <Avatar name={u.name} size="sm" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-dark">{u.name}</div>
                <div className="text-xs text-muted capitalize">{u.type}</div>
              </div>
              <span className="badge-muted text-xs">{formatDate((u as any).memberSince ?? (u as any).joinedAt ?? '2026-01-01')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USER MANAGEMENT ─────────────────────────────────────────
export function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [suspended, setSuspended] = useState<string[]>([]);

  const filtered = CUSTOMERS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">User Management</h1>
        <span className="badge-muted">{CUSTOMERS.length} total users</span>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="input pl-9 max-w-sm" />
      </div>
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead><tr><th>User</th><th>Contact</th><th>Orders</th><th>Wallet</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.slice(0, 20).map(c => {
                const isSuspended = suspended.includes(c.id) || !c.isActive;
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={c.name} size="xs" />
                        <div>
                          <div className="font-medium text-sm">{c.name}</div>
                          <div className="text-xs text-muted">{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">{c.email}</div>
                      <div className="text-xs text-muted">{c.phone}</div>
                    </td>
                    <td className="font-semibold">{c.totalOrders}</td>
                    <td>{formatCurrency(c.walletBalance)}</td>
                    <td>
                      {isSuspended
                        ? <span className="badge-danger">Suspended</span>
                        : <span className="badge-success">Active</span>
                      }
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn-ghost btn-sm"><Eye className="w-3.5 h-3.5" /></button>
                        <button
                          onClick={() => setSuspended(s => s.includes(c.id) ? s.filter(x => x !== c.id) : [...s, c.id])}
                          className={cn('btn-sm', isSuspended ? 'btn-success' : 'btn-danger')}>
                          {isSuspended ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPLIER MANAGEMENT ──────────────────────────────────────
export function SupplierManagementPage() {
  const [search, setSearch] = useState('');
  const [approved, setApproved] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const pending = SUPPLIERS.filter(s => s.verification.overallStatus === 'pending');
  const all = SUPPLIERS.filter(s =>
    !search || s.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Supplier Management</h1>

      {pending.length > 0 && (
        <div className="card border-l-4 border-amber-400">
          <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />{pending.length} Suppliers Pending Verification
          </h3>
          <div className="space-y-3">
            {pending.slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Avatar name={s.businessName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{s.businessName}</div>
                  <div className="text-xs text-muted">{s.address.city} • Trust: {s.trustScore}/100</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setApproved(a => [...a, s.id])}
                    className={cn('btn-sm', approved.includes(s.id) ? 'btn-secondary' : 'btn-success')}>
                    {approved.includes(s.id) ? '✓ Approved' : <><Check className="w-3 h-3" /> Approve</>}
                  </button>
                  <button onClick={() => setRejected(r => [...r, s.id])}
                    className={cn('btn-sm', rejected.includes(s.id) ? 'btn-secondary' : 'btn-danger')}>
                    {rejected.includes(s.id) ? '✗ Rejected' : <><X className="w-3 h-3" /> Reject</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers…" className="input pl-9 max-w-sm" />
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Supplier</th><th>City</th><th>Trust</th><th>Rating</th><th>Orders</th><th>Status</th><th>Verified</th></tr></thead>
            <tbody>
              {all.slice(0, 20).map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={s.businessName} size="xs" />
                      <div>
                        <div className="font-medium text-sm">{s.businessName}</div>
                        <TrustBadgeComp badge={s.trustBadge} className="text-xs" />
                      </div>
                    </div>
                  </td>
                  <td className="text-muted text-sm">{s.address.city}</td>
                  <td><span className="font-bold text-primary-600">{s.trustScore}</span></td>
                  <td><RatingDisplay rating={s.rating} size="sm" /></td>
                  <td>{s.totalOrders}</td>
                  <td>{s.isActive ? <span className="badge-success">Active</span> : <span className="badge-muted">Inactive</span>}</td>
                  <td>
                    <span className={cn('badge', s.verification.overallStatus === 'verified' ? 'badge-success' : s.verification.overallStatus === 'rejected' ? 'badge-danger' : 'badge-warning')}>
                      {s.verification.overallStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── DRIVER MANAGEMENT ────────────────────────────────────────
export function DriverManagementPage() {
  const [search, setSearch] = useState('');
  const filtered = DRIVERS.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Driver Management</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Drivers', value: DRIVERS.length,                         color: 'text-dark'         },
          { label: 'Available',     value: DRIVERS.filter(d => d.isAvailable).length, color: 'text-emerald-600'  },
          { label: 'Active',        value: DRIVERS.filter(d => d.isActive).length,  color: 'text-primary-600' },
          { label: 'Avg Rating',    value: (DRIVERS.reduce((s,d)=>s+d.rating,0)/DRIVERS.length).toFixed(1), color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={cn('text-3xl font-bold', s.color)}>{s.value}</div>
            <div className="text-sm text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers…" className="input pl-9 max-w-sm" />
      </div>
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Driver</th><th>Supplier</th><th>Rating</th><th>Deliveries</th><th>Distance</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.slice(0, 20).map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={d.name} size="xs" />
                      <div>
                        <div className="font-medium text-sm">{d.name}</div>
                        <div className="text-xs text-muted font-mono">{d.licenseNumber.slice(0,10)}…</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-muted">{d.supplierName}</td>
                  <td><RatingDisplay rating={d.rating} size="sm" /></td>
                  <td><span className="font-semibold">{d.completedDeliveries}</span>/{d.totalDeliveries}</td>
                  <td>{d.distanceCovered.toLocaleString()} km</td>
                  <td>
                    {d.isAvailable
                      ? <span className="badge-success">Available</span>
                      : <span className="badge-muted">On Delivery</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER MONITORING ─────────────────────────────────────────
export function OrderMonitoringPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = statusFilter === 'all' ? ORDERS : ORDERS.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Order Monitoring</h1>
      <div className="flex gap-2 flex-wrap">
        {['all','pending','confirmed','dispatched','en_route','delivered','cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn('btn-sm capitalize', statusFilter === s ? 'btn-primary' : 'btn-secondary')}>
            {s === 'all' ? `All (${ORDERS.length})` : `${s.replace('_',' ')} (${ORDERS.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Supplier</th><th>Qty</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.slice(0, 30).map(o => (
                <tr key={o.id}>
                  <td><span className="font-mono text-xs">{o.id}</span></td>
                  <td>{o.customerName}</td>
                  <td>{o.supplierName}</td>
                  <td>{o.quantity.toLocaleString()}L</td>
                  <td className="font-semibold">{formatCurrency(o.amount)}</td>
                  <td><span className={cn('badge', o.type === 'emergency' ? 'badge-danger' : o.type === 'scheduled' ? 'badge-primary' : 'badge-muted')}>{o.type}</span></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-muted text-xs">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── COMPLAINT MANAGEMENT ─────────────────────────────────────
export function ComplaintManagementPage() {
  const [resolved, setResolved] = useState<string[]>([]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Complaint Management</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open',         value: COMPLAINTS.filter(c => c.status === 'open').length,         color: 'text-red-600'     },
          { label: 'Under Review', value: COMPLAINTS.filter(c => c.status === 'under_review').length, color: 'text-amber-600'   },
          { label: 'Resolved',     value: COMPLAINTS.filter(c => c.status === 'resolved').length,     color: 'text-emerald-600' },
          { label: 'Escalated',    value: COMPLAINTS.filter(c => c.status === 'escalated').length,    color: 'text-purple-600'  },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={cn('text-3xl font-bold', s.color)}>{s.value}</div>
            <div className="text-sm text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {COMPLAINTS.map(c => (
          <div key={c.id} className="card-hover">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-dark">{c.title}</span>
                  <RiskBadge level={c.riskLevel} />
                  <span className={cn('badge', c.status === 'open' ? 'badge-danger' : c.status === 'under_review' ? 'badge-warning' : c.status === 'resolved' ? 'badge-success' : 'badge-primary')}>
                    {c.status.replace('_',' ')}
                  </span>
                </div>
                <div className="text-xs text-muted mt-1">{c.category} • {c.customerName} • {formatDate(c.createdAt)}</div>
                <p className="text-sm text-slate-600 mt-2">{c.description}</p>
              </div>
            </div>
            {c.status !== 'resolved' && !resolved.includes(c.id) && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => setResolved(r => [...r, c.id])} className="btn-success btn-sm">
                  <Check className="w-3 h-3" /> Resolve
                </button>
                <button className="btn-secondary btn-sm">Escalate</button>
                <button className="btn-ghost btn-sm">Assign</button>
              </div>
            )}
            {resolved.includes(c.id) && (
              <div className="flex items-center gap-2 text-success text-sm font-semibold mt-2">
                <CheckCircle2 className="w-4 h-4" /> Marked as resolved
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SYSTEM ANALYTICS ────────────────────────────────────────
export function SystemAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">System Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Revenue Analytics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#0EA5E9" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-dark mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Customers" />
              <Line type="monotone" dataKey="orders" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-dark">Geographic Analytics</h3>
          </div>
          <DemandHeatmap zones={HEATMAP_ZONES} height="260px" />
        </div>

        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Quality Leaderboard</h3>
          <div className="space-y-3">
            {SUPPLIERS.sort((a,b) => b.waterQuality.qualityScore - a.waterQuality.qualityScore).slice(0,8).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-slate-100 text-slate-600' :
                  i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-muted'
                )}>
                  {i+1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-dark truncate">{s.businessName}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-32">
                      <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${s.waterQuality.qualityScore}%` }} />
                    </div>
                    <span className="text-xs text-muted">{s.waterQuality.qualityScore}%</span>
                  </div>
                </div>
                <TrustBadgeComp badge={s.trustBadge} className="flex-shrink-0 text-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AQUAMATCH AI DASHBOARD ────────────────────────────────────
export function AquaMatchDashboard() {
  const matches = matchSuppliers(SUPPLIERS, { lat: 19.076, lng: 72.877 });
  const avgPrice = SUPPLIERS.reduce((s, sup) => s + sup.pricePerKL, 0) / SUPPLIERS.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary-500" />AquaMatch AI Intelligence
        </h1>
        <p className="text-muted mt-1">AI-powered supplier matching, demand forecasting & smart pricing</p>
      </div>

      {/* AI Supplier Matches */}
      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Top AI-Matched Suppliers</h3>
        <p className="text-xs text-muted mb-4">Scored by: Distance (25%) • Quality (35%) • Price (25%) • Rating (15%)</p>
        <div className="space-y-3">
          {matches.slice(0, 8).map((m, i) => (
            <div key={m.supplier.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-primary-50/50 transition-colors">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0',
                i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-white text-muted'
              )}>#{i+1}</div>
              <Avatar name={m.supplier.businessName} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-dark truncate">{m.supplier.businessName}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted flex-wrap">
                  <span>📍 {m.distanceKm}km</span>
                  <span>💧 {m.supplier.waterQuality.qualityScore}% quality</span>
                  <span>💰 {formatCurrency(m.supplier.pricePerKL)}/KL</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className={cn('text-lg font-bold', m.matchPercent >= 80 ? 'text-emerald-600' : m.matchPercent >= 60 ? 'text-amber-600' : 'text-muted')}>
                  {m.matchPercent}%
                </div>
                <div className="text-xs text-muted">Match</div>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <div className="text-xs font-semibold text-primary-600">
                  Suggested: {formatCurrency(suggestPrice(m.supplier.pricePerKL, 0.7, avgPrice))}/KL
                </div>
                <div className="text-xs text-muted">Smart Pricing</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Forecasting */}
      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Demand & Supply Forecast (16 Weeks)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={FORECAST_DATA}>
            <defs>
              <linearGradient id="demand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="supply" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="demand" stroke="#0EA5E9" fill="url(#demand)" strokeWidth={2} name="Demand" />
            <Area type="monotone" dataKey="supply" stroke="#10B981" fill="url(#supply)" strokeWidth={2} name="Supply" />
            <Line type="monotone" dataKey="predicted" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="AI Forecast" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-dark">Demand Heatmap</h3>
          <p className="text-xs text-muted mt-0.5">Geographic demand intensity by zone</p>
        </div>
        <DemandHeatmap zones={HEATMAP_ZONES} height="320px" />
      </div>

      {/* Quality Leaderboard */}
      <div className="card">
        <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-500" />AquaPure Quality Leaderboard
        </h3>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Rank</th><th>Supplier</th><th>TDS</th><th>pH</th><th>Quality Score</th><th>Risk</th><th>Badge</th></tr></thead>
            <tbody>
              {QUALITY_REPORTS.sort((a,b) => b.qualityScore - a.qualityScore).slice(0,12).map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <span className={cn('font-bold', i === 0 ? 'text-yellow-600' : i === 1 ? 'text-slate-500' : i === 2 ? 'text-orange-600' : 'text-muted')}>
                      #{i+1}
                    </span>
                  </td>
                  <td className="font-medium">{r.supplierName}</td>
                  <td>{r.tds} ppm</td>
                  <td>{r.ph}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 w-20">
                        <div className={cn('h-2 rounded-full', r.qualityScore >= 80 ? 'bg-emerald-500' : r.qualityScore >= 60 ? 'bg-amber-500' : 'bg-red-500')}
                          style={{ width: `${r.qualityScore}%` }} />
                      </div>
                      <span className="font-semibold text-sm">{r.qualityScore}%</span>
                    </div>
                  </td>
                  <td><span className={cn('badge', r.riskLevel === 'low' ? 'badge-success' : r.riskLevel === 'medium' ? 'badge-warning' : 'badge-danger')}>{r.riskLevel}</span></td>
                  <td>
                    {(() => {
                      const sup = SUPPLIERS.find(s => s.id === r.supplierId);
                      return sup ? <TrustBadgeComp badge={sup.trustBadge} /> : null;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
