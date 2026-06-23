import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Database, RotateCw, Smartphone, CheckCircle, Save } from 'lucide-react';

export default function OfflineSection() {
  const [isOnline, setIsOnline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<string[]>(['Audit Site-701 details cached']);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleToggleNetwork = () => {
    if (!isOnline) {
      // Transitioning to Online: trigger sync animation if items exist
      setIsOnline(true);
      if (offlineQueue.length > 0) {
        setSyncing(true);
        setSyncProgress(0);
      }
    } else {
      // Transitioning to Offline
      setIsOnline(false);
      setSyncComplete(false);
    }
  };

  useEffect(() => {
    if (!syncing) return;
    const timer = setInterval(() => {
      setSyncProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(timer);
          setSyncing(false);
          setOfflineQueue([]);
          setSyncComplete(true);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [syncing]);

  const handleAddCachedReport = () => {
    if (isOnline) {
      alert('You are online! Data will be uploaded directly, no caching needed.');
      return;
    }
    const reportName = `Offline_Log_CP_${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', '_')}`;
    setOfflineQueue([...offlineQueue, reportName]);
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0d1f28] relative border-t border-[#90AEAD]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <WifiOff className="w-4 h-4" /> Resilient Offline Sync
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Zero Data Loss in Low Signal Areas
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Basements, rural towns, and tunnels shouldn't freeze operations. Force1 caches all telemetry, images, and signatures locally on-device and auto-syncs when signal recovers.
          </p>
        </div>

        {/* Section Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Mobile Simulator Mock - Left (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[300px] h-[580px] bg-slate-950 rounded-[40px] border-[8px] border-slate-800 p-4 shadow-force-lg flex flex-col justify-between relative text-white">
              {/* Camera Notch */}
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-5.5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-black rounded-full mr-2" />
                <span className="w-1.5 h-1.5 bg-blue-900 rounded-full" />
              </div>

              {/* Mobile Header / Signals bar */}
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mt-2 z-10 px-2">
                <span>14:48</span>
                <div className="flex items-center gap-1.5">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">4G LTE</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-[#E64833]" />
                      <span className="text-[#E64833] line-through">No Signal</span>
                    </>
                  )}
                </div>
              </div>

              {/* Main Phone Viewport */}
              <div className="flex-1 bg-slate-900 rounded-2xl p-4.5 my-4 overflow-y-auto relative flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#FBE9D0] mb-1.5 flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Local DB Desk
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal mb-4">
                    Simulator cache holding unsynchronized operational reports.
                  </p>

                  {/* Network State Warning Badge */}
                  {!isOnline ? (
                    <div className="p-3 bg-[#E64833]/15 border border-[#E64833]/40 rounded-xl space-y-1 mb-4 animate-pulse">
                      <p className="text-[10px] font-bold text-[#E64833] uppercase">Offline Mode Active</p>
                      <p className="text-[9px] text-slate-300">All data will be saved locally until network is restored.</p>
                    </div>
                  ) : syncComplete ? (
                    <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl space-y-1 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase">Synchronized</p>
                        <p className="text-[9px] text-slate-300">Queue cleared. Local db is empty.</p>
                      </div>
                    </div>
                  ) : null}

                  {/* Active Offline Cache Items */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Unsynchronized Queue</span>
                    {offlineQueue.length > 0 ? (
                      offlineQueue.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-[10px]"
                        >
                          <span className="truncate text-slate-300 max-w-[150px]">{item}</span>
                          <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 border border-amber-500/20">
                            <Save className="w-2.5 h-2.5" /> CACHED
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-500 text-center py-4">No pending offline reports.</p>
                    )}
                  </div>
                </div>

                {/* Progress bar overlay during syncing */}
                {syncing && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 mb-4 animate-scale-in">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-300">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5 animate-spin text-[#E64833]" /> Auto Syncing...
                      </span>
                      <span>{syncProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#E64833] h-full transition-all duration-150" style={{ width: `${syncProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Simulation Action buttons inside phone */}
                <div className="space-y-2">
                  <button
                    onClick={handleAddCachedReport}
                    disabled={isOnline}
                    className={`w-full py-2.5 rounded-xl text-[10px] font-bold transition-all min-h-[36px] flex items-center justify-center gap-1.5 ${
                      isOnline
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-[#244855] text-white hover:bg-[#1a3340] cursor-pointer'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" /> Cache New Offline Audit
                  </button>
                </div>
              </div>

              {/* Bottom Speaker grill / home indicator */}
              <div className="w-28 h-1 bg-slate-800 rounded-full mx-auto mb-1 z-20" />
            </div>
          </div>

          {/* Educational Sidebar explanation & Control Toggle - Right (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-slate-50 dark:bg-[#1a2d38] p-6 rounded-3xl border border-[#90AEAD]/20 shadow-sm space-y-6">
              <h4 className="font-bold text-[#244855] dark:text-white text-lg">Network State Controller</h4>
              <p className="text-sm text-[#90AEAD] leading-relaxed">
                Use the toggle switch below to simulate cutting off mobile signal. Once offline, click <strong>"Cache New Offline Audit"</strong> on the phone mockup to log data locally. Then restore the connection to see the auto-sync system automatically process the queue.
              </p>

              {/* Toggle Switch */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-[#90AEAD]/10 max-w-sm">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Simulate Network:</span>
                <button
                  onClick={handleToggleNetwork}
                  className={`w-14 h-8 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                    isOnline ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
                  }`}
                  aria-label="Toggle network simulation"
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {isOnline ? (
                      <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </span>
                </button>
                <span className={`text-xs font-bold ${isOnline ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h5 className="font-bold text-base text-[#244855] dark:text-white">Smart SQLite Queuing</h5>
                <p className="text-xs text-[#90AEAD] leading-relaxed">
                  App contains a secure database that acts as a buffer. Metadata, location metrics, and form checklists are compiled into serialized blobs waiting for uplink.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-base text-[#244855] dark:text-white">Bandwidth Optimization</h5>
                <p className="text-xs text-[#90AEAD] leading-relaxed">
                  Uplink recovery uses compressed JSON chunks and checks signal strength to throttle heavy image syncs, preventing battery drainage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
