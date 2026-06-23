import { useState, useEffect } from 'react';
import { Clock, Navigation, Camera, CheckCircle2, History, AlertCircle } from 'lucide-react';

const INITIAL_HISTORY = [
  { date: '22 June 2026', checkIn: '09:04 AM', checkOut: '06:00 PM', hours: '8.9 hrs', status: 'On Time', selfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
  { date: '21 June 2026', checkIn: '09:18 AM', checkOut: '06:05 PM', hours: '8.8 hrs', status: 'Late', selfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
  { date: '20 June 2026', checkIn: '08:58 AM', checkOut: '05:30 PM', hours: '8.5 hrs', status: 'On Time', selfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
];

export default function AttendanceSection() {
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (punchedIn && punchTime) {
      const startTime = new Date().getTime();
      timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - startTime;
        const hrs = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    } else {
      setElapsedTime('00:00:00');
    }
    return () => clearInterval(timer);
  }, [punchedIn, punchTime]);

  const handlePunchIn = () => {
    if (!selfieTaken) {
      setShowCamera(true);
      return;
    }
    // Simulate coordinates verification
    setGpsVerified(true);
    setTimeout(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchTime(timeStr);
      setPunchedIn(true);

      const newLog = {
        date: 'Today (Live)',
        checkIn: timeStr,
        checkOut: '--',
        hours: 'Active',
        status: 'On Time',
        selfie: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop',
      };
      setHistory([newLog, ...history]);
    }, 800);
  };

  const handlePunchOut = () => {
    setPunchedIn(false);
    setSelfieTaken(false);
    setGpsVerified(false);
    setHistory((prev) =>
      prev.map((item, idx) =>
        idx === 0
          ? {
              ...item,
              checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              hours: 'Completed',
            }
          : item
      )
    );
  };

  const handleCaptureSelfie = () => {
    setSelfieTaken(true);
    setShowCamera(false);
    // Auto proceed to punch
    handlePunchIn();
  };

  return (
    <section className="py-24 bg-[#FBE9D0]/20 dark:bg-[#152c35]/50 border-t border-[#90AEAD]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
              <Clock className="w-4 h-4" /> Smart Attendance
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-5 leading-tight">
              Anti-Tamper Attendance via Geofencing & Selfies
            </h2>
            <p className="text-lg text-[#90AEAD] leading-relaxed mb-6">
              Eliminate buddy punching and proxy logins. Force1 requires agents to confirm their location within their assigned zone and capture a live portrait snapshot before starting their shift.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2d38] p-5 rounded-2xl border border-[#90AEAD]/20 flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-6 h-6 text-[#E64833] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#244855] dark:text-white text-base">GPS Location Validation</h4>
              <p className="text-xs text-[#90AEAD] mt-1 leading-relaxed">
                App matches phone longitude/latitude with office coordinates or current customer visit location before approving clock-in commands.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Roster & Punch Panel */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Mobile Punch-In Panel Simulator - Left (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-white shadow-force-lg min-h-[460px] relative overflow-hidden">
            {showCamera ? (
              /* Camera Mockup */
              <div className="flex-1 flex flex-col justify-between animate-scale-in">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-[#E64833]" />
                  <span className="text-xs font-semibold text-slate-400">Taking Verification Selfie</span>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  {/* Simulated Camera View */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&h=240&fit=crop"
                    alt="Selfie preview"
                    className="w-full h-full object-cover grayscale opacity-90"
                  />
                  <div className="absolute inset-0 border-[3px] border-[#E64833] rounded-2xl pointer-events-none" />
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-[9px] text-emerald-400 font-semibold tracking-wider">
                    FACE DETECTED
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCamera(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all min-h-[40px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCaptureSelfie}
                    className="flex-1 py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-xl text-xs transition-all min-h-[40px] shadow-accent flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" /> Capture & Clock In
                  </button>
                </div>
              </div>
            ) : (
              /* Punch Panel Mockup */
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Clocking Portal</span>
                    {punchedIn && (
                      <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Working Shift
                      </span>
                    )}
                  </div>

                  <div className="text-center py-6">
                    <div className="text-5xl font-mono font-extrabold text-[#FBE9D0] mb-2 tracking-tight">
                      {punchedIn ? elapsedTime : '09:00 AM'}
                    </div>
                    <p className="text-xs text-slate-400">Active Shift Timer (Hours : Mins : Secs)</p>
                  </div>
                </div>

                <div className="space-y-4 my-6">
                  {/* GPS Verification Status */}
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Navigation className={`w-4 h-4 ${gpsVerified ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold">GPS Coordinates</p>
                        <p className="text-[10px] text-slate-500">
                          {gpsVerified ? 'Location Verified: 28.5355° N, 77.2638° E' : 'Tap Clock-In to start verification'}
                        </p>
                      </div>
                    </div>
                    {gpsVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  {/* Selfie Status */}
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Camera className={`w-4 h-4 ${selfieTaken ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold">Selfie Verification</p>
                        <p className="text-[10px] text-slate-500">
                          {selfieTaken ? 'Facial Match Approved (99.1%)' : 'Requires dynamic image comparison'}
                        </p>
                      </div>
                    </div>
                    {selfieTaken && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                <div>
                  {!punchedIn ? (
                    <button
                      onClick={handlePunchIn}
                      className="w-full py-4.5 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-2xl text-base transition-all shadow-accent flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                    >
                      <Clock className="w-5 h-5 animate-pulse" /> Punch In Shift
                    </button>
                  ) : (
                    <button
                      onClick={handlePunchOut}
                      className="w-full py-4.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold rounded-2xl text-base transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                    >
                      <Clock className="w-5 h-5" /> Punch Out Shift
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Roster Logs Table Preview - Right (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[#244855] dark:text-white text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-[#874F41]" /> Attendance Registry
                </h4>
                <span className="text-xs text-[#90AEAD]">Current Period: June 2026</span>
              </div>
              <p className="text-xs text-[#90AEAD] mb-6">Review your agents shift duration and selfie photo records below.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#90AEAD]/10 text-[#90AEAD] font-bold">
                      <th className="pb-3 pr-2">Date</th>
                      <th className="pb-3 px-2">Selfie</th>
                      <th className="pb-3 px-2">Punch In</th>
                      <th className="pb-3 px-2">Punch Out</th>
                      <th className="pb-3 px-2 text-center">Duration</th>
                      <th className="pb-3 pl-2 text-right">SLA Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#90AEAD]/10">
                    {history.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="py-3.5 pr-2 font-semibold text-[#244855] dark:text-white">{row.date}</td>
                        <td className="py-3.5 px-2">
                          <img
                            src={row.selfie}
                            alt="Selfie Log"
                            className="w-7 h-7 rounded-lg object-cover border border-[#90AEAD]/30"
                          />
                        </td>
                        <td className="py-3.5 px-2 font-mono font-medium text-slate-600 dark:text-slate-300">{row.checkIn}</td>
                        <td className="py-3.5 px-2 font-mono font-medium text-slate-600 dark:text-slate-300">{row.checkOut}</td>
                        <td className="py-3.5 px-2 text-center font-bold text-slate-700 dark:text-slate-200">{row.hours}</td>
                        <td className="py-3.5 pl-2 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              row.status === 'On Time'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-6 border-t border-[#90AEAD]/10 text-xs text-[#90AEAD] flex justify-between items-center mt-6">
              <span>Avg Check-in Time: <strong>09:06 AM</strong></span>
              <span>Avg Working Hours: <strong>8.7 hrs/day</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
