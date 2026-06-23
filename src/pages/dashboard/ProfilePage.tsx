import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, MapPin, Calendar, Key, Shield, ShieldCheck, Save, Camera, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password reset states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required.');
      return;
    }
    updateUser({ name, email, phone, avatar });
    toast.success('Your profile details have been updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Profile Header Card */}
      <div className="card-base p-6 border border-[#90AEAD]/10 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-br from-[#244855] via-[#244855]/95 to-[#1a3340] text-white">
        <div className="relative group">
          <img 
            src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=244855&color=FBE9D0&size=120`}
            alt={name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-[#E64833] shadow-md"
          />
          <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
            <input 
              type="text" 
              className="hidden" 
              placeholder="Avatar URL"
              onChange={e => {
                const url = prompt('Enter image URL:');
                if (url) setAvatar(url);
              }}
            />
          </label>
        </div>
        <div className="text-center sm:text-left flex-1 space-y-1">
          <h2 className="text-2xl font-bold font-display">{name || 'Your Profile'}</h2>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 text-xs text-[#90AEAD]">
            <span className="capitalize px-2.5 py-0.5 rounded bg-white/10 text-white font-bold tracking-wider">{user?.role} Account</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{user?.region || 'Mumbai Zone'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {user?.joinDate || '2023-03-15'}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="card-base p-6 border border-[#90AEAD]/10 space-y-4">
          <h3 className="text-sm font-bold text-[#244855] dark:text-white font-display border-b border-[#90AEAD]/15 pb-2.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#E64833]" /> Profile Account Details
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Full Identity Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-field text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Profile Photo URL</label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="input-field text-xs font-semibold"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <button type="submit" className="w-full py-3 bg-[#244855] hover:bg-[#1a3340] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all">
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card-base p-6 border border-[#90AEAD]/10 space-y-4">
          <h3 className="text-sm font-bold text-[#244855] dark:text-white font-display border-b border-[#90AEAD]/15 pb-2.5 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#E64833]" /> Access Password Update
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Current Password *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all">
              <Key className="w-4 h-4" /> Update Access Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
