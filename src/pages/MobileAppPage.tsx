import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Wifi, WifiOff, MapPin, Camera, Play, ShieldAlert, Sparkles, Download, Scan, FileText } from 'lucide-react';

const MOBILE_FEATURES = [
  {
    icon: MapPin,
    title: 'Precision GPS Tracking',
    desc: 'Low-latency location capture running on background nodes. Fully optimized to reduce battery consumption by up to 60%.'
  },
  {
    icon: WifiOff,
    title: 'Offline Sync Operations',
    desc: 'Work seamless in tunnels, basements, or remote zones. Task data caches locally and syncs back when networking returns.'
  },
  {
    icon: FileText,
    title: 'OCR Digital Receipts',
    desc: 'Instantly capture and log travel expenses. OCR extracts vendor, date, and amount fields directly on the phone.'
  },
  {
    icon: Camera,
    title: 'Geofenced Photo Attendance',
    desc: 'Verify attendance with geolocation-stamped selfies. Prevent spoofing through location-match verification.'
  },
  {
    icon: Scan,
    title: 'Barcode & QR Scanner',
    desc: 'Scan asset serials, check-in packages, or verify delivery boxes directly with the smartphone camera. Zero lag.'
  },
  {
    icon: Smartphone,
    title: 'Native iOS & Android Codebase',
    desc: 'Fast, smooth native experiences on both platforms. Supports push alerts for urgent task assignments.'
  }
];

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState<'shift' | 'track' | 'ocr' | 'offline' | 'scan'>('shift');
  
  // Simulator States
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [tripStep, setTripStep] = useState(0);
  const [tripIntervalId, setTripIntervalId] = useState<any>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    return () => {
      if (tripIntervalId) clearInterval(tripIntervalId);
    };
  }, [tripIntervalId]);

  // Simulate Trip Tracking
  const startTripSimulation = () => {
    if (tripIntervalId) {
      clearInterval(tripIntervalId);
      setTripIntervalId(null);
      setTripStep(0);
      return;
    }
    setTripStep(1);
    const id = setInterval(() => {
      setTripStep((prev) => {
        if (prev >= 4) {
          clearInterval(id);
          setTripIntervalId(null);
          return 4;
        }
        return prev + 1;
      });
    }, 1500);
    setTripIntervalId(id);
  };

  // Simulate OCR Scan
  const triggerOcrScan = () => {
    setOcrStatus('scanning');
    setTimeout(() => {
      setOcrStatus('success');
    }, 2000);
  };

  // Simulate Barcode Scan
  const triggerBarcodeScan = () => {
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('success');
    }, 1800);
  };

  const resetOcr = () => setOcrStatus('idle');
  const resetScan = () => setScanStatus('idle');

  return (
    <main className="pt-20 bg-white dark:bg-[#0d1f28] text-[#244855] dark:text-white transition-colors duration-300">
      
      {/* 1. Hero Showcase */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-[#90AEAD]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E64833]/5 to-[#244855]/10 dark:from-transparent dark:to-[#244855]/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold">
                <Sparkles className="w-4 h-4" /> Force1 Field Agent App
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-[#244855] dark:text-white leading-tight">
                Run Your Operations <span className="text-[#E64833]">On the Go</span>
              </h1>
              <p className="text-base md:text-lg text-[#90AEAD] leading-relaxed max-w-2xl">
                The ultimate mobile companion for field agents. GPS dispatch, attendance checks, offline document capture, and live geo-routing—packed into a power-efficient, battery-smart app.
              </p>
              
              {/* App Badge Widgets */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Play Store */}
                <a href="#playstore" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#244855] text-white hover:bg-[#1a3340] border border-white/10 transition-all hover:scale-[1.02] shadow-force">
                  <Play className="w-6 h-6 fill-white text-white" />
                  <div className="text-left">
                    <span className="block text-[10px] text-[#90AEAD] uppercase tracking-wider font-semibold">Get it on</span>
                    <span className="block text-sm font-bold -mt-0.5">Google Play</span>
                  </div>
                </a>
                {/* App Store */}
                <a href="#appstore" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#244855] text-white hover:bg-[#1a3340] border border-white/10 transition-all hover:scale-[1.02] shadow-force">
                  <Smartphone className="w-6 h-6 text-white" />
                  <div className="text-left">
                    <span className="block text-[10px] text-[#90AEAD] uppercase tracking-wider font-semibold">Download on the</span>
                    <span className="block text-sm font-bold -mt-0.5">App Store</span>
                  </div>
                </a>
              </div>

              {/* Performance badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#90AEAD]/20 max-w-md">
                <div>
                  <h4 className="text-2xl font-bold text-[#E64833] font-mono">4.8 ★</h4>
                  <p className="text-[10px] text-[#90AEAD] uppercase tracking-wider font-semibold">Play Store rating</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#E64833] font-mono">4.9 ★</h4>
                  <p className="text-[10px] text-[#90AEAD] uppercase tracking-wider font-semibold">App Store rating</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#E64833] font-mono">&lt;20MB</h4>
                  <p className="text-[10px] text-[#90AEAD] uppercase tracking-wider font-semibold">Install size</p>
                </div>
              </div>
            </div>

            {/* Right Graphics Showcase */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Decorative Glow */}
              <div className="absolute w-72 h-72 bg-[#E64833]/10 rounded-full blur-3xl -z-10" />
              
              {/* High Fidelity Phone UI mockup */}
              <div className="relative w-72 h-[550px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
                {/* Speaker Grill & Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-2" />
                  <div className="w-12 h-1 bg-slate-950 rounded-full" />
                </div>
                
                {/* Simulated Phone Screen */}
                <div className="flex-1 bg-slate-900 rounded-[30px] p-4 pt-10 text-white font-sans flex flex-col justify-between overflow-hidden relative">
                  
                  {/* Status Bar */}
                  <div className="absolute top-2 left-6 right-6 flex justify-between items-center text-[10px] font-semibold text-slate-400">
                    <span>17:15</span>
                    <div className="flex items-center gap-1">
                      {isOffline ? <WifiOff className="w-3.5 h-3.5 text-red-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="font-mono">5G</span>
                      <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center"><div className="w-full h-full bg-slate-400 rounded-2xs" /></div>
                    </div>
                  </div>

                  {/* App Dashboard header */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mt-1">
                    <div>
                      <span className="text-[10px] text-[#90AEAD] uppercase tracking-wider block">Agent Portal</span>
                      <h4 className="font-bold text-sm">Force1 Mobile</h4>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${isShiftActive ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                  </div>

                  {/* Interactive Dynamic Phone Body based on ActiveTab tab selection */}
                  <div className="flex-1 py-4 overflow-y-auto space-y-3 scrollbar-none text-left">
                    
                    {activeTab === 'shift' && (
                      <div className="space-y-4 animate-scale-in">
                        <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800 text-center space-y-2">
                          <MapPin className={`w-10 h-10 mx-auto ${isShiftActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <h5 className="font-bold text-xs">Duty Shift Status</h5>
                          <p className="text-[10px] text-[#90AEAD]">
                            {isShiftActive ? 'GPS Beacon running on background node.' : 'Shift currently inactive. Toggle below to start tracking.'}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsShiftActive(!isShiftActive)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isShiftActive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#E64833] hover:bg-[#cc3d29]'
                          }`}
                        >
                          {isShiftActive ? 'End Duty Shift' : 'Start Duty Shift'}
                        </button>
                      </div>
                    )}

                    {activeTab === 'track' && (
                      <div className="space-y-3 animate-scale-in">
                        <h5 className="font-bold text-xs">Trip Route Tracer</h5>
                        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 relative h-32 flex items-center justify-center">
                          {/* Mini Map Line Trace SVG representation */}
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <path d="M10,50 L40,30 L60,40 L90,10" fill="none" stroke="#244855" strokeWidth="2" />
                            {tripStep >= 1 && <circle cx="10" cy="50" r="3" fill="#E64833" />}
                            {tripStep >= 2 && <circle cx="40" cy="30" r="3" fill="#E64833" />}
                            {tripStep >= 3 && <circle cx="60" cy="40" r="3" fill="#E64833" />}
                            {tripStep >= 4 && <circle cx="90" cy="10" r="3" fill="#E64833" />}
                            
                            {tripStep >= 1 && (
                              <path
                                d={`M10,50 ${tripStep >= 2 ? 'L40,30' : ''} ${tripStep >= 3 ? 'L60,40' : ''} ${tripStep >= 4 ? 'L90,10' : ''}`}
                                fill="none"
                                stroke="#E64833"
                                strokeWidth="2"
                              />
                            )}
                          </svg>
                          <span className="absolute bottom-2 right-2 text-[8px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[#90AEAD]">
                            Step: {tripStep}/4
                          </span>
                        </div>
                        <button
                          onClick={startTripSimulation}
                          className="w-full bg-[#E64833] py-2.5 rounded-xl text-xs font-bold text-center cursor-pointer"
                        >
                          {tripIntervalId ? 'Stop Simulation' : 'Start Route Tracer'}
                        </button>
                      </div>
                    )}

                    {activeTab === 'ocr' && (
                      <div className="space-y-3 animate-scale-in">
                        <h5 className="font-bold text-xs">OCR Travel Expense</h5>
                        <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800 min-h-[100px] flex flex-col justify-center text-center relative overflow-hidden">
                          {ocrStatus === 'idle' && (
                            <div className="space-y-1">
                              <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                              <p className="text-[9px] text-[#90AEAD]">Ready to capture fuel/meal bills</p>
                            </div>
                          )}
                          {ocrStatus === 'scanning' && (
                            <div className="space-y-2">
                              <div className="w-full h-1 bg-[#E64833] animate-pulse rounded-full" />
                              <p className="text-[9px] text-[#90AEAD] animate-pulse font-mono">Running OCR extraction...</p>
                            </div>
                          )}
                          {ocrStatus === 'success' && (
                            <div className="text-left space-y-1 text-[10px]">
                              <p className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Extraction Successful
                              </p>
                              <p className="text-slate-300 mt-1">Vendor: <span className="font-bold text-white">HP Fuel Station</span></p>
                              <p className="text-slate-300">Amount: <span className="font-bold text-white">₹1,250.00</span></p>
                              <p className="text-slate-300">Category: <span className="font-bold text-white">Fuel Allowance</span></p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={triggerOcrScan}
                            disabled={ocrStatus === 'scanning'}
                            className="flex-1 bg-[#E64833] py-2.5 rounded-xl text-xs font-bold text-center cursor-pointer disabled:opacity-50"
                          >
                            Capture Receipt
                          </button>
                          {ocrStatus === 'success' && (
                            <button onClick={resetOcr} className="bg-slate-800 px-3 py-2 rounded-xl text-[10px] cursor-pointer">
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'offline' && (
                      <div className="space-y-4 animate-scale-in">
                        <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800 text-center space-y-2">
                          {isOffline ? <WifiOff className="w-8 h-8 text-rose-500 mx-auto" /> : <Wifi className="w-8 h-8 text-emerald-400 mx-auto" />}
                          <h5 className="font-bold text-xs">{isOffline ? 'Offline Database Active' : 'Online Connection'}</h5>
                          <p className="text-[9px] text-[#90AEAD] leading-relaxed">
                            {isOffline
                              ? 'Cached Data: 4 Tasks, 12 GPS points stored. Ready to sync on restore.'
                              : 'Connected directly to F1 cloud server nodes.'}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsOffline(!isOffline)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isOffline ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                        >
                          {isOffline ? 'Restore Network' : 'Cut Internet Connection'}
                        </button>
                      </div>
                    )}

                    {activeTab === 'scan' && (
                      <div className="space-y-3 animate-scale-in">
                        <h5 className="font-bold text-xs">Barcode / QR Verification</h5>
                        <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800 min-h-[100px] flex flex-col justify-center text-center relative overflow-hidden">
                          {scanStatus === 'idle' && (
                            <div className="space-y-1">
                              <Scan className="w-8 h-8 text-slate-500 mx-auto" />
                              <p className="text-[9px] text-[#90AEAD]">Place serial number barcode in camera view</p>
                            </div>
                          )}
                          {scanStatus === 'scanning' && (
                            <div className="space-y-2 relative">
                              <div className="absolute inset-0 bg-[#E64833]/5 border-2 border-dashed border-[#E64833]/40 rounded-lg animate-pulse" />
                              <p className="text-[9px] text-[#90AEAD] animate-pulse font-mono z-10 relative">Initializing camera nodes...</p>
                            </div>
                          )}
                          {scanStatus === 'success' && (
                            <div className="text-left space-y-1 text-[10px]">
                              <p className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Scan Matches Roster ID
                              </p>
                              <p className="text-slate-300 mt-1">Item: <span className="font-bold text-white">Smart Meter Alpha V2</span></p>
                              <p className="text-slate-300">Serial Code: <span className="font-bold text-white font-mono">F1-METER-9831A</span></p>
                              <p className="text-slate-300">Status: <span className="text-emerald-400 font-bold">Verified & Dispatched</span></p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={triggerBarcodeScan}
                            disabled={scanStatus === 'scanning'}
                            className="flex-1 bg-[#E64833] py-2.5 rounded-xl text-xs font-bold text-center cursor-pointer disabled:opacity-50"
                          >
                            Scan Barcode
                          </button>
                          {scanStatus === 'success' && (
                            <button onClick={resetScan} className="bg-slate-800 px-3 py-2 rounded-xl text-[10px] cursor-pointer">
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* App navigation tab buttons */}
                  <div className="border-t border-slate-800 pt-3 grid grid-cols-5 text-center text-slate-500">
                    {[
                      { id: 'shift', icon: MapPin, label: 'Shift' },
                      { id: 'track', icon: Play, label: 'Track' },
                      { id: 'ocr', icon: FileText, label: 'OCR' },
                      { id: 'offline', icon: Wifi, label: 'Sync' },
                      { id: 'scan', icon: Scan, label: 'Scan' }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isSelected = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex flex-col items-center gap-0.5 focus:outline-none cursor-pointer ${
                            isSelected ? 'text-[#E64833]' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                          <span className="text-[7.5px] font-semibold">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Simulator Explanation */}
      <section className="py-12 bg-slate-50 dark:bg-[#152731]/50 border-b border-[#90AEAD]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold font-display text-[#244855] dark:text-white mb-2">
            Try the Live Simulator Above
          </h3>
          <p className="text-sm text-[#90AEAD] leading-relaxed max-w-2xl mx-auto">
            Interact with the phone tabs and buttons to preview essential modules. The agent app handles offline caching, OCR receipt scanning, barcode dispatch checks, and geolocation logging in the background.
          </p>
        </div>
      </section>

      {/* 3. Key Mobile Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-[#244855] dark:text-white">
            Built for High-Velocity <span className="text-[#E64833]">Field Operations</span>
          </h2>
          <p className="text-sm text-[#90AEAD] mt-2">
            Everything your field service representatives, delivery drivers, and inspectors need to record work, offline or online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOBILE_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-base p-6 hover:-translate-y-1.5 transition-transform duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E64833]/15 text-[#E64833] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-[#244855] dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-[#90AEAD] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Safety & Security Card */}
      <section className="py-16 bg-[#E64833]/5 dark:bg-[#E64833]/10 border-y border-[#E64833]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-14 h-14 bg-[#E64833] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="text-left space-y-1">
            <h4 className="text-xl font-bold font-display text-[#244855] dark:text-white">
              Secured with Local Encryption & Geofences
            </h4>
            <p className="text-sm text-[#90AEAD] leading-relaxed">
              We encrypt stored data locally on the agent's phone using AES-256 standards before syncing. Face attendance and geofence locations are matched on the server nodes, preventing spoofing attempts.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Downloads CTA */}
      <section className="py-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl my-16 bg-[#244855] text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#244855] to-[#E64833]/20" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
            Download the <span className="text-[#E64833]">Mobile App</span> Today
          </h2>
          <p className="max-w-md mx-auto text-sm text-[#90AEAD]">
            Compatible with Android 8.0+ and iOS 14.0+. Scan the code or download directly from official marketplaces.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#playstore" className="btn-accent px-6 py-3.5 rounded-xl font-bold flex items-center gap-2">
              <Download className="w-4.5 h-4.5" /> Android APK / Play Store
            </a>
            <a href="#appstore" className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all min-h-[44px]">
              <Download className="w-4.5 h-4.5" /> iOS App Store Link
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
