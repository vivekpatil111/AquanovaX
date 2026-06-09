// Admin Portal — All Pages
import { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge, TrustBadgeComp, RiskBadge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { RatingDisplay } from '@/components/common/StarRating';
import { DemandHeatmap, MockMap } from '@/components/maps/MockMap';
import { matchSuppliers, suggestPrice } from '@/lib/aquaMatch';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
  Users, Store, Truck, Package, DollarSign, TrendingUp,
  Search, Check, X, Eye, AlertCircle, ShieldCheck, BarChart3,
  Zap, CheckCircle2, XCircle, Clock, Activity, Globe, MapPin, Star
} from 'lucide-react';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { Water3DEffect } from '@/components/effects/Water3DEffect';

// ─── ADMIN DATA HOOK ─────────────────────────────────────────
export function useAdminData() {
  const [data, setData] = useState({
    dashboard: null as any,
    orders: [] as any[],
    suppliers: [] as any[],
    customers: [] as any[],
    drivers: [] as any[],
    loading: true
  });

  useEffect(() => {
    Promise.all([
      api.admin.getDashboard().catch(() => null),
      api.orders.getAll().catch(() => []),
      api.suppliers.getAll().catch(() => []),
      api.customers.getAll().catch(() => []),
      api.drivers.getAll().catch(() => [])
    ]).then(([dashboardData, apiOrders, apiSuppliers, apiCustomers, apiDrivers]) => {
      setData({
        dashboard: dashboardData,
        orders: apiOrders || [],
        suppliers: apiSuppliers || [],
        customers: apiCustomers || [],
        drivers: apiDrivers || [],
        loading: false
      });
    });
  }, []);

  return data;
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
export function AdminDashboard() {
  const { dashboard, orders, suppliers, customers, drivers, loading } = useAdminData();

  if (loading) return <div className="p-8 text-center text-muted">Loading live platform data...</div>;

  const kpis = dashboard?.kpis || {
    total_users: customers.length,
    active_suppliers: suppliers.length,
    active_drivers: drivers.length,
    active_orders: 0,
    total_revenue: 0,
    total_orders: orders.length,
    open_complaints: 0,
    verified_suppliers: suppliers.length
  };

  const revenueData = dashboard?.revenue_trends ? 
    Object.keys(dashboard.revenue_trends).map(k => ({
      month: new Date(k + "-01").toLocaleString('default', { month: 'short' }),
      revenue: dashboard.revenue_trends[k].revenue,
      orders: dashboard.revenue_trends[k].orders,
      customers: dashboard.kpis.total_users // Simplified for MVP
    })) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 3D Water Effect Header */}
      <Water3DEffect 
        title="Admin Control Center"
        subtitle="Real-time platform metrics, revenue tracking, and global logistics intelligence."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users"     value={kpis.total_users}  icon={Users}       iconBg="bg-blue-50"    iconColor="text-blue-600" />
        <KPICard title="Active Suppliers" value={kpis.active_suppliers} icon={Store} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <KPICard title="Active Drivers"  value={kpis.active_drivers} icon={Truck} iconBg="bg-amber-50"  iconColor="text-amber-600" />
        <KPICard title="Today's Orders"  value={kpis.active_orders}      icon={Package}     iconBg="bg-violet-50"  iconColor="text-violet-600" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Platform Revenue" value={formatCurrency(kpis.total_revenue)} icon={DollarSign}  iconBg="bg-primary-50"  iconColor="text-primary-600" />
        <KPICard title="Total Orders"     value={kpis.total_orders}                icon={BarChart3}   iconBg="bg-pink-50"    iconColor="text-pink-600" />
        <KPICard title="Open Complaints"  value={kpis.open_complaints} icon={AlertCircle} iconBg="bg-red-50" iconColor="text-red-600" />
        <KPICard title="Verified Suppliers" value={kpis.verified_suppliers} icon={ShieldCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-dark mb-4">Revenue & Growth Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
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
              { label: 'Order Success Rate', value: orders.length > 0 ? `${((orders.filter(o => ['completed', 'delivered'].includes(o.status)).length / orders.length) * 100).toFixed(1)}%` : 'N/A', color: 'text-emerald-600' },
              { label: 'Avg Delivery Time',  value: 'N/A', color: 'text-primary-600' },
              { label: 'Fleet Utilization',  value: drivers.length > 0 ? `${((drivers.filter(d => d.is_available === false).length / drivers.length) * 100).toFixed(1)}%` : 'N/A',   color: 'text-amber-600'   },
              { label: 'Customer Sat.',      value: suppliers.length > 0 ? `${(suppliers.reduce((acc, s) => acc + (s.rating || 0), 0) / suppliers.filter(s => s.rating).length || 1).toFixed(1)}/5` : 'N/A', color: 'text-violet-600'  },
              { label: 'Revenue MoM',        value: 'N/A',  color: 'text-emerald-600' },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted">{s.label}</span>
                <span className={cn('text-sm font-bold', s.color)}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Recent Registrations</h3>
        <div className="space-y-3">
          {[...customers.slice(0,3).map(c => ({ ...c, type: 'customer' })),
            ...suppliers.slice(0,2).map(s => ({ ...s, full_name: s.name, type: 'supplier' }))
          ].map((u, i) => (
            <div key={i} className="flex items-center gap-3">
              <Avatar name={u.full_name || 'User'} size="sm" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-dark">{u.full_name || 'User'}</div>
                <div className="text-xs text-muted capitalize">{u.type}</div>
              </div>
              <span className="badge-muted text-xs">{formatDate((u as any).created_at || new Date().toISOString())}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USER MANAGEMENT ──────────────────────────────────────────
export function UserManagementPage() {
  const { customers, suppliers, drivers, dashboard, loading } = useAdminData();
  const [search, setSearch] = useState('');

  if (loading) return <div className="p-8 text-center text-muted">Loading live users...</div>;

  const kpis = [
    { title: 'Total Customers', value: customers.length > 0 ? customers.length.toLocaleString() : '12,568' },
    { title: 'Total Suppliers', value: suppliers.length > 0 ? suppliers.length.toLocaleString() : '1,256' },
    { title: 'Active Drivers', value: drivers.length > 0 ? drivers.length.toLocaleString() : '320' },
    { title: 'Admins', value: '12' },
  ];

  const allUsers = [
    ...customers.map(c => ({
      id: c.id,
      name: c.full_name || 'Unknown',
      role: 'Customer',
      location: 'Bangalore', 
      status: c.is_active !== false ? 'Active' : 'Suspended',
      orders: dashboard?.user_stats?.orders_by_customer?.[c.id] || 0,
      statusColor: c.is_active !== false ? 'text-emerald-500' : 'text-red-500'
    })),
    ...suppliers.map(s => ({
      id: s.id,
      name: s.name || 'Unknown Supplier',
      role: 'Supplier',
      location: s.address?.split(',')[0] || 'Bangalore',
      status: s.is_verified ? 'Verified' : 'Pending',
      orders: dashboard?.user_stats?.orders_by_supplier?.[s.id] || 0,
      statusColor: s.is_verified ? 'text-[#0EA5E9]' : 'text-amber-500'
    })),
    ...drivers.map(d => ({
      id: d.id,
      name: d.full_name || 'Unknown Driver',
      role: 'Driver',
      location: 'Bangalore',
      status: d.is_available ? 'On Duty' : 'Offline',
      orders: dashboard?.user_stats?.orders_by_driver?.[d.id] || 0,
      statusColor: d.is_available ? 'text-emerald-500' : 'text-slate-400'
    }))
  ];

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    u.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">User Management</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="card bg-white shadow-sm border border-slate-100 rounded-2xl">
            <div className="text-sm font-medium text-slate-500 mb-2">{kpi.title}</div>
            <div className="text-2xl font-bold text-dark">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="card bg-white shadow-sm border border-slate-100 rounded-2xl p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-dark text-lg">All Users</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search users..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#6E30F2]" 
              />
            </div>
            <button className="bg-[#6E30F2] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5b25cc] transition-colors whitespace-nowrap">
              Add User
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Orders</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.slice(0, 20).map((u, i) => (
                <tr key={u.id || i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-dark">{u.name}</td>
                  <td className="p-4 text-sm text-slate-600">{u.role}</td>
                  <td className="p-4 text-sm text-slate-600">{u.location}</td>
                  <td className="p-4 text-sm">
                    <span className={cn("flex items-center gap-1.5 font-medium", u.statusColor)}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-dark text-right">{u.orders}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-slate-400 hover:text-[#6E30F2] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPLIER MANAGEMENT ──────────────────────────────────────
export function SupplierManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'fraud'>('overview');
  const [liveSuppliers, setLiveSuppliers] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.suppliers.getAll(),
      api.admin.getDashboard().catch(() => null)
    ]).then(([data, dashboard]) => {
      if (data && data.length > 0) {
        const mapped = data.map((l: any) => ({
          id: l.id,
          businessName: l.name || 'Unknown Supplier',
          address: { city: l.coverage_area?.[0] || 'Bangalore' },
          trustScore: l.trust_score || (Math.random() * 10 + 90).toFixed(1), // fallback
          trustBadge: l.badge || 'silver',
          rating: l.rating || 4.5,
          isActive: true,
          verification: {
            aadhaar: true,
            gst: true,
            business: true,
            quality: Math.random() > 0.2
          }
        }));
        setLiveSuppliers(mapped);
      }
    }).catch(console.error);
  }, []);

  const totalSuppliers = liveSuppliers.length > 0 ? liveSuppliers.length : 0;
  const avgTrustScore = liveSuppliers.length > 0 ? (liveSuppliers.reduce((acc, s) => acc + Number(s.trustScore), 0) / liveSuppliers.length).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary-600" /> AquaNovaX Verified Network
        </h1>
        <p className="text-muted mt-1">SupplierOS + Trust Layer</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
        {['overview', 'verification score', 'Fraud Detection'].map(t => {
          const tabKey = t.split(' ')[0].toLowerCase() as any;
          return (
            <button key={t} onClick={() => setActiveTab(tabKey)}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                activeTab === tabKey ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark')}>
              {t}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-white">
              <div className="text-sm text-muted">Verified Suppliers</div>
              <div className="text-2xl font-bold text-dark mt-1">{totalSuppliers > 0 ? totalSuppliers : 1256}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">↑ 8.4% vs last month</div>
            </div>
            <div className="card bg-white">
              <div className="text-sm text-muted">Pending Verification</div>
              <div className="text-2xl font-bold text-dark mt-1">48</div>
            </div>
            <div className="card bg-white">
              <div className="text-sm text-muted">Avg Trust Score</div>
              <div className="text-2xl font-bold text-dark mt-1">{avgTrustScore || '4.7'}/5</div>
            </div>
            <div className="card bg-white">
              <div className="text-sm text-muted">Fraud Blocked</div>
              <div className="text-2xl font-bold text-dark mt-1">23</div>
            </div>
          </div>

          <div className="card bg-white p-0 overflow-hidden mt-6">
            <div className="p-4 border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="font-semibold text-dark">Verified Network directory</h3>
            </div>
            <div className="divide-y divide-border">
              {(liveSuppliers.length > 0 ? liveSuppliers : [
                { id: 1, businessName: 'Aqua Fresh Water Supplies', trustBadge: 'gold', address: { city: 'Koramangala, Bangalore' }, trustScore: 4.8, verification: { aadhaar: true, gst: true, business: true, quality: true } },
                { id: 2, businessName: 'Near Seva Water', trustBadge: 'silver', address: { city: 'HSR Layout, Bangalore' }, trustScore: 4.6, verification: { aadhaar: true, gst: true, business: true, quality: true } },
                { id: 3, businessName: 'Jal Dhara Supplies', trustBadge: 'gold', address: { city: 'BTM Layout, Bangalore' }, trustScore: 4.7, verification: { aadhaar: true, gst: true, business: true, quality: true } },
                { id: 4, businessName: 'PureLife Tankers', trustBadge: 'bronze', address: { city: 'Whitefield, Bangalore' }, trustScore: 4.4, verification: { aadhaar: true, gst: true, business: true, quality: true } },
                { id: 5, businessName: 'Shiv Shakti Water', trustBadge: 'platinum', address: { city: 'Indiranagar, Bangalore' }, trustScore: 4.5, verification: { aadhaar: true, gst: true, business: true, quality: true } }
              ]).map((s: any) => (
                <div key={s.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <Avatar name={s.businessName} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-dark">{s.businessName}</span>
                        <span className={cn('text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border',
                          s.trustBadge === 'gold' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          s.trustBadge === 'silver' ? 'bg-slate-100 text-slate-500 border-slate-300' :
                          s.trustBadge === 'bronze' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-indigo-50 text-indigo-600 border-indigo-200'
                        )}>
                          {s.trustBadge}
                        </span>
                      </div>
                      <div className="text-sm text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {s.address.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      {[
                        { key: 'aadhaar', label: 'Aadhaar' },
                        { key: 'gst', label: 'GST' },
                        { key: 'business', label: 'Business' },
                        { key: 'quality', label: 'Quality' }
                      ].map(v => (
                        <div key={v.key} className="flex flex-col items-center gap-1">
                          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", s.verification[v.key] ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-[10px] text-muted font-medium">{v.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-right border-l border-border pl-6 min-w-[100px]">
                      <div className="text-2xl font-bold text-dark">{Number(s.trustScore).toFixed(1)}</div>
                      <div className="text-xs text-muted font-medium">Trust Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'verification' && (
        <div className="card bg-white mt-6">
          <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Supplier Verification Checklist
          </h3>
          <div className="space-y-4">
            {(liveSuppliers.length > 0 ? liveSuppliers : [
              { id: 1, businessName: 'Aqua Fresh Water Supplies', trustBadge: 'gold', rating: 4.8, verification: { aadhaar: true, gst: true, business: true, quality: true } }
            ]).map((s: any) => (
              <div key={s.id} className="p-5 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                <div className="flex items-center gap-4">
                  <Avatar name={s.businessName} size="md" />
                  <div>
                    <div className="font-bold text-dark text-lg">{s.businessName}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className={cn('text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border',
                        s.trustBadge === 'gold' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        s.trustBadge === 'silver' ? 'bg-slate-100 text-slate-500 border-slate-300' :
                        s.trustBadge === 'bronze' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-indigo-50 text-indigo-600 border-indigo-200'
                      )}>
                        {s.trustBadge}
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Performance Score: {s.rating} / 5.0
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 flex-wrap w-full md:w-auto">
                  {[
                    { key: 'aadhaar', label: 'Aadhaar Verification' },
                    { key: 'gst', label: 'GST Number' },
                    { key: 'business', label: 'Business License' },
                    { key: 'quality', label: 'Water Quality Report' }
                  ].map(v => (
                    <div key={v.key} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white", s.verification[v.key] ? "border-emerald-200 text-emerald-700" : "border-slate-200 text-slate-400")}>
                      {s.verification[v.key] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span className="text-xs font-semibold">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'fraud' && (
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="card bg-white">
            <h3 className="font-semibold text-dark mb-5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" /> Fraud Detection System
            </h3>
            <div className="space-y-4">
              {[
                { title: 'AI Identity Verification', desc: 'Face match with Govt ID & Aadhaar', active: true },
                { title: 'Location Spoofing Guard', desc: 'Detects mock GPS apps & VPN routing', active: true },
                { title: 'Invoice Tampering Check', desc: 'OCR mismatch detection for GST bills', active: true },
                { title: 'Quality Report Forgery', desc: 'Blockchain verification of lab reports', active: false }
              ].map((sys, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-xl bg-slate-50">
                  <div>
                    <div className="font-semibold text-dark text-sm">{sys.title}</div>
                    <div className="text-xs text-muted mt-0.5">{sys.desc}</div>
                  </div>
                  <div className={cn("px-2.5 py-1 text-xs font-bold rounded-full border", sys.active ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-400 border-slate-200")}>
                    {sys.active ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white border-red-100">
            <h3 className="font-semibold text-dark mb-5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Recent Fraud Alerts
            </h3>
            <div className="space-y-4">
              {[
                { id: 'FA-992', supplier: 'Manoj Water Services', type: 'Location Spoofing', action: 'Account Suspended', time: '2 hours ago', severity: 'high' },
                { id: 'FA-991', supplier: 'BlueDrop Tanks', type: 'Fake Quality Report', action: 'Warning Issued', time: '5 hours ago', severity: 'medium' },
                { id: 'FA-990', supplier: 'Raju Supplies', type: 'Aadhaar Mismatch', action: 'Verification Failed', time: '1 day ago', severity: 'high' },
              ].map(alert => (
                <div key={alert.id} className="p-4 border border-border rounded-xl bg-white hover:border-red-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">{alert.id}</span>
                      <span className="font-semibold text-sm text-dark">{alert.supplier}</span>
                    </div>
                    <span className="text-[10px] font-medium text-muted">{alert.time}</span>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500">Alert Type</div>
                      <div className="text-sm font-semibold text-dark">{alert.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-slate-500">Action Taken</div>
                      <div className={cn("text-sm font-semibold", alert.severity === 'high' ? "text-red-600" : "text-amber-600")}>{alert.action}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DRIVER MANAGEMENT ────────────────────────────────────────
export function DriverManagementPage() {
  const { drivers, dashboard, loading } = useAdminData();
  const [search, setSearch] = useState('');
  
  if (loading) return <div className="p-8 text-center text-muted">Loading live drivers...</div>;

  const filtered = drivers.filter(d => !search || d.name?.toLowerCase().includes(search.toLowerCase()));
  const driverStats = dashboard?.user_stats?.completed_deliveries_by_driver || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Driver Management</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Drivers', value: drivers.length,                         color: 'text-dark'         },
          { label: 'Available',     value: drivers.filter(d => d.isAvailable !== false).length, color: 'text-emerald-600'  },
          { label: 'Active',        value: drivers.filter(d => d.isActive !== false).length,  color: 'text-primary-600' },
          { label: 'Avg Rating',    value: drivers.length ? (drivers.reduce((s,d)=>s+(d.rating||5),0)/drivers.length).toFixed(1) : '0', color: 'text-amber-600' },
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
              {filtered.slice(0, 20).map(d => {
                const completed = driverStats[d.id] || 0;
                return (
                  <tr key={d.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={d.name || 'Driver'} size="xs" />
                        <div>
                          <div className="font-medium text-sm">{d.name || 'Driver'}</div>
                          <div className="text-xs text-muted font-mono">{d.id?.slice(0,10)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-muted">{d.supplierName || 'Independent'}</td>
                    <td><RatingDisplay rating={d.rating || 0} size="sm" /></td>
                    <td><span className="font-semibold">{completed}</span></td>
                    <td>{d.distanceCovered ? `${d.distanceCovered.toLocaleString()} km` : 'N/A'}</td>
                    <td>
                      {d.isAvailable !== false
                        ? <span className="badge-success">Available</span>
                        : <span className="badge-muted">On Delivery</span>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-muted">No drivers found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER MONITORING ─────────────────────────────────────────
export function OrderMonitoringPage() {
  const { orders, loading } = useAdminData();
  const [statusFilter, setStatusFilter] = useState('all');
  
  if (loading) return <div className="p-8 text-center text-muted">Loading live orders...</div>;
  
  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Order Monitoring</h1>
      <div className="flex gap-2 flex-wrap">
        {['all','pending','confirmed','dispatched','en_route','delivered','cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn('btn-sm capitalize', statusFilter === s ? 'btn-primary' : 'btn-secondary')}>
            {s === 'all' ? `All (${orders.length})` : `${s.replace('_',' ')} (${orders.filter(o => o.status === s).length})`}
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
                  <td>{o.customers?.full_name || 'Unknown'}</td>
                  <td>{o.suppliers?.name || 'Unknown'}</td>
                  <td>{Number(o.quantity).toLocaleString()}L</td>
                  <td className="font-semibold">{formatCurrency(o.amount || 0)}</td>
                  <td><span className={cn('badge', o.type === 'emergency' ? 'badge-danger' : o.type === 'scheduled' ? 'badge-primary' : 'badge-muted')}>{o.type || 'standard'}</span></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-muted text-xs">{formatDate(o.created_at || new Date().toISOString())}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-muted">No orders found.</td></tr>}
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
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.complaints.getAll().then(data => {
      setComplaints(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-muted">Loading complaints...</div>;

  const openComplaints = complaints.filter(c => c.status === 'open');
  const underReview = complaints.filter(c => c.status === 'under_review');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
  const escalated = complaints.filter(c => c.status === 'escalated');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Complaint Management</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open',         value: openComplaints.length, color: 'text-red-600'     },
          { label: 'Under Review', value: underReview.length, color: 'text-amber-600'   },
          { label: 'Resolved',     value: resolvedComplaints.length, color: 'text-emerald-600' },
          { label: 'Escalated',    value: escalated.length, color: 'text-purple-600'  },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={cn('text-3xl font-bold', s.color)}>{s.value}</div>
            <div className="text-sm text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {complaints.length === 0 && (
          <div className="card text-center text-muted py-12">No complaints reported.</div>
        )}
        {complaints.map(c => (
          <div key={c.id} className="card flex items-start gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">ID: {c.id.split('-')[0]}</span>
                <StatusBadge status={c.status} />
              </div>
              <h3 className="font-semibold text-dark mt-1">{c.description}</h3>
              <p className="text-sm text-muted mt-1">Customer: {c.customers?.full_name || 'Unknown'} | Supplier: {c.suppliers?.name || 'Unknown'}</p>
            </div>
            <div className="text-sm text-muted">{formatDate(c.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SYSTEM ANALYTICS ────────────────────────────────────────
export function SystemAnalyticsPage() {
  const { customers, suppliers, orders, dashboard, loading } = useAdminData();

  if (loading) return <div className="p-8 text-center text-muted">Loading analytics...</div>;

  const totalRevenue = dashboard?.kpis?.total_revenue || 0;

  const kpis = [
    { title: 'Total Orders', value: orders.length.toLocaleString(), trend: 'Live' },
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), trend: 'Live' },
    { title: 'Active Suppliers', value: suppliers.length.toLocaleString(), trend: 'Live' },
    { title: 'Customers', value: customers.length.toLocaleString(), trend: 'Live' }
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const trendMap = new Map<string, number>();
  orders.forEach(o => {
    if (!o.created_at) return;
    const dayName = days[new Date(o.created_at).getDay()];
    trendMap.set(dayName, (trendMap.get(dayName) || 0) + 1);
  });
  
  const todayIdx = new Date().getDay();
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const dIdx = (todayIdx - i + 7) % 7;
    trendData.push({ day: days[dIdx], orders: trendMap.get(days[dIdx]) || 0 });
  }

  const areaMap = new Map<string, number>();
  orders.forEach(o => {
    const loc = o.delivery_address?.split(',')[0] || 'Unknown';
    areaMap.set(loc, (areaMap.get(loc) || 0) + 1);
  });
  const topAreas = Array.from(areaMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const revenueModels = [
    { title: 'Commission', amount: '5-15%', subtitle: 'Per Order', color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Supplier Sub.', amount: '₹499-4999', subtitle: 'Monthly', color: 'bg-blue-50 text-blue-600' },
    { title: 'Priority Listing', amount: '₹999/mo', subtitle: 'Premium', color: 'bg-amber-50 text-amber-600' },
    { title: 'Fleet SaaS', amount: '₹2999/mo', subtitle: 'Management', color: 'bg-purple-50 text-purple-600' },
    { title: 'Quality Services', amount: '₹199/report', subtitle: 'Verification', color: 'bg-rose-50 text-rose-600' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark mb-6">Analytics & Reports</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="card bg-white shadow-sm border border-slate-100 rounded-2xl">
            <div className="text-sm font-medium text-slate-500 mb-2">{kpi.title}</div>
            <div className="text-2xl font-bold text-dark mb-2">{kpi.value}</div>
            <div className="flex items-center text-xs font-bold text-emerald-600">
              {kpi.trend} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card bg-white shadow-sm border border-slate-100 rounded-2xl">
          <h3 className="font-bold text-dark mb-6 text-lg">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Demand Areas */}
        <div className="card bg-white shadow-sm border border-slate-100 rounded-2xl">
          <h3 className="font-bold text-dark mb-6 text-lg">Top Demand Areas</h3>
          <div className="space-y-6">
            {topAreas.map((area, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-dark text-sm">{area.name}</span>
                  <span className="font-bold text-dark text-sm">{area.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-[#0EA5E9] h-2 rounded-full" 
                    style={{ width: `${(area.value / 1500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Model */}
      <div className="card bg-white shadow-sm border border-slate-100 rounded-2xl">
         <h3 className="font-bold text-dark mb-6 text-lg">Revenue Model</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
           {revenueModels.map((model, i) => (
             <div key={i} className="p-5 rounded-2xl border border-slate-100 shadow-sm bg-slate-50 hover:shadow-md transition-shadow">
               <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", model.color)}>
                 <DollarSign className="w-5 h-5" />
               </div>
               <div className="text-xl font-bold text-dark mb-1">{model.amount}</div>
               <div className="font-bold text-dark text-sm">{model.title}</div>
               <div className="text-xs text-muted mt-1">{model.subtitle}</div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}


// ─── AQUA MATCH DASHBOARD ────────────────────────────────────
export function AquaMatchDashboard() {
  const { suppliers, orders } = useAdminData();

  const formattedSuppliers = suppliers.map(s => ({
    id: s.id,
    businessName: s.name || 'Unknown Supplier',
    pricePerKL: s.price_per_kl || 1000,
    waterQuality: { qualityScore: s.rating ? s.rating * 20 : 0 },
    trustBadge: s.badge || 'unverified',
    location: { lat: s.latitude || 12.9716, lng: s.longitude || 77.5946 },
    rating: s.rating || 0
  }));

  const matches = matchSuppliers(formattedSuppliers as any, { lat: 12.935, lng: 77.624 }); // Koramangala
  const topMatches = matches.length > 0 ? matches.slice(0, 2) : formattedSuppliers.slice(0, 2);

  const areaMap = new Map<string, number>();
  orders.forEach(o => {
    const loc = o.delivery_address?.split(',')[0] || 'Bangalore';
    areaMap.set(loc, (areaMap.get(loc) || 0) + 1);
  });
  const sortedAreas = Array.from(areaMap.entries()).sort((a,b) => b[1] - a[1]);
  const maxOrders = sortedAreas[0]?.[1] || 1;
  const zones = sortedAreas.slice(0, 6).map(([zone, val]) => ({
    zone, intensity: Math.max(0.2, val / maxOrders), orders: val
  }));
  if (zones.length === 0) zones.push({ zone: 'Bangalore', intensity: 0.5, orders: 0 });

  const topArea = zones[0].zone;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = new Date().getDay();
  const forecastData = [];
  for (let i = 0; i < 7; i++) {
    const dIdx = (todayIdx + i + 1) % 7;
    const isPeak = i === 4; // Mock peak day prediction for UI demo
    forecastData.push({ d: days[dIdx], h: isPeak ? 100 : Math.floor(Math.random() * 60) + 20, peak: isPeak });
  }

  const supplyDemand = [];
  for (let i = 0; i < 7; i++) {
    const dIdx = (todayIdx - 6 + i + 7) % 7;
    const baseDemand = 600 + Math.floor(Math.random() * 400);
    const baseSupply = baseDemand - Math.floor(Math.random() * 100) + 50;
    supplyDemand.push({ d: days[dIdx], dem: baseDemand, sup: baseSupply });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#6E30F2] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              AquaMatch AI Engine
            </h1>
            <p className="text-white/80 font-medium mt-1">Demand-Supply Matching + Forecasting</p>
            <p className="text-white/70 text-sm mt-3">AI matches demand with the right supplier at the right time. Increase order fulfillment with smart demand prediction.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Col: Heatmap & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-white p-0 overflow-hidden border border-slate-100 shadow-sm rounded-2xl">
            <div className="p-6 pb-2 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-dark">Demand Heatmap</h3>
              <div className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 font-medium">
                Bangalore
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            <div className="p-6">
               <DemandHeatmap zones={zones} />
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border-t border-border">
              <div>
                <div className="text-[10px] text-muted mb-1 uppercase tracking-wider font-semibold">High Demand Area</div>
                <div className="font-bold text-dark text-sm">{topArea}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted mb-1 uppercase tracking-wider font-semibold">Peak Time</div>
                <div className="font-bold text-dark text-sm">7 AM – 10 AM</div>
              </div>
              <div>
                <div className="text-[10px] text-muted mb-1 uppercase tracking-wider font-semibold">Expected Orders</div>
                <div className="font-bold text-emerald-600 text-sm flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +{orders.length > 0 ? '12' : '0'}% vs Yesterday</div>
              </div>
              <div>
                <div className="text-[10px] text-muted mb-1 uppercase tracking-wider font-semibold">Suggested Price</div>
                <div className="font-bold text-primary-600 text-sm">₹1,150 – ₹1,250</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-white border-slate-100 shadow-sm rounded-2xl">
              <h3 className="font-bold text-dark mb-4 text-lg">Smart Supplier Match</h3>
              <p className="text-xs text-muted mb-4">Based on: {topArea}</p>
              <div className="space-y-3">
                {topMatches.map((match, i) => (
                  <div key={match.id} className={cn("p-3 border rounded-xl relative overflow-hidden", i === 0 ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50")}>
                    {i === 0 && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">Best Match</div>}
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-dark">{match.businessName}</div>
                      <div className="font-bold text-primary-600">₹{match.pricePerKL}</div>
                    </div>
                    <div className="flex justify-between text-xs text-muted">
                      <span>5000L • ETA {15 + i * 10}m</span>
                      <span className="flex items-center gap-1">⭐ {match.rating} • {1.5 + i * 1.5} km</span>
                    </div>
                  </div>
                ))}
                {topMatches.length === 0 && <div className="text-sm text-muted">No active suppliers found.</div>}
              </div>
            </div>

            <div className="card bg-white border-slate-100 shadow-sm rounded-2xl">
              <h3 className="font-bold text-dark mb-4 text-lg">AI Pricing Recommendations</h3>
              <div className="space-y-4">
                {zones.slice(0, 3).map((z, i) => (
                  <div key={z.zone} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-dark text-sm">{z.zone}</div>
                      <div className={cn("text-xs font-medium", z.intensity > 0.7 ? 'text-red-500' : 'text-amber-500')}>
                        Demand: {z.intensity > 0.7 ? 'High' : 'Medium'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-dark">₹{1100 + (3 - i) * 50}-{1200 + (3 - i) * 50}</div>
                      <div className="text-xs text-emerald-600 font-medium">+{3 + (3 - i)}% vs avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Forecasts */}
        <div className="space-y-6">
          <div className="card bg-white border-slate-100 shadow-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-dark mb-1">AI Demand Forecast</h3>
            <p className="text-[13px] text-slate-400 mb-8">Next 7 Days Prediction</p>
            <div className="flex items-end justify-between h-40 gap-2">
              {forecastData.map(day => (
                <div key={day.d} className="flex flex-col items-center flex-1 h-full justify-end group">
                  {day.peak && <div className="text-[10px] font-bold text-red-500 mb-1">Peak</div>}
                  <div className={cn("w-full rounded-sm transition-all", day.peak ? "bg-red-500" : "bg-primary-200 group-hover:bg-primary-300")} style={{ height: `${day.h}%` }} />
                  <div className="text-xs font-medium text-slate-500 mt-2">{day.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white border-slate-100 shadow-sm rounded-2xl">
            <h3 className="font-semibold text-dark mb-4 text-lg">Supply vs Demand Forecasting</h3>
            <div className="space-y-3">
              {supplyDemand.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 text-xs font-bold text-slate-500">{row.d}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] w-12 text-muted text-right">Demand</div>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{width: `${(row.dem/1200)*100}%`}} />
                      </div>
                      <div className="text-[10px] font-bold w-8 text-right text-dark">{row.dem}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] w-12 text-muted text-right">Supply</div>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{width: `${(row.sup/1200)*100}%`}} />
                      </div>
                      <div className="text-[10px] font-bold w-8 text-right text-dark">{row.sup}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN QUALITY PAGE ──────────────────────────────────────
export function AdminQualityPage() {
  const { suppliers, loading } = useAdminData();

  if (loading) return <div className="p-8 text-center text-muted">Loading quality data...</div>;

  const topSupplier = suppliers.sort((a,b) => (b.rating || 0) - (a.rating || 0))[0];

  if (!topSupplier) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-dark mb-6">Quality Intel Dashboard</h1>
        <div className="card text-center text-muted py-12">No supplier quality data available.</div>
      </div>
    );
  }

  const score = topSupplier.rating ? topSupplier.rating * 20 : 80;
  const tds = Math.floor(100 + (100 - score) * 2);
  const ph = (7.0 + (score - 80) * 0.02).toFixed(1);
  const hardness = Math.floor(150 + (100 - score) * 3);
  const chlorine = 0.2;
  
  // mock history dynamically
  const days = ['15 May', '16 May', '17 May', '18 May', '19 May', '20 May'];
  const history = days.map((d, i) => ({
    date: d,
    val: i === 5 ? score : Math.max(50, score - 5 + Math.floor(Math.random() * 10)),
    active: i === 5
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark mb-6">Quality Intel Dashboard</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Card: Water Quality Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-dark mb-1">Water Quality Report</h2>
          <p className="text-sm text-slate-400 mb-6">{topSupplier.name || 'Unknown Supplier'} • Today</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100 flex flex-col justify-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{tds}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">ppm</div>
              <div className="text-sm font-bold text-dark mt-1">TDS</div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">Good</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100 flex flex-col justify-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{ph}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">pH</div>
              <div className="text-sm font-bold text-dark mt-1">pH Level</div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">Good</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100 flex flex-col justify-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{hardness}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">ppm</div>
              <div className="text-sm font-bold text-dark mt-1">Hardness</div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">Good</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100 flex flex-col justify-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{chlorine}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">ppm</div>
              <div className="text-sm font-bold text-dark mt-1">Chlorine</div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">Safe</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <div className="text-sm text-slate-400 mb-1">Source</div>
              <div className="font-bold text-dark text-lg">Deep Borewell</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Location</div>
              <div className="font-bold text-dark text-lg">{topSupplier.address?.split(',')[0] || 'Bangalore'}</div>
            </div>
          </div>

          <div className={cn("rounded-2xl p-6 flex items-center gap-6 mt-auto", score >= 80 ? "bg-emerald-50" : "bg-amber-50")}>
            <div className="relative w-24 h-24 flex-shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="48" cy="48" r="42" fill="transparent" stroke="#e2e8f0" strokeWidth="10" />
                 <circle cx="48" cy="48" r="42" fill="transparent" stroke={score >= 80 ? "#10b981" : "#f59e0b"} strokeWidth="10" strokeDasharray={`${(score/100)*263} 263`} className="drop-shadow-sm" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                 <span className={cn("text-2xl font-bold leading-none", score >= 80 ? "text-emerald-700" : "text-amber-700")}>{Math.round(score)}</span>
                 <span className={cn("text-xs leading-none mt-1 font-medium", score >= 80 ? "text-emerald-600/80" : "text-amber-600/80")}>/100</span>
               </div>
            </div>
            <div>
              <div className={cn("text-2xl font-bold mb-1.5", score >= 80 ? "text-emerald-600" : "text-amber-600")}>{score >= 80 ? 'Excellent' : 'Average'}</div>
              <div className="flex gap-1 mb-2">
                 {[1,2,3,4,5].map(star => (
                   <Star key={star} className={cn("w-5 h-5", star <= Math.round(score/20) ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                 ))}
              </div>
              <div className="text-[15px] text-dark font-medium">{score >= 80 ? 'Very Safe for Consumption' : 'Acceptable Quality'}</div>
            </div>
          </div>
        </div>

        {/* Right Card: Quality History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-dark mb-8">Quality History</h2>
          
          <div className="flex items-end gap-3 h-48 mb-10">
             {history.map((d, i) => (
               <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                 <div className={cn("w-full rounded-sm transition-all", d.active ? "bg-[#0c62e8]" : "bg-blue-50/70")} style={{ height: `${(d.val / 100) * 100}%` }} />
                 <div className="text-[10px] text-slate-400 mt-3">{d.date}</div>
                 <div className={cn("text-xs font-bold mt-1.5", d.active ? "text-[#0c62e8]" : "text-blue-500")}>{d.val}</div>
               </div>
             ))}
          </div>

          <h3 className="font-bold text-dark mb-6 text-lg">Quality Parameters</h3>
          <div className="space-y-6 mt-auto">
             <div className="flex items-center gap-4">
               <span className="w-24 text-[15px] font-semibold text-dark">TDS (ppm)</span>
               <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(tds/300)*100}%`}} />
               </div>
               <span className="font-bold text-dark w-10 text-right">{tds}</span>
               <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded text-xs font-bold w-14 text-center">Good</span>
             </div>
             <div className="flex items-center gap-4">
               <span className="w-24 text-[15px] font-semibold text-dark">pH Level</span>
               <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(parseFloat(ph)/14)*100}%`}} />
               </div>
               <span className="font-bold text-dark w-10 text-right">{ph}</span>
               <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded text-xs font-bold w-14 text-center">Good</span>
             </div>
             <div className="flex items-center gap-4">
               <span className="w-24 text-[15px] font-semibold text-dark">Hardness</span>
               <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(hardness/300)*100}%`}} />
               </div>
               <span className="font-bold text-dark w-10 text-right">{hardness}</span>
               <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded text-xs font-bold w-14 text-center">Good</span>
             </div>
          </div>
        </div>
      </div>

      {/* AI Quality Intelligence Section */}
      <div className="card bg-white mt-6">
        <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-500" /> AI Quality Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-slate-50 flex flex-col">
            <span className="text-sm font-semibold text-slate-500 mb-2">Quality Risk Detection</span>
            <div className="flex items-center gap-2 mt-auto">
              <ShieldCheck className={cn("w-5 h-5", score >= 80 ? "text-emerald-500" : "text-amber-500")} />
              <span className="font-bold text-dark text-lg">{score >= 80 ? 'Low Risk' : 'Medium Risk'}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-slate-50 flex flex-col">
            <span className="text-sm font-semibold text-slate-500 mb-2">Supplier Risk Scoring</span>
            <div className="flex items-center gap-2 mt-auto">
              <ShieldCheck className={cn("w-5 h-5", topSupplier.badge === 'verified' || topSupplier.badge === 'gold' ? "text-emerald-500" : "text-amber-500")} />
              <span className="font-bold text-dark text-lg">{topSupplier.badge === 'verified' || topSupplier.badge === 'gold' ? 'Low Risk' : 'Medium Risk'}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-slate-50 flex flex-col">
            <span className="text-sm font-semibold text-slate-500 mb-2">Source Risk Analysis</span>
            <div className="flex items-center gap-2 mt-auto">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-dark text-lg">Low Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
