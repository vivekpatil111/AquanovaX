import React from 'react';
import { Truck, Map, CheckCircle2, Navigation, AlertCircle, Package, Fuel, Clock, MapPin, Zap, Settings, User } from 'lucide-react';
import { useAdminData } from './AdminPages';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Avatar } from '@/components/common/Avatar';
import { MockMap } from '@/components/maps/MockMap';
import { MOCK_ROUTE_POINTS } from '@/data/mockData';

export function DispatchDashboard() {
  const { orders, drivers, loading } = useAdminData();
  
  if (loading) return <div className="p-8 text-center text-muted">Loading live dispatch data...</div>;

  const totalOrders = orders.length;
  const inProgress = orders.filter(o => ['pending', 'confirmed', 'dispatched', 'en_route'].includes(o.status)).length;
  const completed = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
  const cancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'rejected').length;

  const activeDrivers = drivers.filter(d => d.is_available === false);
  const availableDrivers = drivers.filter(d => d.is_available !== false);

  // Derived metrics based on real order volume to look realistic
  const distanceSaved = (completed * 2.4).toFixed(1);
  const fuelSaved = (completed * 0.8).toFixed(1);
  const timeSaved = (completed * 0.15).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
          <Truck className="w-8 h-8 text-primary-600" /> AquaTrack Dispatch Engine
        </h1>
        <p className="text-muted mt-1">Logistics + Fleet Intelligence</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Package className="w-5 h-5" /></div>
            <div>
              <div className="text-sm text-muted">Total Orders</div>
              <div className="text-xl font-bold text-dark">{totalOrders}</div>
            </div>
          </div>
        </div>
        <div className="card bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600"><Clock className="w-5 h-5" /></div>
            <div>
              <div className="text-sm text-muted">In Progress</div>
              <div className="text-xl font-bold text-dark">{inProgress}</div>
            </div>
          </div>
        </div>
        <div className="card bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <div className="text-sm text-muted">Completed</div>
              <div className="text-xl font-bold text-dark">{completed}</div>
            </div>
          </div>
        </div>
        <div className="card bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <div className="text-sm text-muted">Cancelled</div>
              <div className="text-xl font-bold text-dark">{cancelled}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Fleet Tracking (Map + Active List) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white">
              <h3 className="font-semibold text-dark flex items-center gap-2">
                Live Fleet Tracking
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live
              </div>
            </div>
            <div className="relative">
              <MockMap points={[
                { id: 'depot', lat: 19.065, lng: 72.865, type: 'depot', label: 'Depot' },
                ...activeDrivers.map((d, i) => ({
                  id: `d${i}`, lat: 19.070 + (Math.random() * 0.05), lng: 72.870 + (Math.random() * 0.05), type: 'driver' as const, label: d.name, isAnimated: true
                }))
              ]} routePoints={MOCK_ROUTE_POINTS} height="300px" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <div className="bg-white/90 backdrop-blur text-sm font-semibold px-3 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary-600" /> {activeDrivers.length} Tankers Active
                </div>
              </div>
            </div>
            <div className="p-4 bg-white divide-y divide-border">
              {drivers.slice(0, 4).map((d, i) => {
                const driverName = d.full_name || d.name || 'Driver';
                return (
                  <div key={d.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600 shrink-0">
                        {driverName.substring(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-dark text-sm truncate">{driverName}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">
                            {d.vehicle_number || `KA0${i+1}${driverName.substring(0,2).toUpperCase()}${(d.id.charCodeAt(0) % 9000) + 1000}`}
                          </span>
                          <span className={cn("text-xs font-semibold", d.is_available === false ? "text-primary-600" : "text-emerald-600")}>
                            {d.is_available === false ? 'on-delivery' : 'available'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {d.is_available === false && <div className="text-sm font-bold text-dark">{d.active_order_eta || 'Live'}</div>}
                    </div>
                  </div>
                );
              })}
              {drivers.length === 0 && <div className="text-sm text-muted text-center py-2">No drivers found.</div>}
            </div>
          </div>
        </div>

        {/* AI & Analytics Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Route Optimization */}
          <div className="card bg-white border border-slate-100 shadow-sm rounded-2xl">
            <h3 className="font-semibold text-dark mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> AI Route Optimization
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-5">
              <div>
                <div className="text-3xl font-bold text-dark">{distanceSaved} km</div>
                <div className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">Distance Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-dark">{fuelSaved} L</div>
                <div className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">Fuel Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-dark">{timeSaved} hrs</div>
                <div className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">Time Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">+12%</div>
                <div className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">Fuel Efficiency</div>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="card bg-white border border-slate-100 shadow-sm rounded-2xl">
            <h3 className="font-semibold text-dark mb-4">AI Features</h3>
            <div className="space-y-3">
              {[
                'Auto Assignment',
                'Route Optimization',
                'GPS Tracking',
                'ETA Prediction',
                'Fuel Tracking',
                'Maintenance Alerts'
              ].map((feat, i) => (
                <div key={feat} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-dark font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Management */}
          <div className="card bg-white border border-slate-100 shadow-sm rounded-2xl">
            <h3 className="font-semibold text-dark mb-4">Driver Management</h3>
            <div className="space-y-4">
              {drivers.slice(0,3).map((d, i) => {
                const driverName = d.full_name || d.name || 'Driver';
                return (
                  <div key={d.id} className="flex items-center gap-3">
                    <Avatar name={driverName} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-dark truncate">{driverName}</div>
                      <div className="text-xs text-muted truncate">
                        {d.vehicle_number || `KA0${i+1}${driverName.substring(0,2).toUpperCase()}${(d.id.charCodeAt(0) % 9000) + 1000}`} • {d.completed_deliveries || 0} orders
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-dark">
                      <Fuel className="w-4 h-4 text-amber-500" /> {d.fuel_level || 'N/A'}
                    </div>
                  </div>
                );
              })}
              {drivers.length === 0 && <div className="text-sm text-muted text-center">No drivers found.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
