import { useState, useEffect } from 'react';
import { ShieldAlert, Key, UserCheck, Smartphone, Check, Lock, ShieldCheck } from 'lucide-react';

const ROLE_PERMISSIONS = {
  admin: {
    label: 'Dispatch Administrator',
    description: 'Full override capabilities. Manages system configurations, regions, and billing logs.',
    perms: { tracking: true, expenses: true, shifts: true, logs: true, provision: true },
  },
  supervisor: {
    label: 'Regional Supervisor',
    description: 'Oversees specific territory rosters, reviews audit files, and approves fuel tickets.',
    perms: { tracking: true, expenses: true, shifts: true, logs: false, provision: false },
  },
  agent: {
    label: 'Field Representative',
    description: 'Accesses assigned checklist forms, submits logs, and views geofence parameters.',
    perms: { tracking: false, expenses: false, shifts: false, logs: false, provision: false },
  },
};

export default function SecuritySection() {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'supervisor' | 'agent'>('admin');
  const [otpRequest, setOtpRequest] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCounter, setOtpCounter] = useState(30);

  const handleRequestOtp = () => {
    setOtpRequest(true);
    setOtpValue('');
    setOtpVerified(false);
    setOtpCounter(30);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpRequest && otpCounter > 0) {
      timer = setInterval(() => {
        setOtpCounter((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpRequest, otpCounter]);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue === '4920') {
      setOtpVerified(true);
      setOtpRequest(false);
    } else {
      alert('Invalid code! Use simulated code "4920" to test.');
    }
  };

  return (
    <section className="py-24 bg-[#FBE9D0]/20 dark:bg-[#152c35]/50 border-t border-[#90AEAD]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <Lock className="w-4 h-4" /> Security & Identity
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Bank-Grade Security Architecture
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Ensure compliance with SOC 2 policies. Control resource authorization using dynamic Role-Based Access Control and secure 2FA/OTP login screens.
          </p>
        </div>

        {/* Section Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* RBAC Role Permission Matrix - Left (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-[#244855] dark:text-white text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#874F41]" /> Role-Based Access Matrix
                </h4>
                <span className="text-[10px] text-[#90AEAD] uppercase font-bold">RBAC Configurator</span>
              </div>
              <p className="text-xs text-[#90AEAD] mb-6">
                Click a role tab to view active permissions and authorization scopes in the system.
              </p>

              {/* Roles tab buttons */}
              <div className="flex gap-2.5 mb-6">
                {(Object.keys(ROLE_PERMISSIONS) as Array<keyof typeof ROLE_PERMISSIONS>).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                      selectedRole === roleKey
                        ? 'bg-[#244855] text-white'
                        : 'bg-slate-50 dark:bg-slate-900 text-[#90AEAD] hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {ROLE_PERMISSIONS[roleKey].label.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Role Detail Description */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-[#90AEAD]/10 rounded-2xl mb-6">
                <h5 className="font-bold text-xs text-[#244855] dark:text-white uppercase tracking-wider mb-1">
                  Scope: {ROLE_PERMISSIONS[selectedRole].label}
                </h5>
                <p className="text-[11px] text-[#90AEAD] leading-relaxed">{ROLE_PERMISSIONS[selectedRole].description}</p>
              </div>

              {/* Permission toggles matrix */}
              <div className="space-y-3.5">
                {[
                  { key: 'tracking', label: 'View Real-time Tracking' },
                  { key: 'expenses', label: 'Approve Payout Claims' },
                  { key: 'shifts', label: 'Modify Rosters & Shifts' },
                  { key: 'logs', label: 'Access Audit System Logs' },
                  { key: 'provision', label: 'Provision/Decommission Agents' },
                ].map((perm) => {
                  const allowed = ROLE_PERMISSIONS[selectedRole].perms[perm.key as keyof typeof ROLE_PERMISSIONS['admin']['perms']];
                  return (
                    <div
                      key={perm.key}
                      className="p-3 bg-white dark:bg-slate-900 border border-[#90AEAD]/10 rounded-2xl flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{perm.label}</span>
                      <span
                        className={`text-[9px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                          allowed
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        {allowed ? <Check className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {allowed ? 'AUTHORIZED' : 'DENIED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#90AEAD]/10 text-[10px] text-[#90AEAD] flex justify-between mt-6">
              <span>Dynamic Policy Refreshes: <strong>Instant</strong></span>
              <span>Authorization Method: <strong>JWT Claims Tokens</strong></span>
            </div>
          </div>

          {/* Device 2FA / OTP Verification simulator - Right (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-white shadow-force-lg min-h-[500px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Smartphone className="w-5 h-5 text-[#90AEAD]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Identity Desk</span>
              </div>
              <h4 className="text-lg font-bold text-[#FBE9D0] mb-2">2FA Security Token Verification</h4>
              <p className="text-xs text-slate-500 mb-6">Click Request OTP to simulate sending an SMS security key, then submit code "4920" to authorize the session.</p>

              {otpVerified ? (
                /* OTP Verification success */
                <div className="py-10 text-center space-y-4 animate-scale-in">
                  <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-[#FBE9D0] text-sm">Security Token Approved</h5>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Device signature certificate generated. Local SQLite database unlocked for operations.
                  </p>
                </div>
              ) : otpRequest ? (
                /* OTP Input Form */
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-scale-in">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-300">
                    SMS sent to +91 ******4920
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Enter 4-Digit Passcode</label>
                    <input
                      type="text"
                      placeholder="e.g. 4920"
                      maxLength={4}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="w-full text-center tracking-widest font-mono text-lg py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#E64833]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Resend code in: <strong>{otpCounter}s</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpRequest(false)}
                      className="text-slate-400 hover:text-white font-semibold underline"
                    >
                      Reset Sim
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-accent flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" /> Validate Passcode
                  </button>
                </form>
              ) : (
                /* Initial Request State */
                <div className="py-8 text-center space-y-4">
                  <Key className="w-10 h-10 text-[#E64833] mx-auto animate-pulse" />
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Authenticate administrative operations or verify agent cell phones securely.
                  </p>
                  <button
                    onClick={handleRequestOtp}
                    className="px-6 py-3 bg-[#244855] hover:bg-[#1a3340] text-white font-bold rounded-xl text-xs transition-all min-h-[38px] flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Send Verification Token
                  </button>
                </div>
              )}
            </div>

            {/* Certifications and Compliance Logos */}
            <div className="pt-6 border-t border-slate-800 mt-6 flex justify-around items-center text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E64833]" /> SOC2 COMPLIANT
              </span>
              <span>ISO 27001 READY</span>
              <span>GDPR ALIGNED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
