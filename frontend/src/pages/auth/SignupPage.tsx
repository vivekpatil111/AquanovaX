// Signup Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Droplets, Eye, EyeOff, ArrowRight, Check, ShieldCheck, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Water3DSidebar } from '@/components/effects/Water3DSidebar';
import { WaterFooter } from '@/components/common/WaterFooter';
import type { Role } from '@/types';

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: 'customer', label: '💧 Customer',  desc: 'Order water for home or business' },
  { value: 'supplier', label: '🏭 Supplier',  desc: 'Supply water to customers'        },
  { value: 'driver',   label: '🚛 Driver',    desc: 'Deliver water tankers'             },
  { value: 'admin',    label: '🛡️ Admin',     desc: 'Manage the platform'               },
];

export function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' as Role });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const ROLE_REDIRECT: Record<Role, string> = {
    customer: '/customer', supplier: '/supplier', driver: '/driver', admin: '/admin',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const result = await signup(form);
    if (result.success) {
      navigate(ROLE_REDIRECT[form.role]);
    } else {
      setError(result.error ?? 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs for the whole page */}
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-300/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col lg:flex-row w-full z-10 relative">
        {/* Left panel — 3D Water Effect Sidebar */}
      <Water3DSidebar />

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10 relative overflow-y-auto">
        <div className="w-full max-w-[500px] animate-slide-up my-auto">
          {/* Glassmorphism card container */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 sm:p-10 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-sky-300" />

            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center mb-6">
              <div className="w-14 h-14 gradient-primary-bg rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div className="font-extrabold text-2xl text-dark tracking-tight">AquanovaX</div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Create your account</h1>
              <p className="text-slate-500">Join the smart water platform in seconds</p>
            </div>

            {/* Role selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    className={cn(
                      'border-2 rounded-2xl p-4 text-center transition-all cursor-pointer relative overflow-hidden',
                      form.role === r.value
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm shadow-primary-500/10'
                        : 'border-slate-200 hover:border-primary-200 hover:bg-slate-50'
                    )}
                  >
                    <div className="text-xl mb-1.5">{r.label.split(' ')[0]}</div>
                    <div className="text-sm font-bold text-dark">{r.label.split(' ')[1]}</div>
                    <div className="text-[11px] text-slate-500 mt-1 hidden sm:block leading-tight">{r.desc}</div>
                    {form.role === r.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center animate-fade-in">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Priya Sharma"
                    className="w-full bg-slate-50 border border-slate-200 text-dark text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 text-dark text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-200 text-dark text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="w-full bg-slate-50 border border-slate-200 text-dark text-sm rounded-xl pl-4 pr-12 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm flex items-start gap-2 animate-fade-in">
                  <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">!</span>
                  <p className="pt-0.5 font-medium">{error}</p>
                </div>
              )}

              <button type="submit" disabled={isLoading} 
                className="w-full bg-dark hover:bg-slate-800 text-white font-semibold rounded-xl px-4 py-3.5 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-8 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 underline underline-offset-4 decoration-primary-600/30 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      
      </div>
      
      {/* Footer spans full width below the split pane on mobile, or just standard flow */}
      <div className="w-full relative z-20 col-span-full shrink-0">
        <WaterFooter />
      </div>
    </div>
  );
}
