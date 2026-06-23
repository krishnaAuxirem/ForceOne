import { useState } from 'react';
import { FileSpreadsheet, CheckSquare, ShieldCheck, PenTool, Check, FileText } from 'lucide-react';

const INITIAL_DOCS = [
  { id: 401, name: 'Dwarka_Phase_2_Inspection_Report.pdf', size: '2.4 MB', author: 'Vikram Seth', date: 'Today' },
  { id: 402, name: 'Connaught_Place_Retail_Audit.xlsx', size: '1.8 MB', author: 'Anjali Sharma', date: 'Yesterday' },
];

export default function DocumentCaptureSection() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [contractor, setContractor] = useState('Nokia Solutions');
  const [lossRate, setLossRate] = useState('1.2 dB');
  const [signed, setSigned] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSimulateSign = () => {
    setSigned(true);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const newDoc = {
      id: Date.now(),
      name: `Site_Inspection_${contractor.replace(/\s+/g, '_')}_Report.pdf`,
      size: '1.1 MB',
      author: 'You (Manager)',
      date: 'Just Now',
    };
    setDocs([newDoc, ...docs]);
    setTimeout(() => {
      setIsSubmitted(false);
      setSigned(false);
    }, 4000);
  };

  return (
    <section className="py-24 bg-[#FBE9D0]/20 dark:bg-[#152c35]/50 border-t border-[#90AEAD]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
              <FileSpreadsheet className="w-4 h-4" /> Structured Data Capture
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-5 leading-tight">
              Dynamic Forms & Document Locker
            </h2>
            <p className="text-lg text-[#90AEAD] leading-relaxed mb-6">
              Replace rigid paperwork with dynamic mobile surveys. Collect checklists, log parameters, capture customer signatures, and auto-generate PDF files instantly.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1a2d38] p-5 rounded-2xl border border-[#90AEAD]/20 shadow-sm flex gap-3">
              <CheckSquare className="w-5 h-5 text-[#E64833] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#244855] dark:text-white text-sm">Dynamic Validation</h4>
                <p className="text-[11px] text-[#90AEAD] mt-0.5 leading-relaxed">Enforce field constraints like integer sizes and photo attachments.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a2d38] p-5 rounded-2xl border border-[#90AEAD]/20 shadow-sm flex gap-3">
              <ShieldCheck className="w-5 h-5 text-[#244855] dark:text-[#90AEAD] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#244855] dark:text-white text-sm">Digital Signatures</h4>
                <p className="text-[11px] text-[#90AEAD] mt-0.5 leading-relaxed">Acquire touch signatures that lock PDF metadata logs securely.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form & Locker Simulator */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Custom Audit Form Mock - Left (6 Columns) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-force-lg flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E64833] animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fiber Node Audit form</span>
                </div>
                <span className="text-[10px] text-[#90AEAD]">Form ID: #FNA-920</span>
              </div>

              {isSubmitted ? (
                /* Submission success */
                <div className="py-12 text-center space-y-4 animate-scale-in">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg text-[#FBE9D0]">Report Submitted Successfully</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    A PDF inspection packet has been automatically generated, timestamped, and catalogued in the document locker database.
                  </p>
                </div>
              ) : (
                /* Active Form inputs */
                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contractor Name</label>
                      <input
                        type="text"
                        value={contractor}
                        onChange={(e) => setContractor(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#E64833] transition-colors min-h-[38px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Fiber Loss Rate (dB)</label>
                      <input
                        type="text"
                        value={lossRate}
                        onChange={(e) => setLossRate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#E64833] transition-colors min-h-[38px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Touch Signature Pad</label>
                    <div className="aspect-[4/1.8] bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors rounded-xl relative overflow-hidden flex items-center justify-center">
                      {signed ? (
                        /* Simulated Cursive Sign */
                        <div className="font-cursive text-3xl text-sky-400 font-bold select-none transform rotate-[-3deg] animate-scale-in">
                          {contractor}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSimulateSign}
                          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition-all min-h-[34px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <PenTool className="w-3.5 h-3.5 text-[#E64833]" /> Draw Signature
                        </button>
                      )}
                      {signed && (
                        <span className="absolute bottom-2 right-2 text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/20">
                          VERIFIED SECURE
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-accent flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                  >
                    Submit Audit Sheet
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 mt-6 text-[10px] text-slate-500 flex justify-between">
              <span>Geo-tag: Verified (Okhla Link)</span>
              <span>Device: iPad Air (iOS 17)</span>
            </div>
          </div>

          {/* Document Locker / Cabinet - Right (6 Columns) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="font-bold text-[#244855] dark:text-white text-lg mb-1 flex items-center gap-2">
                Cloud Document Locker
              </h4>
              <p className="text-xs text-[#90AEAD] mb-6">Access all auto-compiled field inspection forms and export logs.</p>

              <div className="space-y-4">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-[#90AEAD]/10 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#244855]/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#244855] dark:text-[#90AEAD]" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#244855] dark:text-white truncate max-w-[200px] sm:max-w-xs">{doc.name}</p>
                        <p className="text-[10px] text-[#90AEAD] mt-1">
                          Size: {doc.size} • By: {doc.author} ({doc.date})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Initiating download for ${doc.name}`)}
                      className="text-xs text-[#E64833] hover:underline font-bold px-3 py-1.5 cursor-pointer min-h-[32px]"
                    >
                      Retrieve
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#90AEAD]/10 text-xs text-[#90AEAD] flex justify-between items-center mt-6">
              <span>Cloud Storage Limit: <strong>14.5 GB / 100 GB</strong></span>
              <span>All documents encrypted with <strong>AES-256</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
