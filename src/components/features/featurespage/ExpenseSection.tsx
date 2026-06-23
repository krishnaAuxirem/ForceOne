import { useState } from 'react';
import { IndianRupee, FileText, CheckCircle2, XCircle, Clock, Upload, ArrowUpRight } from 'lucide-react';

const INITIAL_EXPENSES = [
  { id: 301, item: 'Client Lunch (Tata Group)', merchant: 'Haldirams Restaurant', amount: 1450, category: 'Food & Meals', date: '21 Jun 2026', status: 'Approved', receipt: 'receipt-01.jpg' },
  { id: 302, item: 'Fuel Allowance CP to Okhla', merchant: 'HP Fuel Depot', amount: 850, category: 'Travel & Fuel', date: '22 Jun 2026', status: 'Pending Review', receipt: 'receipt-02.jpg' },
  { id: 303, item: 'Site Inspection Hotel Stay', merchant: 'Taj Residency', amount: 4800, category: 'Lodging & Hotel', date: '19 Jun 2026', status: 'Reimbursed', receipt: 'receipt-03.jpg' },
];

export default function ExpenseSection() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scannedClaim, setScannedClaim] = useState({
    item: 'Fuel Refill CP Station',
    merchant: 'Bharat Petroleum Ltd',
    amount: 1200,
    category: 'Travel & Fuel',
  });

  const handleSimulateOCR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1500);
  };

  const handleAddScannedClaim = () => {
    const newClaim = {
      id: Date.now(),
      item: scannedClaim.item,
      merchant: scannedClaim.merchant,
      amount: scannedClaim.amount,
      category: scannedClaim.category,
      date: 'Today (Live)',
      status: 'Pending Review',
      receipt: 'ocr-receipt.jpg',
    };
    setExpenses([newClaim, ...expenses]);
    setScanComplete(false);
  };

  const handleApprove = (id: number) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e))
    );
  };

  const handleReject = (id: number) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e))
    );
  };

  // Calculate totals
  const totalApproved = expenses
    .filter((e) => e.status === 'Approved' || e.status === 'Reimbursed')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPending = expenses
    .filter((e) => e.status === 'Pending Review')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <section className="py-24 bg-white dark:bg-[#0d1f28] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <IndianRupee className="w-4 h-4" /> Expense & Reimbursement
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Zero-Leak Expense Approvals
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Eliminate manual calculations and paper billing. Agents upload receipts on the fly, while supervisors review claims instantly from their unified control board.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          <div className="bg-slate-50 dark:bg-[#1a2d38] p-6 rounded-2xl border border-[#90AEAD]/20 relative overflow-hidden">
            <span className="text-xs uppercase font-bold text-[#90AEAD]">Reimbursed & Approved</span>
            <h3 className="text-3xl font-extrabold text-[#244855] dark:text-white mt-2 font-mono">
              ₹{totalApproved.toLocaleString()}
            </h3>
            <p className="text-[10px] text-emerald-500 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% payout compliance
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-[#1a2d38] p-6 rounded-2xl border border-[#90AEAD]/20 relative overflow-hidden">
            <span className="text-xs uppercase font-bold text-[#90AEAD]">Awaiting Audit</span>
            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2 font-mono">
              ₹{totalPending.toLocaleString()}
            </h3>
            <p className="text-[10px] text-[#90AEAD] mt-2">Requires supervisor review</p>
          </div>
          <div className="bg-slate-50 dark:bg-[#1a2d38] p-6 rounded-2xl border border-[#90AEAD]/20 relative overflow-hidden">
            <span className="text-xs uppercase font-bold text-[#90AEAD]">Avg Claim Settlement</span>
            <h3 className="text-3xl font-extrabold text-[#E64833] mt-2 font-mono">
              1.2 Days
            </h3>
            <p className="text-[10px] text-[#90AEAD] mt-2">94% faster than sheet tracking</p>
          </div>
        </div>

        {/* Section Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Mobile Receipt OCR Mock - Left (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-white shadow-force-lg min-h-[460px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-[#90AEAD]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agent Receipt Portal</span>
              </div>
              <h4 className="text-lg font-bold text-[#FBE9D0] mb-2">Automated OCR Scanner</h4>
              <p className="text-xs text-slate-500 mb-6">Click scan to simulate OCR scanning, reading fuel metrics automatically.</p>

              {isScanning ? (
                /* Scanning State animation */
                <div className="aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#E64833] animate-bounce" />
                  <Upload className="w-10 h-10 text-[#E64833] animate-pulse mb-3" />
                  <p className="text-xs font-semibold text-slate-300">Reading Receipt Metadata...</p>
                  <p className="text-[10px] text-slate-500 mt-1">Extracting Merchant, Date & Total</p>
                </div>
              ) : scanComplete ? (
                /* Edit Scan details Mock Form */
                <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl space-y-3.5 animate-scale-in">
                  <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-800 text-[#FBE9D0] font-semibold">
                    <span>Scan Result Approved</span>
                    <span>100% Match Confidence</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px]">Merchant</span>
                      <p className="font-bold text-slate-200">{scannedClaim.merchant}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Category</span>
                      <p className="font-bold text-slate-200">{scannedClaim.category}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 text-[10px]">Purpose</span>
                      <p className="font-bold text-slate-200">{scannedClaim.item}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Calculated Amount</span>
                      <p className="font-bold text-[#E64833] text-sm">₹{scannedClaim.amount}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddScannedClaim}
                    className="w-full bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 min-h-[38px] cursor-pointer"
                  >
                    Confirm & File Claim
                  </button>
                </div>
              ) : (
                /* Initial Upload Trigger State */
                <div className="aspect-[4/3] rounded-2xl bg-slate-900 hover:bg-slate-900/80 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center cursor-pointer p-4 group" onClick={handleSimulateOCR}>
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-[#E64833] mb-3 transition-colors" />
                  <p className="text-xs font-bold text-slate-300">Drag Receipt PDF/JPG Here</p>
                  <p className="text-[10px] text-slate-500 mt-1">Or click to simulate automated camera scan</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 text-xs text-slate-500">
              <strong>System Intelligence:</strong> Scanner cross-references fuel pump locations against GPS tracking logs to verify integrity.
            </div>
          </div>

          {/* Supervisor Roster Claims List - Right (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="font-bold text-[#244855] dark:text-white text-lg mb-1 flex items-center gap-2">
                Supervisor Expense Roster
              </h4>
              <p className="text-xs text-[#90AEAD] mb-6">Approve, reject, or request audit clarification for claims filed below.</p>

              <div className="space-y-3.5">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-[#90AEAD]/10 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-[#244855] dark:text-white">{exp.item}</span>
                        <span className="text-[10px] font-bold text-slate-400">{exp.date}</span>
                      </div>
                      <div className="text-xs text-[#90AEAD] mt-1.5">
                        {exp.merchant} • <span className="font-semibold text-slate-500">{exp.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-sm text-[#244855] dark:text-white">
                        ₹{exp.amount}
                      </span>
                      {exp.status === 'Pending Review' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(exp.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all min-h-[32px] flex items-center justify-center cursor-pointer"
                            title="Reject"
                          >
                            <XCircle className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleApprove(exp.id)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-all min-h-[32px] flex items-center justify-center cursor-pointer"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                            exp.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                              : exp.status === 'Reimbursed'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          }`}
                        >
                          {exp.status === 'Approved' || exp.status === 'Reimbursed' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {exp.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#90AEAD]/10 text-xs text-[#90AEAD] flex justify-between items-center mt-6">
              <span>Auto Audit Check: <strong className="text-emerald-500">Passed</strong></span>
              <span>Reimbursement Method: <strong>Direct Bank Deposit (IMPS)</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
