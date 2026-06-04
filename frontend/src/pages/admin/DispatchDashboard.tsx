import React, { useState } from 'react';
import { Truck, Map, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { ORDERS } from '@/data/orders';
import { DRIVERS } from '@/data/drivers';
import { getTankersBySupplier } from '@/data/tankers';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { StatusBadge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';

export function DispatchDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'dispatched'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedTanker, setSelectedTanker] = useState<string>('');
  
  const pendingOrders = ORDERS.filter(o => o.status === 'confirmed');
  const dispatchedOrders = ORDERS.filter(o => ['dispatched', 'en_route'].includes(o.status));

  const displayOrders = activeTab === 'pending' ? pendingOrders : dispatchedOrders;

  const currentOrder = ORDERS.find(o => o.id === selectedOrder);
  const availableDrivers = DRIVERS.filter(d => d.supplierId === currentOrder?.supplierId && d.isAvailable);
  const availableTankers = getTankersBySupplier(currentOrder?.supplierId || '').filter(t => t.status === 'available');

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver || !selectedTanker) return;
    
    // Mock dispatch action
    alert(`Order ${selectedOrder} dispatched successfully to driver ${selectedDriver}`);
    setSelectedOrder(null);
    setSelectedDriver('');
    setSelectedTanker('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
          <Map className="w-8 h-8 text-primary-600" /> AquaTrack Dispatch
        </h1>
        <p className="text-muted mt-1">Assign drivers and tankers to confirmed orders.</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
        <button onClick={() => setActiveTab('pending')}
          className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
            activeTab === 'pending' ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark')}>
          Pending Dispatch ({pendingOrders.length})
        </button>
        <button onClick={() => setActiveTab('dispatched')}
          className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
            activeTab === 'dispatched' ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark')}>
          Active Fleet ({dispatchedOrders.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {displayOrders.map(o => (
            <div key={o.id} className={cn("card cursor-pointer transition-all border-2", selectedOrder === o.id ? "border-primary-500 shadow-md" : "border-transparent hover:border-slate-200")} onClick={() => setSelectedOrder(o.id)}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                    {o.quantity >= 10000 ? 'L' : o.quantity >= 5000 ? 'M' : 'S'}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark">{o.customerName}</h3>
                    <div className="text-sm text-muted mb-2">Order {o.id.substring(0,8)} • {formatDate(o.createdAt)}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-md">{o.quantity.toLocaleString()}L</span>
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-md">{o.supplierName}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={o.status} />
                  <div className="font-bold text-lg mt-2">{formatCurrency(o.amount)}</div>
                </div>
              </div>
            </div>
          ))}
          {displayOrders.length === 0 && (
            <div className="text-center py-12 card border-dashed">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-muted font-medium">No orders in this status.</p>
            </div>
          )}
        </div>

        {/* Dispatch Panel */}
        <div className="lg:col-span-1">
          {selectedOrder && currentOrder ? (
            <div className="card sticky top-6">
              <h3 className="font-bold text-dark text-lg mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary-500" /> Assign & Dispatch
              </h3>
              
              <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted">Order ID</span>
                  <span className="font-mono font-medium">{currentOrder.id.substring(0,8)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted">Supplier</span>
                  <span className="font-medium">{currentOrder.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Quantity Required</span>
                  <span className="font-bold text-primary-600">{currentOrder.quantity.toLocaleString()}L</span>
                </div>
              </div>

              {activeTab === 'pending' ? (
                <form onSubmit={handleDispatch} className="space-y-4">
                  <div>
                    <label className="label">Select Driver</label>
                    <select required className="input" value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)}>
                      <option value="">-- Choose available driver --</option>
                      {availableDrivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.rating}★)</option>
                      ))}
                    </select>
                    {availableDrivers.length === 0 && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> No drivers available for this supplier</p>}
                  </div>
                  <div>
                    <label className="label">Select Tanker</label>
                    <select required className="input" value={selectedTanker} onChange={e => setSelectedTanker(e.target.value)}>
                      <option value="">-- Choose available tanker --</option>
                      {availableTankers.map(t => (
                        <option key={t.id} value={t.id}>{t.registrationNumber || (t as any).registration_number} - {t.capacity.toLocaleString()}L</option>
                      ))}
                    </select>
                    {availableTankers.length === 0 && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> No tankers available for this supplier</p>}
                  </div>
                  
                  <button type="submit" className="btn-primary w-full mt-4" disabled={!selectedDriver || !selectedTanker}>
                    Confirm Dispatch <Navigation className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-dark">Order Dispatched</p>
                  <p className="text-sm text-muted mt-1">Driver is currently en route.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-12 sticky top-6 bg-slate-50 border-dashed">
              <p className="text-muted">Select an order to dispatch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
