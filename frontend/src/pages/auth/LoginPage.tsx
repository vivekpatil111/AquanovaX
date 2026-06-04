// Login Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Droplets, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

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
  const { login, isLoading } = useAuthStore();
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

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    console.log(`Logging in with ${provider}`);
    alert(`${provider} Login is simulated for demo.`);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — Sleek Dark Mode Redesign */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 gradient-dark-bg p-12 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <Droplets className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <div className="font-bold text-xl tracking-tight">AquanovaX</div>
            <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mt-0.5">Water Intelligence</div>
          </div>
        </div>

        <div className="relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            System Status: Optimal
          </div>
          <h2 className="text-5xl font-bold leading-[1.15] mb-6 tracking-tight text-white">
            Next-Gen Water <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-sky-200">Logistics Platform</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Unifying suppliers, drivers, and consumers through AI-driven routing, live tracking, and automated dispatch.
          </p>
        </div>

        {/* Stats Glass Panel */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '99.9%', label: 'Uptime' },
            { value: '< 2h', label: 'Avg Delivery' },
            { value: '100k+', label: 'Liters/Day' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 gradient-primary-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-2xl text-dark tracking-tight">AquanovaX</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark mb-2 tracking-tight">Welcome back</h1>
            <p className="text-muted">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={cn('input', error && 'input-error')}
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm flex items-start gap-2 animate-fade-in">
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold shrink-0">!</span>
                <p className="pt-0.5">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary btn-lg w-full mt-2 shadow-lg shadow-primary-500/25"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in to Dashboard <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              className="flex items-center justify-center gap-2 bg-dark border border-dark rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-muted mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 underline underline-offset-4 decoration-primary-600/30">
              Sign up today
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
