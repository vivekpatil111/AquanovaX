// Login Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Droplets, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

const DEMO_ROLES: { role: Role; label: string; email: string; color: string; bg: string }[] = [
  { role: 'customer', label: 'Customer',  email: 'customer@demo.com', color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-200'   },
  { role: 'supplier', label: 'Supplier',  email: 'supplier@demo.com', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { role: 'driver',   label: 'Driver',    email: 'driver@demo.com',   color: 'text-amber-700',   bg: 'bg-amber-50   border-amber-200'   },
  { role: 'admin',    label: 'Admin',     email: 'admin@demo.com',    color: 'text-purple-700',  bg: 'bg-purple-50  border-purple-200'  },
];

const ROLE_REDIRECT: Record<Role, string> = {
  customer: '/customer',
  supplier: '/supplier',
  driver:   '/driver',
  admin:    '/admin',
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, quickLogin, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      const user = useAuthStore.getState().user;
      navigate(ROLE_REDIRECT[user!.role]);
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  const handleQuickLogin = (role: Role) => {
    quickLogin(role);
    navigate(ROLE_REDIRECT[role]);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 gradient-hero-bg p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl">AquanovaX</div>
            <div className="text-sky-200 text-sm">Water Intelligence Platform</div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            AI-Powered Water<br />Marketplace &<br />Logistics Intelligence
          </h2>
          <p className="text-sky-200 text-lg max-w-sm">
            Connect customers, suppliers, and drivers in real-time with intelligent dispatch and quality monitoring.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '50+', label: 'Suppliers' },
            { value: '500+', label: 'Orders / Day' },
            { value: '98%', label: 'Quality Score' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sky-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 gradient-primary-bg rounded-xl flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-dark">AquanovaX</div>
              <div className="text-muted text-sm">Water Intelligence Platform</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-dark mb-1">Welcome back</h1>
          <p className="text-muted mb-8">Sign in to your AquanovaX account</p>

          {/* Quick login */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold text-dark">Quick Demo Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ROLES.map(r => (
                <button
                  key={r.role}
                  onClick={() => handleQuickLogin(r.role)}
                  className={cn('border rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:shadow-sm active:scale-95 text-left', r.bg, r.color)}
                >
                  <div className="font-semibold">{r.label}</div>
                  <div className="text-xs opacity-70 truncate">{r.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="divider" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted">
              or sign in manually
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={cn('input', error && 'input-error')}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn('input pr-10', error && 'input-error')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-danger flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-danger/10 flex items-center justify-center text-xs">!</span>
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-primary-500" />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary btn-lg w-full"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
