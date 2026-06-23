import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields'); return; }
    const { error: err } = await login(email, password);
    if (err) { setError(err); return; }
    toast.success('Welcome back! Redirecting to dashboard...');
    navigate('/dashboard');
  };

  const fillDemo = (role: string) => {
    setEmail(`${role}@demo.com`);
    setPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-[#E64833] rounded-xl flex items-center justify-center shadow-accent">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold font-display text-[#244855]">Force<span className="text-[#E64833]">1</span></span>
            </Link>
            <h1 className="text-3xl font-bold font-display text-[#244855]">Welcome Back</h1>
            <p className="text-[#90AEAD] mt-2">Sign in to your account to continue</p>
          </div>

          {/* Demo credentials */}
          <div className="mb-6 p-4 bg-[#FBE9D0] rounded-2xl border border-[#E64833]/20">
            <p className="text-xs font-bold text-[#244855] mb-3 uppercase tracking-wider">Demo Credentials — Click to Fill</p>
            <div className="grid grid-cols-3 gap-2">
              {['agent', 'manager', 'admin'].map(role => (
                <button key={role} onClick={() => fillDemo(role)}
                  className="py-2 px-3 bg-white rounded-xl border-2 border-[#244855]/15 hover:border-[#E64833] text-xs font-semibold text-[#244855] transition-all capitalize min-h-[44px]">
                  {role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-[#244855] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#90AEAD]" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#244855] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#90AEAD]" />
                <input type={showPass ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#90AEAD] hover:text-[#244855]">
                  {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 bg-[#244855] hover:bg-[#1a3340] text-[#FBE9D0] rounded-xl font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Social login */}
          <div className="mt-5">
            <div className="relative flex items-center mb-4">
              <div className="flex-1 border-t border-[#90AEAD]/30" />
              <span className="px-3 text-xs text-[#90AEAD]">or continue with</span>
              <div className="flex-1 border-t border-[#90AEAD]/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: 'G', bg: 'bg-[#1f1f1f] border-[#1f1f1f] text-white hover:bg-[#2d2d2d]' },
                { label: 'Facebook', icon: 'f', bg: 'bg-[#1877F2] border-[#1877F2] text-white hover:bg-[#166fe5]' },
              ].map(s => (
                <button key={s.label} onClick={() => toast.info(`${s.label} login coming soon!`)}
                  className={`flex items-center justify-center gap-2 py-3 border rounded-xl text-sm font-semibold ${s.bg} transition-all min-h-[44px]`}>
                  <span className="font-bold">{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-[#90AEAD] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E64833] font-semibold hover:underline">Create one free →</Link>
          </p>
        </div>
      </div>

      {/* Right: visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=1000&fit=crop" alt="Field agent" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#244855]/90 to-[#244855]/60 flex items-center p-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium mb-6">
              Join 50,000+ Field Agents
            </div>
            <h2 className="text-4xl font-bold text-white font-display mb-4 leading-tight">
              Your Field Operations, Managed Smartly
            </h2>
            <p className="text-[#90AEAD] leading-relaxed mb-8">Real-time GPS, smart tasks, and automated attendance — all in one platform.</p>
            <div className="space-y-3">
              {['Real-time GPS tracking', 'Smart task assignment', 'Automated attendance', 'Expense management'].map(f => (
                <div key={f} className="flex items-center gap-3 text-white/90 text-sm">
                  <div className="w-5 h-5 bg-[#E64833] rounded-full flex items-center justify-center flex-shrink-0">✓</div>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
