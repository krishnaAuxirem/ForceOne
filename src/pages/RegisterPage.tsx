import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'agent' as UserRole });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const { error } = await register(form.name, form.email, form.password, form.role);
    if (error) { setErrors({ submit: error }); return; }
    toast.success('Account created successfully! Welcome to Force1!');
    navigate('/dashboard');
  };

  const ROLES = [
    { value: 'agent', label: 'Field Agent', desc: 'Track tasks & attendance' },
    { value: 'manager', label: 'Manager', desc: 'Manage teams & reports' },
    { value: 'admin', label: 'Admin', desc: 'Full system control' },
  ];

  return (
    <div className="min-h-screen flex pt-16">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-[#E64833] rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold font-display text-[#244855]">Force<span className="text-[#E64833]">1</span></span>
            </Link>
            <h1 className="text-3xl font-bold font-display text-[#244855]">Create Account</h1>
            <p className="text-[#90AEAD] mt-2">Start your 14-day free trial — no credit card required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{errors.submit}
              </div>
            )}

            {/* Role selector */}
            <div>
              <label className="block text-sm font-semibold text-[#244855] mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => (
                  <button key={role.value} type="button" onClick={() => setForm(f => ({ ...f, role: role.value as UserRole }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all min-h-[60px] ${form.role === role.value ? 'border-[#E64833] bg-[#E64833]/5' : 'border-[#90AEAD]/30 hover:border-[#244855]/40'}`}>
                    <p className={`text-xs font-bold ${form.role === role.value ? 'text-[#E64833]' : 'text-[#244855]'}`}>{role.label}</p>
                    <p className="text-[10px] text-[#90AEAD] mt-0.5 leading-tight">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma', icon: User },
              { field: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com', icon: Mail },
            ].map(({ field, label, type, placeholder, icon: Icon }) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-[#244855] mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#90AEAD]" />
                  <input type={type} className={`input-field pl-10 ${errors[field] ? 'border-red-400' : ''}`} placeholder={placeholder}
                    value={form[field as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
                </div>
                {errors[field] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-[#244855] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#90AEAD]" />
                <input type={showPass ? 'text' : 'password'} className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`} placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#90AEAD]">
                  {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#244855] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#90AEAD]" />
                <input type="password" className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`} placeholder="Repeat password"
                  value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-base transition-all disabled:opacity-60 shadow-accent min-h-[48px]">
              {isLoading ? 'Creating account...' : 'Create Free Account'}
            </button>

            <p className="text-xs text-center text-[#90AEAD]">
              By registering, you agree to our{' '}
              <Link to="/terms" className="text-[#244855] hover:underline">Terms</Link> &{' '}
              <Link to="/privacy" className="text-[#244855] hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="text-center text-sm text-[#90AEAD] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E64833] font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1000&fit=crop" alt="Team" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#244855]/80 flex items-center p-16">
          <div>
            <h2 className="text-4xl font-bold text-white font-display mb-4">Join 500+ Enterprises Already on Force1</h2>
            <p className="text-[#90AEAD] mb-8">Set up in minutes. Track your field team from day one.</p>
            <div className="space-y-4">
              {['14-day free trial, no credit card needed', 'Set up team in under 10 minutes', 'Dedicated onboarding support', 'Cancel anytime, no lock-in'].map(f => (
                <div key={f} className="flex items-center gap-3 text-white/90 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
