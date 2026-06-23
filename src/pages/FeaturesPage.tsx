import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { X, CheckCircle } from 'lucide-react';

// Import Section Components
import HeroSection from '@/components/features/featurespage/HeroSection';
import GPSTrackingSection from '@/components/features/featurespage/GPSTrackingSection';
import FieldForceSection from '@/components/features/featurespage/FieldForceSection';
import TaskManagementSection from '@/components/features/featurespage/TaskManagementSection';
import AttendanceSection from '@/components/features/featurespage/AttendanceSection';
import ExpenseSection from '@/components/features/featurespage/ExpenseSection';
import CommunicationSection from '@/components/features/featurespage/CommunicationSection';
import AnalyticsSection from '@/components/features/featurespage/AnalyticsSection';
import DocumentCaptureSection from '@/components/features/featurespage/DocumentCaptureSection';
import OfflineSection from '@/components/features/featurespage/OfflineSection';
import SecuritySection from '@/components/features/featurespage/SecuritySection';
import IntegrationsSection from '@/components/features/featurespage/IntegrationsSection';
import WhyForce1Section from '@/components/features/featurespage/WhyForce1Section';
import TestimonialsSection from '@/components/features/featurespage/TestimonialsSection';
import FAQSection from '@/components/features/featurespage/FAQSection';
import FinalCTA from '@/components/features/featurespage/FinalCTA';

export default function FeaturesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'trial' | 'demo'>('trial');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  const handleOpenModal = (type: 'trial' | 'demo') => {
    setModalType(type);
    setFormSubmitted(false);
    setModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !company) {
      toast.error('Please fill out all contact fields');
      return;
    }
    setFormSubmitted(true);
    toast.success(
      modalType === 'trial'
        ? 'Account provisioned! Check your email for login details.'
        : 'Demo request received! Our sales team will call you shortly.'
    );
    setTimeout(() => {
      setModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setFormSubmitted(false);
    }, 2500);
  };

  return (
    <main className="pt-16 bg-white dark:bg-[#0d1f28] text-[#244855] dark:text-white transition-colors duration-300">
      {/* 1. Hero Section */}
      <HeroSection
        onOpenTrial={() => handleOpenModal('trial')}
        onOpenDemo={() => handleOpenModal('demo')}
      />

      {/* 2. Live GPS Tracking */}
      <GPSTrackingSection />

      {/* 3. Field Force Management */}
      <FieldForceSection
        onOpenTrial={() => handleOpenModal('trial')}
        onOpenDemo={() => handleOpenModal('demo')}
      />

      {/* 4. Task & Visit Management */}
      <TaskManagementSection />

      {/* 5. Attendance Management */}
      <AttendanceSection />

      {/* 6. Expense Management */}
      <ExpenseSection />

      {/* 7. Communication Center */}
      <CommunicationSection />

      {/* 8. Reporting & Analytics */}
      <AnalyticsSection />

      {/* 9. Document & Data Capture */}
      <DocumentCaptureSection />

      {/* 10. Offline Mode */}
      <OfflineSection />

      {/* 11. Security & Role Management */}
      <SecuritySection />

      {/* 12. Integrations */}
      <IntegrationsSection />

      {/* 13. Why Force1 */}
      <WhyForce1Section />

      {/* 14. Testimonials */}
      <TestimonialsSection />

      {/* 15. FAQ Section */}
      <FAQSection />

      {/* 16. Final CTA */}
      <FinalCTA
        onOpenTrial={() => handleOpenModal('trial')}
        onOpenDemo={() => handleOpenModal('demo')}
      />

      {/* Unified Global Action Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-force-lg animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              /* Success screen state */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#244855] dark:text-white">
                  {modalType === 'trial' ? 'Access Granted' : 'Booking Logged'}
                </h3>
                <p className="text-xs text-[#90AEAD] leading-relaxed max-w-xs mx-auto">
                  {modalType === 'trial'
                    ? 'Creating sandbox workspace environment. Check your inbox for login codes.'
                    : 'We have registered your preference and will schedule a live Google Meet call.'}
                </p>
              </div>
            ) : (
              /* Input Form screen */
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-[#244855] dark:text-white">
                    {modalType === 'trial' ? 'Start Your Free Trial' : 'Schedule a Product Demo'}
                  </h3>
                  <p className="text-xs text-[#90AEAD] mt-1">
                    {modalType === 'trial'
                      ? 'Enjoy 14-days full access with unlimited trackers and reporting nodes.'
                      : 'Talk directly to our operations engineers and structure custom zones.'}
                  </p>
                </div>

                <form onSubmit={handleModalSubmit} className="space-y-3.5 pt-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Cell Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 9999999999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Deliveries"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-accent mt-4.5 min-h-[44px] cursor-pointer"
                  >
                    {modalType === 'trial' ? 'Activate Roster Sandbox' : 'Confirm Google Meet Slot'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
