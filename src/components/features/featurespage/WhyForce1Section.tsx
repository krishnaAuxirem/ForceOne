import { Check, X, ShieldAlert, Zap, Award, BarChart3, ShieldCheck } from 'lucide-react';

const COMPARISON_ROWS = [
  { feature: 'Real-time GPS Tracking', f1: true, sheets: false, others: 'Delayed' },
  { feature: 'Anti-Tamper Selfie Attendance', f1: true, sheets: false, others: false },
  { feature: 'Offline SQLite DB Cache', f1: true, sheets: false, others: 'Manual Sync' },
  { feature: 'Receipt OCR OCR Scan', f1: true, sheets: false, others: false },
  { feature: 'Geofenced Task Check-in', f1: true, sheets: false, others: 'Optional' },
  { feature: 'Enterprise JWT & SOC2', f1: true, sheets: false, others: true },
];

export default function WhyForce1Section() {
  return (
    <section className="py-24 bg-[#FBE9D0]/20 dark:bg-[#152c35]/50 border-t border-[#90AEAD]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <Award className="w-4 h-4" /> Why Choose Force1
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Unmatched Value and ROI
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Discover the measurable business impact of field automation. Optimize routes, save fuel, and free up supervisors.
          </p>
        </div>

        {/* ROI Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {[
            {
              title: '25% Fuel Savings',
              desc: 'Route breadcrumbs and optimal address clustering reduce overall travel distance across field teams.',
              icon: <Zap className="w-6 h-6 text-[#E64833]" />,
            },
            {
              title: '40% More Audits',
              desc: 'Geo-triggered check-ins and live chat dispatch allow agents to complete more audits per shift.',
              icon: <BarChart3 className="w-6 h-6 text-[#244855] dark:text-[#90AEAD]" />,
            },
            {
              title: '90% Less Admin',
              desc: 'Auto-compiled expense PDFs and punch timelines reduce manual accounting operations dramatically.',
              icon: <ShieldCheck className="w-6 h-6 text-[#874F41]" />,
            },
          ].map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a2d38] p-6.5 rounded-3xl border border-[#90AEAD]/20 shadow-sm hover:shadow-force hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 border border-[#90AEAD]/20 rounded-2xl flex items-center justify-center mb-5">
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-[#244855] dark:text-white text-xl mb-2">{benefit.title}</h4>
                <p className="text-sm text-[#90AEAD] leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 shadow-force-lg overflow-hidden max-w-5xl mx-auto">
          <h4 className="font-bold text-[#244855] dark:text-white text-lg mb-6 flex items-center gap-2">
            Detailed Platform Comparison
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#90AEAD]/10 text-[#90AEAD] font-bold text-sm">
                  <th className="pb-4 pr-4">Operational Capabilities</th>
                  <th className="pb-4 px-4 text-[#E64833] font-extrabold">Force1 Platform</th>
                  <th className="pb-4 px-4">Traditional Excel Sheets</th>
                  <th className="pb-4 pl-4 text-right">Legacy Field Competitors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#90AEAD]/10">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 pr-4 font-bold text-[#244855] dark:text-white text-xs sm:text-sm">{row.feature}</td>
                    {/* Force1 Check */}
                    <td className="py-4 px-4 font-bold text-[#E64833]">
                      <span className="flex items-center gap-1 bg-[#E64833]/10 px-2.5 py-1 rounded-full w-fit">
                        <Check className="w-3.5 h-3.5" /> Full Support
                      </span>
                    </td>
                    {/* Sheets Cross */}
                    <td className="py-4 px-4 text-slate-400">
                      {row.sheets ? (
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <X className="w-3.5 h-3.5" /> None
                        </span>
                      )}
                    </td>
                    {/* Legacy Apps */}
                    <td className="py-4 pl-4 text-right font-medium text-slate-500">
                      {typeof row.others === 'boolean' ? (
                        row.others ? (
                          <span className="text-emerald-500 inline-flex items-center gap-1 font-bold">
                            <Check className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-400 inline-flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> No
                          </span>
                        )
                      ) : (
                        <span className="text-slate-500">{row.others}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
