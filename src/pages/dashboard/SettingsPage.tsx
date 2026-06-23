import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Settings, Save, Shield, Bell, Key, Smartphone, HardDrive, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage('force1_settings', {
    companyName: 'Force1 Demo Corp',
    maxAgentsPerManager: 15,
    gpsInterval: 30,
    darkMode: false,
    emailNotifications: true,
    smsAlerts: false,
    backupInterval: 'weekly',
    twoFactorEnforced: false,
  });

  const [localSettings, setLocalSettings] = useState({ ...settings });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(localSettings);
    toast.success('System preferences and configurations saved successfully.');
  };

  const handleToggle = (key: keyof typeof settings) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key: keyof typeof settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Settings className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">System Configuration</h1>
          </div>
          <p className="text-white/70 text-sm font-semibold">Tweak general defaults, coordinate updates, email toggles, and safety measures.</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Company Settings */}
        <div className="card-base p-6 border border-[#90AEAD]/10 space-y-4">
          <h3 className="text-sm font-bold text-[#244855] dark:text-white font-display border-b border-[#90AEAD]/15 pb-2.5 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-[#E64833]" /> General Company Profile
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1.5">Company Name *</label>
              <input
                type="text"
                value={localSettings.companyName}
                onChange={e => handleInputChange('companyName', e.target.value)}
                className="input-field text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1.5">Max Agents Per Manager</label>
              <input
                type="number"
                value={localSettings.maxAgentsPerManager}
                onChange={e => handleInputChange('maxAgentsPerManager', parseInt(e.target.value) || 10)}
                className="input-field text-xs font-semibold"
                min="5"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* GPS Operations */}
        <div className="card-base p-6 border border-[#90AEAD]/10 space-y-4">
          <h3 className="text-sm font-bold text-[#244855] dark:text-white font-display border-b border-[#90AEAD]/15 pb-2.5 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#E64833]" /> Field Operations Tracking
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1.5">GPS Update Interval (seconds)</label>
              <input
                type="number"
                value={localSettings.gpsInterval}
                onChange={e => handleInputChange('gpsInterval', parseInt(e.target.value) || 30)}
                className="input-field text-xs font-semibold"
                min="10"
                max="300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1.5">Cloud Logs Backup Interval</label>
              <select
                value={localSettings.backupInterval}
                onChange={e => handleInputChange('backupInterval', e.target.value)}
                className="input-field font-semibold text-xs"
              >
                <option value="daily">Everyday Backup</option>
                <option value="weekly">Weekly Rotational</option>
                <option value="monthly">Monthly Snapshot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification settings */}
        <div className="card-base p-6 border border-[#90AEAD]/10 space-y-4.5">
          <h3 className="text-sm font-bold text-[#244855] dark:text-white font-display border-b border-[#90AEAD]/15 pb-2.5 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#E64833]" /> Alert Dispatch Preferences
          </h3>
          {[
            { key: 'emailNotifications', label: 'Email Notifications dispatch', desc: 'Notify managers via email about pending expense approvals.' },
            { key: 'smsAlerts', label: 'Critical SMS Alerts', desc: 'Dispatch instant mobile messages to agents for urgent status updates.' },
          ].map(toggle => (
            <div key={toggle.key} className="flex items-center justify-between p-3.5 bg-[#f8fafb] dark:bg-[#244855]/10 rounded-2xl border border-[#90AEAD]/10 gap-4">
              <div>
                <span className="text-xs font-bold text-[#244855] dark:text-white">{toggle.label}</span>
                <p className="text-[10px] text-[#90AEAD] mt-0.5">{toggle.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(toggle.key as any)}
                className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
                  localSettings[toggle.key as keyof typeof localSettings] ? 'bg-[#E64833]' : 'bg-[#90AEAD]/40'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                  localSettings[toggle.key as keyof typeof localSettings] ? 'left-5.5' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>

        {/* Security options */}
        <div className="card-base p-6 border border-[#90AEAD]/10 space-y-4">
          <h3 className="text-sm font-bold text-[#244855] dark:text-white font-display border-b border-[#90AEAD]/15 pb-2.5 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#E64833]" /> Infrastructure Security Settings
          </h3>
          <div className="flex items-center justify-between p-3.5 bg-[#f8fafb] dark:bg-[#244855]/10 rounded-2xl border border-[#90AEAD]/10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#244855] dark:text-white">Enforce 2-Factor Authentication (2FA)</span>
              <p className="text-[10px] text-[#90AEAD] mt-0.5">Force all administration accounts to verify logins using dynamic verification codes.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('twoFactorEnforced')}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
                localSettings.twoFactorEnforced ? 'bg-[#E64833]' : 'bg-[#90AEAD]/40'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                localSettings.twoFactorEnforced ? 'left-5.5' : 'left-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Save button footer */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3.5 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-2xl font-bold text-sm shadow transition-all min-h-[46px]"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
