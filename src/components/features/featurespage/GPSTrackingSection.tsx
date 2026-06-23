import { useState, useEffect } from 'react';
import { Map, Navigation, Bell, Shield, Info, Play, Pause, RefreshCw } from 'lucide-react';

const TRACKING_AGENTS = [
  { id: 1, name: 'Rahul Sharma', status: 'On Route', address: 'Connaught Place, New Delhi', lat: 60, lng: 120, speed: '24 km/h', phone: '+91 98765 43210' },
  { id: 2, name: 'Amit Roy', status: 'Inside Geofence', address: 'Okhla Phase 3, New Delhi', lat: 210, lng: 290, speed: '0 km/h (Idle)', phone: '+91 99112 23344' },
  { id: 3, name: 'Vikram Singh', status: 'Completed', address: 'Gurugram Sector 45', lat: 150, lng: 450, speed: '45 km/h', phone: '+91 95550 12345' },
];

export default function GPSTrackingSection() {
  const [activeAgent, setActiveAgent] = useState(TRACKING_AGENTS[0]);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [agentProgress, setAgentProgress] = useState(0.2); // fraction along path
  const [isPlaying, setIsPlaying] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([
    '14:32: Agent Rahul Sharma started route #204',
    '14:35: Agent Amit Roy entered Geofence "Okhla Hub"',
    '14:36: Geofence alert trigger: Vikram Singh left Sector 45 Zone',
  ]);

  // Route coordination points
  // Path for Rahul Sharma: (100, 50) -> (220, 90) -> (320, 180) -> (420, 100)
  const routePoints = [
    { x: 100, y: 80 },
    { x: 200, y: 60 },
    { x: 300, y: 130 },
    { x: 260, y: 220 },
    { x: 400, y: 260 },
  ];

  // Calculate current point along the route based on progress
  const getInterpolatedPoint = (prog: number) => {
    const numSegments = routePoints.length - 1;
    const scaledProg = prog * numSegments;
    const segmentIndex = Math.min(Math.floor(scaledProg), numSegments - 1);
    const segmentProg = scaledProg - segmentIndex;

    const start = routePoints[segmentIndex];
    const end = routePoints[segmentIndex + 1];

    return {
      x: start.x + (end.x - start.x) * segmentProg,
      y: start.y + (end.y - start.y) * segmentProg,
    };
  };

  const currentPoint = getInterpolatedPoint(agentProgress);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAgentProgress((prev) => {
        const next = prev + 0.015;
        if (next >= 1) {
          // Reset progress and log warning
          setAlerts((a) => [
            `14:39: Agent Rahul Sharma completed Route #204`,
            ...a.slice(0, 4),
          ]);
          return 0;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const addAlert = (msg: string) => {
    setAlerts((prev) => [`${new Date().toTimeString().split(' ')[0].slice(0, 5)}: ${msg}`, ...prev.slice(0, 4)]);
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0d1f28] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <Map className="w-4 h-4" /> Live Tracking System
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Real-Time GPS Operations
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Gain absolute visibility over your field workforce with hyper-precise location logs, Geofencing breach alarms, and breadcrumb route optimization.
          </p>
        </div>

        {/* Section Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Map Showcase - Left (7 Columns) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-force-lg relative min-h-[500px]">
            {/* Header / Controls */}
            <div className="p-4 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-3.5 w-3.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-white text-sm">Force1 Map Engine (Live Simulator)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all min-h-[38px] flex items-center justify-center"
                  title={isPlaying ? 'Pause Simulation' : 'Start Simulation'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => {
                    setAgentProgress(0);
                    addAlert('Simulated agent route reset');
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all min-h-[38px] flex items-center justify-center"
                  title="Reset Simulation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SVG Simulator Map Area */}
            <div className="relative flex-1 bg-[#1a2e38] overflow-hidden min-h-[360px]">
              <svg viewBox="0 0 500 350" className="w-full h-full select-none">
                {/* Background Roads Grid */}
                <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="2">
                  <line x1="0" y1="50" x2="500" y2="50" />
                  <line x1="0" y1="120" x2="500" y2="120" />
                  <line x1="0" y1="200" x2="500" y2="200" />
                  <line x1="0" y1="280" x2="500" y2="280" />
                  <line x1="80" y1="0" x2="80" y2="350" />
                  <line x1="180" y1="0" x2="180" y2="350" />
                  <line x1="280" y1="0" x2="280" y2="350" />
                  <line x1="380" y1="0" x2="380" y2="350" />
                </g>

                {/* Major Roads */}
                <g stroke="#244855" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                  {/* Route 1 */}
                  <path d="M 50,20 L 150,80 L 250,80 L 350,150 L 480,120" fill="none" />
                  {/* Route 2 */}
                  <path d="M 100,80 L 200,60 L 300,130 L 260,220 L 400,260 L 450,330" fill="none" />
                  {/* Crossroad */}
                  <path d="M 280,0 L 280,350" fill="none" />
                </g>

                {/* Parks / Waterbodies */}
                <rect x="320" y="20" width="120" height="70" rx="10" fill="#90AEAD" fillOpacity="0.1" />
                <circle cx="80" cy="280" r="40" fill="#90AEAD" fillOpacity="0.08" />

                {/* Geofence Overlay Circles */}
                {showGeofences && (
                  <g>
                    {/* Okhla Hub */}
                    <circle cx="280" cy="200" r="55" fill="#E64833" fillOpacity="0.15" stroke="#E64833" strokeWidth="1.5" strokeDasharray="3,3" />
                    <text x="280" y="165" fill="#EBE9D0" fontSize="10" textAnchor="middle" fontWeight="bold">
                      Okhla Safe Zone
                    </text>

                    {/* Outer Geofence Zone */}
                    <circle cx="100" cy="100" r="45" fill="#874F41" fillOpacity="0.1" stroke="#874F41" strokeWidth="1" strokeDasharray="4,4" />
                    <text x="100" y="75" fill="#90AEAD" fontSize="9" textAnchor="middle">
                      Zone A Limit
                    </text>
                  </g>
                )}

                {/* Route Breadcrumb History */}
                {showRoutes && (
                  <g>
                    {/* Simulated Path Line */}
                    <path
                      d="M 100,80 L 200,60 L 300,130 L 260,220 L 400,260"
                      fill="none"
                      stroke="#E64833"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />
                    {/* Breadcrumbs (small dots) */}
                    {routePoints.map((pt, idx) => (
                      <circle key={idx} cx={pt.x} cy={pt.y} r="3" fill="#E64833" />
                    ))}
                  </g>
                )}

                {/* Static Agents */}
                {/* Agent Amit */}
                <g transform="translate(290, 210)">
                  <circle cx="0" cy="0" r="6" fill="#874F41" className="animate-pulse" />
                  {showLabels && (
                    <text x="10" y="4" fill="white" fontSize="9" fontWeight="semibold">
                      Amit R.
                    </text>
                  )}
                </g>

                {/* Agent Vikram */}
                <g transform="translate(150, 150)">
                  <circle cx="0" cy="0" r="6" fill="#90AEAD" />
                  {showLabels && (
                    <text x="10" y="4" fill="white" fontSize="9">
                      Vikram S.
                    </text>
                  )}
                </g>

                {/* Active Simulated Moving Agent - Rahul */}
                <g transform={`translate(${currentPoint.x}, ${currentPoint.y})`}>
                  {/* Ping effect */}
                  <circle cx="0" cy="0" r="12" fill="#E64833" fillOpacity="0.3" className="animate-ping" style={{ animationDuration: '2s' }} />
                  {/* Pulse Center */}
                  <circle cx="0" cy="0" r="7" fill="#E64833" stroke="white" strokeWidth="1.5" />
                  {/* Direction pointer */}
                  <polygon points="0,-4 3,3 0,1 -3,3" fill="white" transform="rotate(75)" />

                  {showLabels && (
                    <g transform="translate(-30, -32)">
                      <rect x="0" y="0" width="60" height="18" rx="4" fill="rgba(0,0,0,0.85)" stroke="#E64833" strokeWidth="0.75" />
                      <text x="30" y="11" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">
                        Rahul S. (24 km/h)
                      </text>
                    </g>
                  )}
                </g>
              </svg>

              {/* Float Card Info */}
              <div className="absolute bottom-4 left-4 bg-slate-950/85 text-white p-3 rounded-xl border border-slate-800 backdrop-blur max-w-xs text-xs space-y-1 z-10">
                <p className="font-bold text-sm text-[#FBE9D0] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#E64833] animate-bounce" /> Selected Tracker
                </p>
                <div className="space-y-0.5">
                  <p><span className="text-[#90AEAD]">Agent:</span> {activeAgent.name}</p>
                  <p><span className="text-[#90AEAD]">Speed:</span> {activeAgent.id === 1 ? '24 km/h' : activeAgent.speed}</p>
                  <p><span className="text-[#90AEAD]">Current Loc:</span> {activeAgent.id === 1 ? 'Ring Road, Delhi' : activeAgent.address}</p>
                  <p><span className="text-[#90AEAD]">Battery:</span> 84% • GPS Lock: Strong</p>
                </div>
              </div>
            </div>

            {/* Map Layers Toggles */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-semibold text-[#90AEAD]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showGeofences}
                  onChange={(e) => setShowGeofences(e.target.checked)}
                  className="rounded border-slate-800 text-[#E64833] focus:ring-0 bg-slate-900 w-4 h-4"
                />
                Show Geofence Zones
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showRoutes}
                  onChange={(e) => setShowRoutes(e.target.checked)}
                  className="rounded border-slate-800 text-[#E64833] focus:ring-0 bg-slate-900 w-4 h-4"
                />
                Route Breadcrumbs
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded border-slate-800 text-[#E64833] focus:ring-0 bg-slate-900 w-4 h-4"
                />
                Agent Head Labels
              </label>
            </div>
          </div>

          {/* Right Details & Alerts Feed - (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {/* Agent Select Cards */}
            <div className="space-y-3.5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#90AEAD] mb-2 flex items-center gap-2">
                <Map className="w-4 h-4" /> Live Field Force List
              </h4>
              {TRACKING_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setActiveAgent(agent);
                    addAlert(`Selected ${agent.name} tracking details`);
                  }}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer min-h-[72px] ${
                    activeAgent.id === agent.id
                      ? 'bg-[#244855] text-white border-transparent shadow-force'
                      : 'bg-white dark:bg-[#1a2d38] border-[#90AEAD]/20 hover:border-[#90AEAD]/50 text-[#244855] dark:text-white'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-2 text-sm md:text-base">
                      {agent.name}
                      {agent.id === 1 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        activeAgent.id === agent.id ? 'text-[#90AEAD]' : 'text-slate-400 dark:text-[#90AEAD]/75'
                      }`}
                    >
                      {agent.address}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                      agent.status === 'On Route'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : agent.status === 'Inside Geofence'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {agent.status}
                  </span>
                </button>
              ))}
            </div>

            {/* Geofence Breach Alarms Feed */}
            <div className="bg-[#FBE9D0]/30 dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-5 flex-1 flex flex-col">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#874F41] dark:text-[#90AEAD] mb-3.5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#E64833] animate-swing" /> Operations Alert Center
              </h4>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] text-xs">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-2 animate-fade-in"
                  >
                    {alert.includes('alert') || alert.includes('entered') ? (
                      <Shield className="w-4.5 h-4.5 text-[#E64833] flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4.5 h-4.5 text-[#244855] dark:text-[#90AEAD] flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-700 dark:text-slate-200">{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
