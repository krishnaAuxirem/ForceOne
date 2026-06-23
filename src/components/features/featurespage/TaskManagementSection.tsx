import { useState } from 'react';
import { ClipboardList, CheckCircle2, ShieldAlert, Upload, PenTool, ArrowRight, Smartphone } from 'lucide-react';
import managerDashboardImg from '@/assets/manager-dashboard.jpg';

const PIPELINE_TASKS = [
  { id: 201, client: 'Airtel Plaza Outlet', time: '10:00 AM', status: 'Approved', type: 'Fibre Inspection', address: 'Connaught Place', proof: 'Signature & Selfie' },
  { id: 202, client: 'Tata Croma Store', time: '01:30 PM', status: 'Pending Review', type: 'POS Audit', address: 'South Ext', proof: 'Store Photo' },
  { id: 203, client: 'Reliance Digital', time: '04:00 PM', status: 'In Progress', type: 'Banner Setup', address: 'Dwarka Sector 10', proof: 'None yet' },
];

export default function TaskManagementSection() {
  const [tasks, setTasks] = useState(PIPELINE_TASKS);
  const [activeStep, setActiveStep] = useState(3); // On-site Geofence
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleApprove = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
  };

  const handleSimulateUpload = () => {
    setPhotoUploaded(true);
  };

  const handleSimulateSign = () => {
    setSigned(true);
  };

  const isCompleted = photoUploaded && signed;

  return (
    <section className="py-24 bg-white dark:bg-[#0d1f28] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <ClipboardList className="w-4 h-4" /> Task & Visit Pipeline
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Flawless Execution on the Ground
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Schedule visits, dispatch daily duties, and verify operations with tamper-proof signatures and geotagged photographs.
          </p>
        </div>

        {/* Workflow Diagram Banner */}
        <div className="mb-20 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-force-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#244855]/40 rounded-full blur-3xl z-0" />
          <h4 className="text-base font-bold text-[#FBE9D0] uppercase tracking-wider mb-6 relative z-10">
            Interactive Task Lifecycle Flowchart
          </h4>

          {/* Interactive Steps */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
            {[
              { step: 1, name: 'Task Dispatch', desc: 'Scheduler sends job details' },
              { step: 2, name: 'Agent Accepts', desc: 'Instant push alert notification' },
              { step: 3, name: 'Geofence Check-in', desc: 'Verifies agent is on-site' },
              { step: 4, name: 'Proof Collection', desc: 'Snaps image & grabs signature' },
              { step: 5, name: 'Auto Closure', desc: 'SLA logged & admin approved' },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  activeStep === s.step
                    ? 'border-[#E64833] bg-[#E64833]/15 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    activeStep === s.step ? 'bg-[#E64833] text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {s.step}
                  </span>
                  {activeStep > s.step && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <h5 className="font-bold text-sm text-white">{s.name}</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs text-slate-400 relative z-10 flex items-center gap-2">
            <span className="font-bold text-[#E64833]">Current Step Detail:</span>
            {activeStep === 1 && 'Platform auto-allocates recurring monthly audits and notifies the nearest technician.'}
            {activeStep === 2 && 'Technician views service list, customer phone numbers, route logs, and client billing records.'}
            {activeStep === 3 && 'Task check-in button remains disabled until GPS confirms agent coordinates are within 100m of store.'}
            {activeStep === 4 && 'Technician collects image uploads, customer signature, and fills out structural inventory checklist.'}
            {activeStep === 5 && 'Supervisor sees verification records, reimburses travel, and closes out ticket instantly.'}
          </div>
        </div>

        {/* Live Simulation & Preview - Grid layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Mock Mobile App (Proof Uploader) - Left (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-white shadow-force-lg min-h-[460px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Smartphone className="w-5 h-5 text-[#90AEAD]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agent Handheld Screen</span>
              </div>
              <h4 className="text-lg font-bold text-[#FBE9D0] mb-2">Verification Desk</h4>
              <p className="text-xs text-slate-500 mb-6">Complete the tasks below to close visit ticket #704.</p>

              <div className="space-y-4">
                {/* Proof Task 1: Upload Store Front Image */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold">1. Photo Audit Proof</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Take clear picture of product shelf shelf space.</p>
                  </div>
                  <button
                    onClick={handleSimulateUpload}
                    disabled={photoUploaded}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] flex items-center gap-1.5 ${
                      photoUploaded
                        ? 'bg-emerald-500/20 text-emerald-400 border border-transparent'
                        : 'bg-[#244855] text-white hover:bg-[#1a3340] border border-[#244855] cursor-pointer'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {photoUploaded ? 'Uploaded' : 'Snap Photo'}
                  </button>
                </div>

                {/* Proof Task 2: Capture Customer Signature */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold">2. Client Digital Signature</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Sign on mobile touchscreen to verify visits.</p>
                  </div>
                  <button
                    onClick={handleSimulateSign}
                    disabled={signed}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] flex items-center gap-1.5 ${
                      signed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-transparent'
                        : 'bg-[#244855] text-white hover:bg-[#1a3340] border border-[#244855] cursor-pointer'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    {signed ? 'Signed' : 'Draw Sign'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Verification Status</span>
                  <p className="text-sm font-bold mt-0.5 flex items-center gap-1.5">
                    {isCompleted ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        Ready to Close
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                        Awaiting Inputs
                      </>
                    )}
                  </p>
                </div>
                <button
                  disabled={!isCompleted}
                  onClick={() => {
                    alert('Visit verification packet compiled and submitted to server database!');
                    setPhotoUploaded(false);
                    setSigned(false);
                  }}
                  className={`px-5 py-3 rounded-xl text-xs font-bold transition-all min-h-[42px] ${
                    isCompleted
                      ? 'bg-[#E64833] hover:bg-[#cc3d29] text-white cursor-pointer shadow-accent'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Submit Audit Packet
                </button>
              </div>
            </div>
          </div>

          {/* Manager Panel Visit Pipeline - Right (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 shadow-sm">
            <div className="space-y-4">
              <h4 className="font-bold text-[#244855] dark:text-white text-lg flex items-center gap-2">
                Manager Review Roster
              </h4>
              <p className="text-xs text-[#90AEAD]">Review submitted proofs and issue approvals immediately.</p>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-[#90AEAD]/10 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-[#244855] dark:text-white">{task.client}</span>
                        <span className="text-[10px] bg-[#90AEAD]/15 text-[#244855] dark:text-[#90AEAD] px-2.5 py-0.5 rounded-full font-bold">
                          {task.type}
                        </span>
                      </div>
                      <div className="text-xs text-[#90AEAD] mt-1">
                        {task.address} • Schedule: {task.time}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                          task.status === 'Approved'
                            ? 'bg-emerald-100 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                            : task.status === 'Pending Review'
                            ? 'bg-amber-100 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400'
                            : 'bg-blue-100 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {task.status}
                      </span>
                      {task.status === 'Pending Review' && (
                        <button
                          onClick={() => handleApprove(task.id)}
                          className="bg-[#244855] hover:bg-[#1a3340] text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer min-h-[32px]"
                        >
                          Approve Visit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 relative rounded-2xl overflow-hidden h-40 border border-[#90AEAD]/20">
              <img src={managerDashboardImg} alt="Manager dashboard logs" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col justify-end p-4 text-white">
                <p className="font-bold text-sm">Automated Analytics Audits</p>
                <p className="text-xs text-slate-300">Force1 calculates travel distance and logs travel allowances automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
