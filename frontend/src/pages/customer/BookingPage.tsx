// Booking Wizard — Multi-step booking flow
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, cn } from '@/lib/utils';
import { CheckCircle2, Droplets, MapPin, Calendar, CreditCard, Zap, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';

const STEPS = [
  { id: 1, label: 'Supplier & Quantity', icon: Droplets },
  { id: 2, label: 'Schedule',            icon: Calendar  },
  { id: 3, label: 'Address',             icon: MapPin    },
  { id: 4, label: 'Payment',             icon: CreditCard },
];

const QUANTITIES = [1000, 2000, 3000, 5000, 10000];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const preSelected = (location.state as any)?.supplierId;

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    supplierId: preSelected ?? '',
    quantity: 2000,
    date: '2026-06-05',
    time: '09:00',
    isEmergency: false,
    address: {
      street: '42 Andheri West Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
    },
    paymentMethod: 'UPI',
    upiId: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    api.suppliers.getAll().then(data => {
      setSuppliers(data || []);
      if (!form.supplierId && data && data.length > 0) {
        setForm(f => ({ ...f, supplierId: data[0].id }));
      }
    });
  }, []);

  const supplier = suppliers.find(s => s.id === form.supplierId) || suppliers[0];
  const baseAmount = supplier ? (form.quantity / 1000) * supplier.price : 0;
  const emergencySurcharge = form.isEmergency ? Math.round(baseAmount * 0.2) : 0;
  const total = baseAmount + emergencySurcharge;

  const handlePayment = async () => {
    if (!user || !supplier) return;
    setPaymentLoading(true);
    try {
      await api.orders.create({
        customer_id: user.id,
        supplier_id: supplier.id,
        quantity: form.quantity,
        amount: total,
        delivery_date: new Date(`${form.date}T${form.time}`).toISOString(),
        eta: form.isEmergency ? '2 hours' : supplier.eta,
        status: 'pending'
      });
      setPaymentSuccess(true);
    } catch (err) {
      console.error("Order creation failed", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-success animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Order Confirmed! 🎉</h2>
        <p className="text-muted mb-1">Your water delivery has been booked successfully.</p>
        <p className="text-muted mb-6">Order ID: <span className="font-mono font-semibold text-dark">#ORD-682914</span></p>
        <div className="card mb-6 text-left">
          <div className="space-y-2 text-sm">
            {[
              { label: 'Supplier',  value: supplier?.name     },
              { label: 'Quantity',  value: `${form.quantity.toLocaleString()}L` },
              { label: 'Date',      value: `${form.date} at ${form.time}` },
              { label: 'Amount',    value: formatCurrency(total)      },
              { label: 'Payment',   value: form.paymentMethod         },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-muted">{row.label}</span>
                <span className="font-semibold text-dark">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/customer/track')} className="btn-primary">Track Order</button>
          <button onClick={() => navigate('/customer')} className="btn-secondary">Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark">Book Water Delivery</h1>
        <p className="text-muted mt-1">Complete the booking in a few simple steps</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all flex-shrink-0',
              step > s.id ? 'bg-success text-white' :
              step === s.id ? 'gradient-primary-bg text-white' :
              'bg-slate-100 text-muted'
            )}>
              {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
            </div>
            <div className={cn('flex-1 h-0.5 ml-2', i === STEPS.length - 1 ? 'hidden' : step > s.id ? 'bg-success' : 'bg-slate-200')} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted -mt-3">
        {STEPS.map(s => <span key={s.id} className={cn(step === s.id && 'text-primary-600 font-semibold')}>{s.label}</span>)}
      </div>

      <div className="card">
        {/* Step 1 — Supplier + Quantity */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="label">Select Supplier</label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {suppliers.slice(0, 8).map(s => (
                  <label key={s.id} className={cn(
                    'flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all',
                    form.supplierId === s.id ? 'border-primary-500 bg-primary-50' : 'border-border hover:border-primary-200'
                  )}>
                    <input type="radio" name="supplier" value={s.id}
                      checked={form.supplierId === s.id}
                      onChange={() => setForm(f => ({ ...f, supplierId: s.id }))}
                      className="accent-primary-500" />
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-dark truncate">{s.name}</div>
                      <div className="text-xs text-muted">TDS: {s.tds || 50} • pH: {s.ph || 7.2}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-primary-600 text-sm">{formatCurrency(s.price)}/KL</div>
                      <div className="text-xs text-muted">{s.eta}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Select Quantity</label>
              <div className="grid grid-cols-5 gap-2">
                {QUANTITIES.map(q => (
                  <button key={q} type="button"
                    onClick={() => setForm(f => ({ ...f, quantity: q }))}
                    className={cn('border-2 rounded-xl p-3 text-center font-semibold text-sm transition-all',
                      form.quantity === q ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border hover:border-primary-200'
                    )}>
                    {q >= 1000 ? `${q/1000}KL` : `${q}L`}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency toggle */}
            <div className={cn('flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer',
              form.isEmergency ? 'border-red-400 bg-red-50' : 'border-border'
            )} onClick={() => setForm(f => ({ ...f, isEmergency: !f.isEmergency }))}>
              <div className="flex items-center gap-3">
                <Zap className={cn('w-5 h-5', form.isEmergency ? 'text-red-500' : 'text-muted')} />
                <div>
                  <div className="font-semibold text-sm text-dark">Emergency Booking</div>
                  <div className="text-xs text-muted">Priority delivery within 2 hours (+20% surcharge)</div>
                </div>
              </div>
              <div className={cn('w-10 h-6 rounded-full transition-all',
                form.isEmergency ? 'bg-red-500' : 'bg-slate-200'
              )}>
                <div className={cn('w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5',
                  form.isEmergency ? 'translate-x-4.5 ml-0.5' : 'ml-0.5'
                )} />
              </div>
            </div>

            {/* Price preview */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Water ({form.quantity}L)</span><span>{formatCurrency(baseAmount)}</span></div>
              {form.isEmergency && <div className="flex justify-between text-red-600"><span>Emergency Surcharge (20%)</span><span>+{formatCurrency(emergencySurcharge)}</span></div>}
              <div className="flex justify-between font-bold text-dark border-t border-border pt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
          </div>
        )}

        {/* Step 2 — Schedule */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="label">Delivery Date</label>
              <input type="date" value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="input" />
            </div>
            <div>
              <label className="label">Preferred Time Slot</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map(t => (
                  <button key={t} type="button"
                    onClick={() => setForm(f => ({ ...f, time: t }))}
                    className={cn('border-2 rounded-xl p-2.5 text-sm font-medium transition-all',
                      form.time === t ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border hover:border-primary-200'
                    )}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Address */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="label">Street Address</label>
              <input type="text" value={form.address.street}
                onChange={e => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))}
                placeholder="Street, Area, Landmark" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input type="text" value={form.address.city}
                  onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))}
                  className="input" />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input type="text" value={form.address.pincode}
                  onChange={e => setForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))}
                  className="input" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Payment */}
        {step === 4 && (
          <div className="space-y-5">
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-sky-50 rounded-xl p-4 space-y-2 text-sm">
              <h4 className="font-semibold text-dark mb-3">Order Summary</h4>
              {[
                { label: 'Supplier',  value: supplier?.name     },
                { label: 'Quantity',  value: `${form.quantity.toLocaleString()}L` },
                { label: 'Date',      value: `${form.date} at ${form.time}` },
                { label: 'Address',   value: `${form.address.street}, ${form.address.city}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-muted">{row.label}</span>
                  <span className="font-medium text-dark">{row.value}</span>
                </div>
              ))}
              <div className="border-t border-primary-200 pt-2 flex justify-between font-bold text-dark">
                <span>Total Amount</span>
                <span className="text-primary-600 text-lg">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="label">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {['UPI','Card','Netbanking','Wallet'].map(m => (
                  <button key={m} type="button"
                    onClick={() => setForm(f => ({ ...f, paymentMethod: m }))}
                    className={cn('border-2 rounded-xl p-3 text-sm font-medium transition-all',
                      form.paymentMethod === m ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border hover:border-primary-200'
                    )}>
                    {m === 'UPI' ? '📱 UPI' : m === 'Card' ? '💳 Card' : m === 'Netbanking' ? '🏦 Netbanking' : '👛 Wallet'}
                  </button>
                ))}
              </div>
            </div>

            {form.paymentMethod === 'UPI' && (
              <div>
                <label className="label">UPI ID</label>
                <input type="text" placeholder="yourname@upi"
                  value={form.upiId}
                  onChange={e => setForm(f => ({ ...f, upiId: e.target.value }))}
                  className="input" />
              </div>
            )}

            <button onClick={handlePayment} disabled={paymentLoading}
              className="btn-primary btn-lg w-full">
              {paymentLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Processing Payment…</>
              ) : (
                <>Pay {formatCurrency(total)} <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {step < 4 && (
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1">
            {step === 3 ? 'Review & Pay' : 'Continue'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
