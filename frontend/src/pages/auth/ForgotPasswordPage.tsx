// Forgot Password + OTP Verification Pages
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
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
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (code === '123456' || code.length === 6) {
      setVerified(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError('Invalid OTP. Try 123456 for demo.');
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
              <p className="text-muted text-sm mt-2">Redirecting to login…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
