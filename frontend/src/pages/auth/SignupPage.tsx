// Signup Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Droplets, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: 'customer', label: '💧 Customer',  desc: 'Order water for home or business' },
  { value: 'supplier', label: '🏭 Supplier',  desc: 'Supply water to customers'        },
  { value: 'driver',   label: '🚛 Driver',    desc: 'Deliver water tankers'             },
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 gradient-primary-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Create your account</h1>
          <p className="text-muted mt-1">Join AquanovaX — the smart water platform</p>
        </div>

        <div className="card">
          {/* Role selection */}
          <div className="mb-6">
            <label className="label">I am a…</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}
                  className={cn(
                    'border-2 rounded-xl p-3 text-center transition-all cursor-pointer',
                    form.role === r.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-border hover:border-primary-200 hover:bg-slate-50'
                  )}
                >
                  <div className="text-lg mb-1">{r.label.split(' ')[0]}</div>
                  <div className="text-xs font-semibold text-dark">{r.label.split(' ')[1]}</div>
                  <div className="text-xs text-muted mt-0.5 hidden sm:block">{r.desc}</div>
                  {form.role === r.value && (
                    <Check className="w-4 h-4 text-primary-500 mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Priya Sharma"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="input pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button type="submit" disabled={isLoading} className="btn-primary btn-lg w-full">
              {isLoading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
