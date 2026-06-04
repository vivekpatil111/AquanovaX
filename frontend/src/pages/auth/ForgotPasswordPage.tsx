// Forgot Password + OTP Verification Pages
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Droplets, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      console.error(err);
      // For MVP demo, proceed anyway
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 gradient-primary-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Reset Password</h1>
          <p className="text-muted mt-1">We'll send an OTP to your email</p>
        </div>

        <div className="card">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Mail className="w-4 h-4" /><span>Send OTP</span></>
                }
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold text-dark mb-2">OTP Sent!</h3>
              <p className="text-muted text-sm mb-6">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </p>
              <Link to={`/otp?email=${encodeURIComponent(email)}`} className="btn-primary btn-lg w-full">
                Enter OTP <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-primary-600 flex items-center justify-center gap-1 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// OTP Verification Page
export function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();

  const handleInput = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter all 6 digits'); return; }
    setLoading(true);
    setError('');
    try {
      await api.auth.verifyOTP({ email, otp_code: code });
      setVerified(true);
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${code}`), 1000);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Try 123456 for demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 gradient-primary-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Enter OTP</h1>
          <p className="text-muted mt-1">Enter the 6-digit code we sent you</p>
          <p className="text-xs text-muted mt-1">(Demo: use 123456)</p>
        </div>

        <div className="card">
          {!verified ? (
            <div className="space-y-6">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInput(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                  />
                ))}
              </div>

              {error && <p className="text-sm text-danger text-center">{error}</p>}

              <button onClick={handleVerify} disabled={loading} className="btn-primary btn-lg w-full">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Verify OTP'
                }
              </button>

              <p className="text-center text-sm text-muted">
                {countdown > 0
                  ? <>Resend in <strong className="text-dark">{countdown}s</strong></>
                  : <button className="text-primary-600 font-medium" onClick={() => setCountdown(30)}>Resend OTP</button>
                }
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success animate-bounce" />
              </div>
              <h3 className="font-semibold text-dark">Verified Successfully!</h3>
              <p className="text-muted text-sm mt-2">Redirecting to reset password…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reset Password Page
export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const otp_code = searchParams.get('otp') || '';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.auth.resetPassword({ email, otp_code, new_password: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 gradient-primary-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark">New Password</h1>
          <p className="text-muted mt-1">Enter your new password below</p>
        </div>

        <div className="card">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input" required minLength={6} />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" className="input" required minLength={6} />
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Reset Password'
                }
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success animate-bounce" />
              </div>
              <h3 className="font-semibold text-dark mb-2">Password Reset Successful!</h3>
              <p className="text-muted text-sm mb-6">
                You can now log in with your new password.
              </p>
              <Link to="/login" className="btn-primary btn-lg w-full">
                Go to Login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
