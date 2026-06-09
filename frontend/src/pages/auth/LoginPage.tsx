// Login Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Droplets, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Water3DSidebar } from '@/components/effects/Water3DSidebar';
import { WaterFooter } from '@/components/common/WaterFooter';
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
    console.log(`Logging in with ${provider}`);
    alert(`${provider} Login is simulated for demo.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs for the whole page */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-sky-300/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col lg:flex-row w-full z-10 relative">
        {/* Left panel — 3D Water Effect Sidebar */}
      <Water3DSidebar />

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <div className="w-full max-w-[440px] animate-slide-up">
          {/* Glassmorphism card container */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 sm:p-10 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-sky-300" />

            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="w-14 h-14 gradient-primary-bg rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div className="font-extrabold text-2xl text-dark tracking-tight">AquanovaX</div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Welcome back</h1>
              <p className="text-slate-500">Enter your credentials to securely access your portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={cn(
                    'w-full bg-slate-50 border border-slate-200 text-dark text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10',
                    error && 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
                  )}
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-bold transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      'w-full bg-slate-50 border border-slate-200 text-dark text-sm rounded-xl pl-4 pr-12 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10',
                      error && 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-dark hover:bg-slate-800 text-white font-semibold rounded-xl px-4 py-3.5 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign in to Portal <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-semibold uppercase tracking-wider text-xs">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
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
                className="flex items-center justify-center gap-2 bg-[#0F172A] border border-[#0F172A] rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1E293B] transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700 underline underline-offset-4 decoration-primary-600/30 transition-colors">
              Sign up today
            </Link>
          </p>
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
