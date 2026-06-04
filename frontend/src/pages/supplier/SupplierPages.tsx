// Supplier Portal — All Pages
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge, TrustBadgeComp } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { getTankersBySupplier } from '@/data/tankers';
import { DRIVERS } from '@/data/drivers';
import { QUALITY_REPORTS } from '@/data/mockData';
import { REVENUE_DATA } from '@/data/mockData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import {
  Package, DollarSign, Truck, Star, Check, X,
  Plus, Edit2, FileText, AlertCircle, Loader2, Shield, Upload, CheckCircle2
} from 'lucide-react';

// ─── SUPPLIER DASHBOARD ───────────────────────────────────────
export function SupplierDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Record<string, any>[]>([]);
  const [supplier, setSupplier] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  const activeTankers = myTankers.filter(t => t.status === 'in_use').length;
  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const ORDER_STATUS_DATA = [
    { name: 'Delivered',  value: orders.filter(o => o.status === 'delivered').length,  color: '#10B981' },
    { name: 'Active',     value: orders.filter(o => ['confirmed','dispatched','en_route'].includes(o.status)).length, color: '#0EA5E9' },
    { name: 'Cancelled',  value: orders.filter(o => o.status === 'cancelled').length,   color: '#EF4444' },
    { name: 'Pending',    value: orders.filter(o => o.status === 'pending').length,     color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark">{supplier?.name || user?.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <TrustBadgeComp badge={supplier?.badge || 'bronze'} />
            <span className="text-muted text-sm">Trust Score: <strong className="text-dark">{supplier?.trust_score || 0}/100</strong></span>
          </div>
        </div>
        <button onClick={() => navigate('/supplier/kyc')} className="btn-secondary">
          <Shield className="w-4 h-4" /> Verify Business
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Orders"   value={orders.length}               icon={Package}     iconBg="bg-blue-50"    iconColor="text-blue-600"    change={18} changeLabel="this month" />
        <KPICard title="Revenue"        value={formatCurrency(revenue)}     icon={DollarSign}  iconBg="bg-emerald-50" iconColor="text-emerald-600" change={12} />
        <KPICard title="Active Tankers" value={`${activeTankers}/${myTankers.length}`} icon={Truck} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <KPICard title="Avg Rating"     value={supplier?.rating || 0}       icon={Star}        iconBg="bg-yellow-50"  iconColor="text-yellow-600"  change={4} />
      </div>

      {pendingOrders > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="font-semibold text-amber-800">{pendingOrders} new orders awaiting your response</span>
          <a href="#orders" className="ml-auto btn-primary btn-sm bg-amber-600 hover:bg-amber-700">View Orders</a>
        </div>
      )}
      
      {(supplier?.trust_score || 0) < 100 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <Shield className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="font-semibold text-red-800">Complete your KYC to unlock Trust Badges and increase visibility</span>
          <button onClick={() => navigate('/supplier/kyc')} className="ml-auto btn-primary btn-sm bg-red-600 hover:bg-red-700">Complete KYC</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-dark mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fill="url(#rv)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Order Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={ORDER_STATUS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" paddingAngle={3}>
                {ORDER_STATUS_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {ORDER_STATUS_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted">{d.name}</span>
                </span>
                <span className="font-semibold text-dark">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" id="orders">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark">Recent Orders</h3>
          {pendingOrders > 0 && <span className="badge-warning">{pendingOrders} pending</span>}
        </div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {orders.slice(0, 8).map(o => (
                <tr key={o.id}>
                  <td><span className="font-mono text-xs text-muted">{o.id.slice(0,8)}</span></td>
                  <td className="font-medium text-dark">{o.customers?.full_name || 'Customer'}</td>
                  <td>{Number(o.quantity).toLocaleString()}L</td>
                  <td className="font-bold text-primary-600">{formatCurrency(o.amount)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.status === 'pending' && (
                      <div className="flex gap-1">
                        <button className="btn-success btn-sm px-2"><Check className="w-3 h-3" /></button>
                        <button className="btn-danger btn-sm px-2"><X className="w-3 h-3" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-6 text-muted">No recent orders</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER MANAGEMENT ─────────────────────────────────────────
export function SupplierOrdersPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'pending'|'active'|'completed'>('pending');
  const [orders, setOrders] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api.orders.getAll({ supplierId: user.id }).then(data => {
      setOrders(data || []);
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(() => {
    if (tab === 'pending')   return orders.filter(o => o.status === 'pending');
    if (tab === 'active')    return orders.filter(o => ['confirmed','dispatched','en_route'].includes(o.status));
    return orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
  }, [tab, orders]);

  const handleAccept = async (id: string) => {
    setAccepting(id);
    await new Promise(r => setTimeout(r, 800));
    setAccepting(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Order Management</h1>
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {(['pending','active','completed'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
              tab === t ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark')}>
            {t}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <div key={o.id} className="card-hover">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-dark text-lg">{o.customers?.full_name || 'Customer'}</span>
                    <StatusBadge status={o.status} />
                    {o.eta === '2 hours' && <span className="badge-danger bg-red-100 text-red-700">🚨 Emergency</span>}
                  </div>
                  <div className="text-xs text-muted mt-1 font-mono">{o.id} • {formatDate(o.created_at)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600 text-xl">{formatCurrency(o.amount)}</div>
                  <div className="text-sm font-medium text-muted">{Number(o.quantity).toLocaleString()}L</div>
                </div>
              </div>
              {tab === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleAccept(o.id)} className="btn-success btn-sm flex-1" disabled={accepting === o.id}>
                    {accepting === o.id ? 'Accepting…' : <><Check className="w-4 h-4" /> Accept Order</>}
                  </button>
                  <button className="btn-danger btn-sm flex-1"><X className="w-4 h-4" /> Reject</button>
                  <button className="btn-secondary btn-sm flex-1">Assign Driver</button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="card text-center py-16 border-dashed border-2 border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-muted font-medium">No {tab} orders at the moment</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TankerManagementPage() {
  const { user } = useAuthStore();
  const myDrivers = DRIVERS.filter(d => d.supplierId === user?.id);
  const [tankers, setTankers] = useState<Record<string, any>[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRegNo, setNewRegNo] = useState('');
  const [newCapacity, setNewCapacity] = useState('5000');
  const [newType, setNewType] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.tankers.getAll(user.id).then(data => {
      setTankers(data || []);
      setLoading(false);
    });
  }, [user]);

  const handleAddTankerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegNo.trim() || !user) return;
    
    setSaving(true);
    const newTanker = {
      registration_number: newRegNo,
      type: newType,
      capacity: parseInt(newCapacity) || 5000,
      current_load: 0,
      status: 'available',
      supplier_id: user.id
    };
    
    try {
      const added = await api.tankers.create(newTanker);
      if (added) setTankers([added, ...tankers]);
      setShowModal(false);
      setNewRegNo('');
      setNewCapacity('5000');
      setNewType('medium');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">Tanker Fleet</h1>
        <button className="btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Tanker
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Add New Tanker</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-muted" /></button>
            </div>
            <form onSubmit={handleAddTankerSubmit} className="space-y-4">
              <div>
                <label className="label">Registration Number</label>
                <input required type="text" placeholder="e.g. MH04 AB 1234" value={newRegNo} onChange={e => setNewRegNo(e.target.value)} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Capacity (Liters)</label>
                  <input required type="number" step="1000" min="1000" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="input">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1" disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving...' : 'Save Tanker'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total', value: tankers.length, color: 'text-dark' },
          { label: 'Available', value: tankers.filter(t => t.status === 'available').length, color: 'text-emerald-600' },
          { label: 'In Use', value: tankers.filter(t => t.status === 'in_use').length, color: 'text-primary-600' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted" /> : <div className={cn('text-3xl font-bold', s.color)}>{s.value}</div>}
            <div className="text-muted text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Reg. No</th><th>Type</th><th>Capacity</th><th>Load</th><th>Status</th><th>Driver</th><th>Actions</th></tr></thead>
            <tbody>
              {tankers.slice(0, 15).map(t => {
                const driver = myDrivers.find(d => d.tankerIds?.includes(t.id));
                return (
                  <tr key={t.id}>
                    <td><span className="font-mono text-xs">{t.registration_number || t.registrationNumber}</span></td>
                    <td><span className="badge-muted capitalize">{t.type}</span></td>
                    <td>{t.capacity.toLocaleString()}L</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16">
                          <div className="h-1.5 bg-primary-500 rounded-full" style={{ width: `${(t.capacity > 0 ? ((t.current_load ?? t.currentLoad)/t.capacity) : 0)*100}%` }} />
                        </div>
                        <span className="text-xs text-muted">{t.capacity > 0 ? Math.round((t.current_load ?? t.currentLoad)/t.capacity*100) : 0}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={cn('badge', t.status === 'available' ? 'badge-success' : t.status === 'in_use' ? 'badge-primary' : 'badge-warning')}>
                        {t.status.replace('_',' ')}
                      </span>
                    </td>
                    <td>{driver?.name ?? <span className="text-muted">Unassigned</span>}</td>
                    <td><button className="btn-ghost btn-sm"><Edit2 className="w-3.5 h-3.5" /></button></td>
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

// ─── WATER QUALITY PAGE ────────────────────────────────────────
export function WaterQualityPage() {
  const { user } = useAuthStore();
  const [supplier, setSupplier] = useState<Record<string, any> | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) api.suppliers.getOne(user.id).then(setSupplier).catch(() => {});
  }, [user]);

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setShowUpload(false);
      setSelectedFile(null);
      alert('Quality report uploaded successfully! It is pending admin approval.');
    }, 1500);
  };

  const tds = supplier?.tds || 50;
  const ph = supplier?.ph || 7.2;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">Water Quality Reports</h1>
        <button onClick={() => setShowUpload(true)} className="btn-primary btn-sm">
          <Upload className="w-4 h-4" /> Upload Report
        </button>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Upload Lab Report</h3>
              <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-muted" /></button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors mb-4">
              {selectedFile ? (
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-dark">{selectedFile.name}</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-dark mb-1">Click to upload PDF report</p>
                  <label className="btn-secondary text-sm cursor-pointer mt-2">
                    Select File
                    <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} accept=".pdf" />
                  </label>
                </>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button type="button" onClick={() => setShowUpload(false)} className="btn-secondary flex-1" disabled={uploading}>Cancel</button>
              <button onClick={handleUpload} className="btn-primary flex-1" disabled={uploading || !selectedFile}>
                {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-50" />
        <div className="relative">
          <div className="text-6xl font-bold text-emerald-500 mb-2">85</div>
          <div className="text-muted font-medium mb-4">Overall Quality Score</div>
          <div className="w-full bg-slate-100 rounded-full h-3 max-w-sm mx-auto overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'TDS',       value: `${tds} ppm`,        safe: tds <= 500,  desc: '≤500 safe' },
          { label: 'pH Level',  value: ph,                  safe: ph >= 6.5 && ph <= 8.5, desc: '6.5–8.5 ideal' },
          { label: 'Hardness',  value: `120 mg/L`,          safe: true, desc: '<200 soft' },
          { label: 'Turbidity', value: `0.5 NTU`,           safe: true, desc: '<1 clear' },
        ].map(m => (
          <div key={m.label} className="card text-center hover:-translate-y-1 transition-transform">
            <div className="text-2xl font-bold text-dark">{m.value}</div>
            <div className="text-sm text-muted mt-1">{m.label}</div>
            <div className={cn('text-xs font-semibold mt-2 inline-flex px-2 py-1 rounded-md', m.safe ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
              {m.safe ? '✓ Good' : '⚠ High'} • {m.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-500" />Recent Quality Reports
        </h3>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Supplier</th><th>TDS</th><th>pH</th><th>Quality Score</th><th>Risk</th><th>Lab</th><th>Date</th></tr></thead>
            <tbody>
              {QUALITY_REPORTS.slice(0, 5).map(r => (
                <tr key={r.id}>
                  <td className="font-medium">{supplier?.name || r.supplierName}</td>
                  <td>{r.tds}</td>
                  <td>{r.ph}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16">
                        <div className={cn('h-1.5 rounded-full', r.qualityScore >= 80 ? 'bg-emerald-500' : r.qualityScore >= 60 ? 'bg-amber-500' : 'bg-red-500')}
                          style={{ width: `${r.qualityScore}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{r.qualityScore}%</span>
                    </div>
                  </td>
                  <td><span className={cn('badge', r.riskLevel === 'low' ? 'badge-success' : r.riskLevel === 'medium' ? 'badge-warning' : 'badge-danger')}>
                    {r.riskLevel}
                  </span></td>
                  <td className="text-xs text-muted">{r.certifiedBy}</td>
                  <td className="text-muted">{formatDate(r.testedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPLIER ANALYTICS ────────────────────────────────────────
export function SupplierAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Order Volume Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="orders" stroke="#10B981" fill="url(#orders)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-dark mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Order Completion Rate', value: '94.2%', color: 'text-emerald-600' },
            { label: 'Avg Delivery Time',     value: '2.8 hrs', color: 'text-primary-600' },
            { label: 'Customer Retention',    value: '68%',   color: 'text-violet-600' },
            { label: 'Revenue Growth MoM',    value: '+12%',  color: 'text-emerald-600' },
          ].map(m => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100 hover:border-slate-200 transition-colors">
              <div className={cn('text-2xl font-bold', m.color)}>{m.value}</div>
              <div className="text-xs text-muted mt-1 font-medium">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SUPPLIER PROFILE MANAGEMENT ──────────────────────────────
export function SupplierProfileManagementPage() {
  const { user } = useAuthStore();
  const [supplier, setSupplier] = useState<Record<string, any> | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) api.suppliers.getOne(user.id).then(setSupplier).catch(() => {});
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-dark">Profile Management</h1>
      {saved && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-success font-semibold flex items-center gap-2">
          <Check className="w-5 h-5" /> Profile updated successfully!
        </div>
      )}
      <div className="card space-y-4 shadow-sm border-t-4 border-t-primary-500">
        <h3 className="font-semibold text-dark text-lg">Business Information</h3>
        {[
          { label: 'Business Name', value: supplier?.name || user?.name || '', type: 'text' },
          { label: 'Email',         value: user?.email || '',        type: 'email'},
          { label: 'Price per KL',  value: supplier?.price || '', type: 'number' },
        ].map(f => (
          <div key={f.label}>
            <label className="label">{f.label}</label>
            <input type={f.type} defaultValue={f.value} className="input bg-slate-50 focus:bg-white" />
          </div>
        ))}
        <button onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }} className="btn-primary w-full mt-2">Save Changes</button>
      </div>
    </div>
  );
}
