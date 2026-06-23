import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "How accurate is the real-time GPS tracking system?",
    a: "Force1 queries cellular and satellite coordinates using optimized device sensors, delivering location accuracy within 5-10 meters. It samples telemetry at smart intervals to save device battery.",
  },
  {
    q: "Does Force1 support offline operations when signal drops?",
    a: "Yes. All checklist audits, forms, selfie clocks, and receipt images are queued in an encrypted local database (SQLite/LocalDB) and automatically uploaded to the cloud when Wi-Fi/4G connection is restored.",
  },
  {
    q: "How does the anti-tamper selfie verification prevent proxy clock-ins?",
    a: "Our handheld app uses biometric comparison check. It prevents uploading pre-recorded photos or avatars by forcing agents to capture a live selfie directly within the active camera module with timestamp data.",
  },
  {
    q: "Can we build custom field report forms with specific validations?",
    a: "Yes. Administrators can design customized field surveys via the Form Designer, configuring specific data types like drop-downs, integer loss rates, image attachments, or digital signature slots.",
  },
  {
    q: "How are fuel allowances and travel reimbursements calculated?",
    a: "Force1 tracks the actual path traveled by agents and calculates travel distance in kilometers. It matches mileage records against company fuel payout rates, auto-generating audit sheets for approvals.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-[#FBE9D0]/20 dark:bg-[#152c35]/50 border-t border-[#90AEAD]/20 relative">
      <div className="max-w-4xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <HelpCircle className="w-4 h-4" /> FAQ Desk
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Quick answers regarding device security, GPS battery life, offline caches, and customized field forms.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer font-bold text-sm sm:text-base text-[#244855] dark:text-white min-h-[56px]"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#90AEAD] transition-transform flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#E64833]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-50 dark:border-slate-800/40 text-xs sm:text-sm text-[#90AEAD] leading-relaxed animate-scale-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
