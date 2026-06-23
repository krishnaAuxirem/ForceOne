import { useState, useEffect } from 'react';
import {
  Map, MapPin, Navigation, Clock, ShieldAlert, Plus, Trash2, Check, X,
  FileText, Activity, AlertCircle, RefreshCw, Compass, Play, Pause, RotateCw,
  Search, ArrowUpDown, ChevronLeft, ChevronRight, Phone, Send, Info, Eye, Layers, Users
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { toast } from 'sonner';

// Mock Data
const CITIES_DATA = {
  Delhi: { color: '#E64833' },
  Mumbai: { color: '#90AEAD' },
  Bangalore: { color: '#874F41' },
  Chennai: { color: '#90AEAD' },
  Pune: { color: '#244855' },
  Hyderabad: { color: '#E64833' },
};

const MOCK_AGENTS = [
  { id: '1', name: 'Rahul Sharma', status: 'Online', territory: 'Delhi NCR', battery: 84, lastCheckIn: '15:02', task: 'Fiber Node Audit', lat: 55, lng: 95, speed: '24 km/h' },
  { id: '2', name: 'Sneha Desai', status: 'Online', territory: 'Mumbai South', battery: 62, lastCheckIn: '14:58', task: 'POS Installation', lat: 120, lng: 68, speed: '12 km/h' },
  { id: '3', name: 'Kiran Joshi', status: 'Idle', territory: 'Bangalore East', battery: 45, lastCheckIn: '15:10', task: 'In-Store Branding', lat: 165, lng: 93, speed: '0 km/h' },
  { id: '4', name: 'Meera Nair', status: 'Offline', territory: 'Chennai North', battery: 92, lastCheckIn: '13:40', task: 'None', lat: 165, lng: 112, speed: '--' },
  { id: '5', name: 'Vikram Seth', status: 'Alert', territory: 'Pune Hub', battery: 18, lastCheckIn: '15:05', task: 'Router Replacement', lat: 130, lng: 78, speed: '38 km/h' },
  { id: '6', name: 'Aditya Rao', status: 'Online', territory: 'Hyderabad City', battery: 78, lastCheckIn: '15:00', task: 'Warehouse Stock audit', lat: 135, lng: 105, speed: '18 km/h' },
  { id: '7', name: 'Priyesh Mishra', status: 'Online', territory: 'Delhi NCR', battery: 90, lastCheckIn: '15:11', task: 'Client Site Inspection', lat: 52, lng: 92, speed: '45 km/h' },
  { id: '8', name: 'Neha Gupta', status: 'Idle', territory: 'Mumbai South', battery: 33, lastCheckIn: '14:45', task: 'Client Presentation', lat: 122, lng: 66, speed: '0 km/h' },
];

const MOCK_GEOFENCES = [
  { id: 'gf1', name: 'Delhi safe Zone', radius: 500, activeAgents: 2, status: 'Active', color: '#E64833' },
  { id: 'gf2', name: 'Mumbai Retail Hub', radius: 800, activeAgents: 1, status: 'Active', color: '#90AEAD' },
  { id: 'gf3', name: 'Bangalore Tech Park', radius: 1000, activeAgents: 1, status: 'Warning', color: '#874F41' },
];

const WEEKLY_MILEAGE = [
  { name: 'Mon', mileage: 1240, tasks: 92 },
  { name: 'Tue', mileage: 1450, tasks: 98 },
  { name: 'Wed', mileage: 1390, tasks: 104 },
  { name: 'Thu', mileage: 1560, tasks: 112 },
  { name: 'Fri', mileage: 1680, tasks: 120 },
  { name: 'Sat', mileage: 820, tasks: 45 },
  { name: 'Sun', mileage: 410, tasks: 20 },
];

const STATUS_PIE = [
  { name: 'Online', value: 5, color: '#E64833' },
  { name: 'Idle', value: 2, color: '#90AEAD' },
  { name: 'Offline', value: 1, color: '#874F41' },
  { name: 'Alert', value: 1, color: '#244855' },
];

const RECENT_FEEDS = [
  { time: '15:12', log: 'Agent Priyesh Mishra checked in at CP Node (Delhi NCR)' },
  { time: '15:10', log: 'Agent Kiran Joshi entered geofence "Bangalore Tech Park"' },
  { time: '15:08', log: 'Boundary Breach: Vikram Seth left Pune Hub Zone (Battery Low)' },
  { time: '15:05', log: 'Agent Sneha Desai uploaded client delivery proof packet' },
  { time: '14:58', log: 'Agent Aditya Rao submitted monthly stock sheet' },
];

export default function TrackingPage() {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [geofences, setGeofences] = useState(MOCK_GEOFENCES);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'battery'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Playback Simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0.2); // fraction (0 to 1)
  const [selectedAgentId, setSelectedAgentId] = useState('1');

  // Modal states
  const [modalOpen, setModalOpen] = useState<'territory' | 'geofence' | 'export' | 'download' | null>(null);
  const [newFenceName, setNewFenceName] = useState('');
  const [newFenceRadius, setNewFenceRadius] = useState('500');
  const [newFenceCity, setNewFenceCity] = useState('Delhi');
  
  const [assignName, setAssignName] = useState('Rahul Sharma');
  const [assignTerritory, setAssignTerritory] = useState('Mumbai South');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Route playback interpolation points
  const DelhiRoutePoints = [
    { x: 95, y: 55 },
    { x: 105, y: 65 },
    { x: 90, y: 80 },
    { x: 80, y: 75 },
    { x: 68, y: 120 } // leads to Mumbai
  ];

  const getInterpolatedPoint = (prog: number) => {
    const segments = DelhiRoutePoints.length - 1;
    const scaled = prog * segments;
    const idx = Math.min(Math.floor(scaled), segments - 1);
    const segProg = scaled - idx;
    const start = DelhiRoutePoints[idx];
    const end = DelhiRoutePoints[idx + 1];
    return {
      x: start.x + (end.x - start.x) * segProg,
      y: start.y + (end.y - start.y) * segProg,
    };
  };

  const currentPlaypoint = getInterpolatedPoint(playbackProgress);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackProgress((prev) => {
        const next = prev + 0.02;
        if (next >= 1) {
          toast.success(`Simulation completed: ${selectedAgent.name} finished route trace.`);
          return 0;
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying, selectedAgent]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('GPS control board synced successfully.');
    }, 1000);
  };

  // Filter & Search Logic
  const filteredAgents = agents
    .filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.task.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchCity = !selectedCity || a.territory.toLowerCase().includes(selectedCity.toLowerCase()) || (selectedCity === 'Hyderabad' && a.territory.includes('Hyderabad')) || (selectedCity === 'Pune' && a.territory.includes('Pune')) || (selectedCity === 'Bangalore' && a.territory.includes('Bangalore')) || (selectedCity === 'Chennai' && a.territory.includes('Chennai'));
      return matchSearch && matchStatus && matchCity;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'battery') {
        comparison = a.battery - b.battery;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const handleSort = (field: 'name' | 'battery') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleAddGeofence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFenceName) {
      toast.error('Please enter geofence name');
      return;
    }
    const newFence = {
      id: Date.now().toString(),
      name: newFenceName,
      radius: parseInt(newFenceRadius),
      activeAgents: 0,
      status: 'Active',
      color: '#E64833',
    };
    setGeofences([...geofences, newFence]);
    setNewFenceName('');
    setModalOpen(null);
    toast.success(`Geofence region "${newFenceName}" deployed successfully.`);
  };

  const handleAssignTerritory = (e: React.FormEvent) => {
    e.preventDefault();
    setAgents(
      agents.map((a) => (a.name === assignName ? { ...a, territory: assignTerritory } : a))
    );
    setModalOpen(null);
    toast.success(`Assigned ${assignName} to territory: ${assignTerritory}`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#244855] dark:text-white pb-12">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <RotateCw className="w-10 h-10 text-[#E64833] animate-spin mb-4" />
          <p className="font-bold text-sm tracking-wider uppercase text-[#244855] dark:text-white">Syncing Control Center...</p>
        </div>
      )}

      {/* SECTION 1: HEADER PANEL */}
      <div className="bg-gradient-to-r from-[#244855] via-[#E64833]/80 to-[#874F41] rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Compass className="w-6 h-6 text-[#FBE9D0] animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">Live GPS Tracking Center</h1>
          </div>
          <p className="text-white/70 text-sm">Real-time coordinates logging, geofenced area creation, and agent route traces.</p>
        </div>
        <div className="flex items-center gap-3.5 text-xs">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#FBE9D0]/80 block">Last Synchronized</span>
            <span className="font-mono text-white font-bold text-sm">15:12 PM</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-lg"
            title="Force refresh coordinates"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* SECTION 6: TRACKING OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trackers', value: '250 Agents', sub: 'Online: 184', icon: Users, color: 'bg-[#244855]' },
          { label: 'Active Routes', value: '74 Paths', sub: 'Avg speed: 28 km/h', icon: Navigation, color: 'bg-[#90AEAD]' },
          { label: 'Violations Logged', value: '4 Breaches', sub: '3 unresolved warnings', icon: ShieldAlert, color: 'bg-[#874F41]' },
          { label: 'SLA Success Rate', value: '98.4%', sub: '94% on-site verified', icon: Check, color: 'bg-emerald-500' },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="card-base p-5 hover:shadow-card-hover transition-all border border-[#90AEAD]/10 hover:border-[#244855]/20 group"
            >
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{s.value}</p>
              <p className="text-sm font-semibold text-[#244855]/85 dark:text-[#90AEAD]">{s.label}</p>
              <p className="text-xs text-[#90AEAD]/80 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: KPI CARDS WITH SPARKLINE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Duty Rota', value: '184 Reps', trend: '+4.2%', points: '10,12,18,14,24,19,25', color: '#E64833' },
          { label: 'Average Travel', value: '14.5 Km/d', trend: '-2.4%', points: '24,20,18,22,14,12,9', color: '#90AEAD' },
          { label: 'Tasks in Progress', value: '92 Active', trend: '+12%', points: '8,14,19,22,25,32,45', color: '#874F41' },
          { label: 'Response Latency', value: '1.2 Mins', trend: '-18%', points: '25,20,15,14,10,8,6', color: '#244855' },
        ].map((card, idx) => (
          <div
            key={idx}
            className="card-base p-5 border border-[#90AEAD]/10 hover:border-[#244855]/20 hover:shadow-card-hover transition-all relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{card.value}</p>
                <p className="text-sm font-semibold text-[#244855]/85 dark:text-[#90AEAD]">{card.label}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                card.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
              }`}>
                {card.trend}
              </span>
            </div>
            {/* Sparkline chart SVG */}
            <div className="h-10 mt-4 border-t border-[#90AEAD]/10 pt-2">
              <svg viewBox="0 0 100 20" className="w-full h-full">
                <path
                  d={`M ${card.points.split(',').map((p, i) => `${(i / 6) * 100},${20 - parseInt(p)}`).join(' L ')}`}
                  fill="none"
                  stroke={card.color}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* MAP AND ROUTE HISTORY SECTION */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SECTION 3: LARGE INTERACTIVE MAP (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col card-base border border-[#90AEAD]/10 overflow-hidden relative min-h-[500px]">
          {/* Header controls inside map */}
          <div className="px-6 py-4 bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 flex items-center justify-between z-10 flex-wrap gap-2 text-[#244855] dark:text-white">
            <h3 className="font-bold text-[#244855] dark:text-white font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E64833] animate-pulse" /> Operations Map Display
            </h3>
            
            {/* Playback Simulation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#244855] border border-[#90AEAD]/20 hover:bg-[#90AEAD]/10 text-xs font-bold flex items-center gap-1 min-h-[34px] cursor-pointer shadow-sm text-[#244855] dark:text-white"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {isPlaying ? 'Pause' : 'Play Sim'}
              </button>
              <button
                onClick={() => {
                  setPlaybackProgress(0);
                  toast.success('Simulation coordinates reset');
                }}
                className="p-2 rounded-xl bg-white dark:bg-[#244855] border border-[#90AEAD]/20 hover:bg-[#90AEAD]/10 transition-all text-xs font-semibold min-h-[34px] flex items-center justify-center cursor-pointer shadow-sm text-[#244855] dark:text-white"
                title="Reset simulation"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* India SVG Map Area (Isolated Dark Center) */}
          <div className="relative flex-1 bg-[#0d1f28] overflow-hidden flex items-center justify-center p-6 min-h-[360px]">
            {/* Abstract radar overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />

            <svg viewBox="0 0 200 200" className="w-full max-w-[340px] h-auto select-none opacity-90">
              {/* Connection Paths between cities */}
              <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="2,2">
                <line x1="95" y1="55" x2="68" y2="120" />
                <line x1="95" y1="55" x2="93" y2="165" />
                <line x1="95" y1="55" x2="105" y2="135" />
                <line x1="68" y1="120" x2="78" y2="130" />
                <line x1="68" y1="120" x2="93" y2="165" />
                <line x1="112" y1="165" x2="93" y2="165" />
              </g>

              {/* Geographic abstract shape */}
              <polygon
                points="95,20 110,35 125,50 140,80 120,110 122,140 115,160 112,175 95,190 90,170 82,150 78,138 65,125 58,110 70,80 82,60 90,40"
                fill="none"
                stroke="#244855"
                strokeWidth="1.5"
                opacity="0.3"
              />

              {/* Active geofence circles overlays on Map */}
              {geofences.map((gf, idx) => {
                const positions = [
                  { cx: 95, cy: 55 },
                  { cx: 68, cy: 120 },
                  { cx: 93, cy: 165 }
                ];
                const pos = positions[idx] || { cx: 100, cy: 100 };
                return (
                  <circle
                    key={gf.id}
                    cx={pos.cx}
                    cy={pos.cy}
                    r={gf.radius / 35}
                    fill={gf.color}
                    fillOpacity="0.1"
                    stroke={gf.color}
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* Route line for Rahul Sharma simulation (Delhi NCR route) */}
              <path
                d="M 95,55 L 105,65 L 90,80 L 80,75 L 68,120"
                fill="none"
                stroke="#E64833"
                strokeWidth="1.2"
                strokeDasharray="2,2"
                opacity="0.6"
              />

              {/* Moving Playback Agent Marker */}
              {selectedAgentId === '1' && (
                <g transform={`translate(${currentPlaypoint.x}, ${currentPlaypoint.y})`}>
                  <circle cx="0" cy="0" r="8" fill="#E64833" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="0" cy="0" r="4.5" fill="#E64833" stroke="white" strokeWidth="0.8" />
                </g>
              )}

              {/* Static pulsing city coordinates pins */}
              {[
                { name: 'Delhi', cx: 95, cy: 55 },
                { name: 'Mumbai', cx: 68, cy: 120 },
                { name: 'Pune', cx: 78, cy: 130 },
                { name: 'Bangalore', cx: 93, cy: 165 },
                { name: 'Chennai', cx: 112, cy: 165 },
                { name: 'Hyderabad', cx: 105, cy: 135 },
              ].map((city) => {
                const isActiveFilter = selectedCity === city.name;
                const details = CITIES_DATA[city.name as keyof typeof CITIES_DATA] || { color: '#90AEAD' };
                return (
                  <g key={city.name} className="cursor-pointer" onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}>
                    <circle cx={city.cx} cy={city.cy} r={isActiveFilter ? 6 : 4} fill={details.color} />
                    <circle cx={city.cx} cy={city.cy} r={isActiveFilter ? 12 : 8} fill={details.color} fillOpacity="0.1" />
                    <text x={city.cx} y={city.cy - 7} fill={isActiveFilter ? '#E64833' : '#90AEAD'} fontSize="6" fontWeight="bold" textAnchor="middle">
                      {city.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Float HUD details */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-white/10 p-4.5 rounded-2xl backdrop-blur-md text-xs space-y-2 z-10 shadow-lg max-w-[240px] text-white">
              <span className="font-bold text-[#FBE9D0] uppercase tracking-wider block">Playback Inspector</span>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <p><span className="text-[#90AEAD]">Agent:</span> {selectedAgent.name}</p>
                <p><span className="text-[#90AEAD]">Territory:</span> {selectedAgent.territory}</p>
                <p><span className="text-[#90AEAD]">Active Task:</span> {selectedAgent.task}</p>
                <p><span className="text-[#90AEAD]">Sim Speed:</span> {isPlaying ? 'Playback 1.5x' : 'Paused'}</p>
              </div>
            </div>
          </div>

          {/* Filter badge indicators */}
          {selectedCity && (
            <div className="absolute bottom-4 right-4 z-10 bg-[#E64833]/15 text-[#E64833] border border-[#E64833]/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <span>Filtered City: {selectedCity}</span>
              <button onClick={() => setSelectedCity(null)} className="hover:text-white cursor-pointer font-bold">×</button>
            </div>
          )}
        </div>

        {/* SECTION 5: ROUTE HISTORY TIMELINE (5 Columns) */}
        <div className="lg:col-span-5 card-base border border-[#90AEAD]/10 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E64833]" /> Route Tracer Timeline
            </h3>
            <p className="text-xs text-[#90AEAD] mb-4">Select a representative below to trace their chronological coordinates logs.</p>

            <select
              value={selectedAgentId}
              onChange={(e) => {
                setSelectedAgentId(e.target.value);
                setPlaybackProgress(0);
                toast.info(`Switched playback to ${agents.find(a => a.id === e.target.value)?.name}`);
              }}
              className="input-field mb-4 py-2 px-3 text-xs bg-white dark:bg-slate-900 border-[#90AEAD]/30 text-[#244855] dark:text-white min-h-[38px] cursor-pointer"
            >
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <div className="border-l-2 border-[#E64833]/30 pl-4 space-y-3.5 py-1 text-xs">
              {[
                { time: '09:00 AM', node: 'Clocked-In: Delhi Office Terminal', status: 'On-site' },
                { time: '10:45 AM', node: 'Visit Check-in: Airtel Plaza CP', status: 'SLA Met' },
                { time: '01:30 PM', node: 'Fuel Claim Logged: HP Outlet CP', status: 'Auto Audited' },
                { time: '03:10 PM', node: 'Route End: Warehouse Depot NCR', status: 'Active' },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#E64833]" />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs text-[#244855] dark:text-white font-semibold">{step.node}</p>
                      <p className="text-[10px] text-[#90AEAD] mt-0.5">Logged: {step.time}</p>
                    </div>
                    <span className="text-[9px] bg-slate-50 dark:bg-white/5 border border-[#90AEAD]/10 px-2 py-0.5 rounded font-bold text-[#90AEAD] uppercase">
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#90AEAD]/10 mt-6 text-[10px] text-[#90AEAD] flex justify-between font-semibold">
            <span>Distance Logged: <strong>18.4 Km</strong></span>
            <span>Speed average: <strong>24 km/h</strong></span>
          </div>
        </div>

      </div>

      {/* SECTION 4: LIVE AGENT TRACKING TABLE */}
      <div className="card-base border border-[#90AEAD]/10 p-6 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display">Live Agent Tracking Roster</h3>
            <p className="text-xs text-[#90AEAD] mt-0.5">Filter, search, and sort ground rep status codes.</p>
          </div>

          {/* Table Toolbar */}
          <div className="flex flex-wrap items-center gap-3.5 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#90AEAD] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search agent name or task..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border-[#90AEAD]/30 text-[#244855] dark:text-white min-h-[38px] placeholder-[#90AEAD]/75"
              />
            </div>
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field py-2 px-3 text-xs bg-white dark:bg-slate-900 border-[#90AEAD]/30 text-[#244855] dark:text-white min-h-[38px] cursor-pointer font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Idle">Idle</option>
              <option value="Offline">Offline</option>
              <option value="Alert">Alert</option>
            </select>
            {/* Sort Toggle */}
            <button
              onClick={() => handleSort(sortBy === 'name' ? 'battery' : 'name')}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-[#90AEAD]/30 hover:bg-[#90AEAD]/10 rounded-xl transition-all min-h-[38px] flex items-center gap-1.5 cursor-pointer font-bold text-[#244855] dark:text-white shadow-sm"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#E64833]" />
              Sort by: {sortBy === 'name' ? 'Name' : 'Battery'} ({sortOrder.toUpperCase()})
            </button>
          </div>
        </div>

        {/* Table Roster View */}
        <div className="overflow-x-auto">
          {currentItems.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 text-xs font-bold uppercase tracking-wider text-[#90AEAD]">
                  <th className="px-5 py-4">Agent Name</th>
                  <th className="px-5 py-4">Territory</th>
                  <th className="px-5 py-4">Active Task</th>
                  <th className="px-5 py-4">Battery</th>
                  <th className="px-5 py-4">Speed</th>
                  <th className="px-5 py-4">Last Check-in</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#90AEAD]/10 font-semibold text-[#244855] dark:text-[#90AEAD]">
                {currentItems.map((agent) => (
                  <tr key={agent.id} className="hover:bg-[#f8fafb]/60 dark:hover:bg-[#244855]/10 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#244855] dark:text-white">{agent.name}</td>
                    <td className="px-5 py-3.5">{agent.territory}</td>
                    <td className="px-5 py-3.5 text-[#90AEAD]">{agent.task}</td>
                    <td className="px-5 py-3.5 font-mono">
                      <span className={`font-bold ${agent.battery < 25 ? 'text-[#E64833] animate-pulse' : 'text-[#244855] dark:text-slate-200'}`}>
                        {agent.battery}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">{agent.speed}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">{agent.lastCheckIn}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        agent.status === 'Online'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : agent.status === 'Idle'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                          : agent.status === 'Alert'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedAgentId(agent.id);
                            setPlaybackProgress(0);
                            toast.info(`Loading route trace for ${agent.name}`);
                          }}
                          className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                          title="View Route"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.success(`Alert notification dispatched to ${agent.name}`)}
                          className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                          title="Contact Agent"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-bold text-sm">No Active Representatives Found</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Try updating the search parameters or filter scopes.</p>
            </div>
          )}
        </div>

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#f8fafb] dark:bg-[#1a2d38] border-t border-[#90AEAD]/10 flex items-center justify-between">
            <span className="text-xs text-[#90AEAD]">
              Showing <span className="font-bold text-[#244855] dark:text-white">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-bold text-[#244855] dark:text-white">
                {Math.min(indexOfLastItem, filteredAgents.length)}
              </span>{' '}
              of <span className="font-bold text-[#244855] dark:text-white">{filteredAgents.length}</span> agents
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white dark:bg-[#244855] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-[#244855] dark:text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white dark:bg-[#244855] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: ROUTE HISTORY & GEOFENCE MONITOR & FEED */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* SECTION 6: GEO-FENCING MONITOR */}
        <div className="card-base border border-[#90AEAD]/10 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E64833]" /> Geofence Watchdog
            </h3>
            <div className="space-y-3.5">
              {geofences.map(gf => (
                <div key={gf.id} className="p-3 bg-[#f8fafb] dark:bg-[#1a2d38] border border-[#90AEAD]/10 rounded-xl flex items-center justify-between text-xs font-semibold text-[#244855] dark:text-[#90AEAD]">
                  <div>
                    <h5 className="font-bold text-[#244855] dark:text-white">{gf.name}</h5>
                    <span className="text-[10px] text-slate-500 mt-1 block">Radius: {gf.radius}m · Active: {gf.activeAgents} reps</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    gf.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {gf.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-[#90AEAD]/10 mt-6 text-[10px] text-slate-500 font-semibold">
            <strong>Emergency Breach Auto-call:</strong> Configured for 2 active Zones.
          </div>
        </div>

        {/* SECTION 7: LIVE ACTIVITY FEED */}
        <div className="card-base border border-[#90AEAD]/10 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#90AEAD]" /> Operations Alert Ticker
            </h3>
            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 text-xs font-semibold text-[#244855] dark:text-[#90AEAD]">
              {RECENT_FEEDS.map((feed, idx) => (
                <div key={idx} className="p-3 bg-[#f8fafb] dark:bg-[#1a2d38] border border-[#90AEAD]/10 rounded-xl flex gap-3 items-start">
                  <span className="font-mono text-[9px] text-[#E64833] font-bold mt-0.5">{feed.time}</span>
                  <span className="text-slate-600 dark:text-slate-300 leading-normal text-[11px]">{feed.log}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-[#90AEAD]/10 mt-6 text-[10px] text-[#90AEAD] font-semibold">
            System Node Feed: <strong>Active Uplink</strong>
          </div>
        </div>

        {/* SECTION 8: TERRITORY PERFORMANCE */}
        <div className="card-base border border-[#90AEAD]/10 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#874F41]" /> Regional SLA Matrix
            </h3>
            <div className="space-y-3.5 text-xs font-semibold text-[#244855] dark:text-[#90AEAD]">
              {[
                { zone: 'Delhi NCR Hub', staff: 14, efficiency: '98.2%', visits: 142 },
                { zone: 'Mumbai South Coast', staff: 11, efficiency: '97.5%', visits: 98 },
                { zone: 'Bangalore Tech Rota', staff: 16, efficiency: '99.1%', visits: 105 },
              ].map((row, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-[#f8fafb] dark:bg-[#1a2d38] border border-[#90AEAD]/10 rounded-xl">
                  <div>
                    <h5 className="font-bold text-[#244855] dark:text-white">{row.zone}</h5>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Reps: {row.staff} · Completed: {row.visits}</span>
                  </div>
                  <span className="font-mono text-emerald-500 font-extrabold">{row.efficiency}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-[#90AEAD]/10 mt-6 text-[10px] text-[#90AEAD] flex justify-between font-semibold">
            <span>Aggregated SLA Target: <strong>95%</strong></span>
            <span className="text-emerald-500 font-bold">Passed</span>
          </div>
        </div>

      </div>

      {/* SECTION 9: TRACKING ANALYTICS (Recharts) */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Weekly mileage log line chart (8 Columns) */}
        <div className="lg:col-span-8 card-base border border-[#90AEAD]/10 p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Weekly Telemetry Outlay</h3>
          <div className="h-[260px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_MILEAGE} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                <XAxis dataKey="name" stroke="#90AEAD" />
                <YAxis stroke="#90AEAD" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(26,45,56,0.95)',
                    borderColor: 'rgba(144,174,173,0.3)',
                    color: '#FBE9D0',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="mileage" name="Cumulative Distance (Km)" stroke="#E64833" strokeWidth={3} />
                <Line type="monotone" dataKey="tasks" name="Visits Logged" stroke="#244855" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart (4 Columns) */}
        <div className="lg:col-span-4 card-base border border-[#90AEAD]/10 p-6 flex flex-col justify-between">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Representative Allocation</h3>
          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_PIE}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-xl font-extrabold text-[#244855] dark:text-white">9</span>
              <span className="text-[8px] text-[#90AEAD] uppercase font-bold tracking-wider">Total Reps</span>
            </div>
          </div>
          {/* Custom Legend details */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold mt-4 border-t border-[#90AEAD]/10 pt-3">
            {STATUS_PIE.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500 dark:text-[#90AEAD]">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 10: QUICK ACTIONS PANEL */}
      <div className="bg-gradient-to-r from-[#244855] via-[#E64833]/80 to-[#874F41] border border-[#90AEAD]/20 rounded-3xl p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
        <div>
          <h3 className="text-xl font-extrabold text-[#FBE9D0] tracking-tight">Operation Dispatch Desk</h3>
          <p className="text-xs text-[#90AEAD] mt-1">Configure boundary alerts, provision regions, and compile dispatch files instantly.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModalOpen('territory')}
            className="px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-xl text-xs transition-all shadow-accent min-h-[38px] flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" /> Assign Territory
          </button>
          <button
            onClick={() => setModalOpen('geofence')}
            className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl text-xs transition-all min-h-[38px] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E64833]" /> Create Geo Fence
          </button>
          <button
            onClick={() => setModalOpen('export')}
            className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl text-xs transition-all min-h-[38px] flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* MODAL WINDOWS FOR QUICK ACTIONS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-force-lg animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL 1: ASSIGN TERRITORY */}
            {modalOpen === 'territory' && (
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-bold text-[#244855] dark:text-white">Assign Representative Territory</h3>
                <p className="text-xs text-[#90AEAD]">Provision new regional bounds to active staff.</p>
                <form onSubmit={handleAssignTerritory} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Representative Name</label>
                    <select
                      value={assignName}
                      onChange={(e) => setAssignName(e.target.value)}
                      className="input-field py-2 px-3 text-xs bg-white dark:bg-slate-900 border-[#90AEAD]/30 text-[#244855] dark:text-white min-h-[38px] cursor-pointer"
                    >
                      {agents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Operational Territory</label>
                    <select
                      value={assignTerritory}
                      onChange={(e) => setAssignTerritory(e.target.value)}
                      className="input-field py-2 px-3 text-xs bg-white dark:bg-slate-900 border-[#90AEAD]/30 text-[#244855] dark:text-white min-h-[38px] cursor-pointer"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Mumbai South">Mumbai South</option>
                      <option value="Bangalore East">Bangalore East</option>
                      <option value="Chennai North">Chennai North</option>
                      <option value="Hyderabad City">Hyderabad City</option>
                      <option value="Pune Hub">Pune Hub</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-2xl text-xs transition-all shadow-accent mt-4 min-h-[40px] cursor-pointer">
                    Apply Roster Update
                  </button>
                </form>
              </div>
            )}

            {/* MODAL 2: CREATE GEOFENCE */}
            {modalOpen === 'geofence' && (
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-bold text-[#244855] dark:text-white">Deploy Virtual Boundary Zone</h3>
                <p className="text-xs text-[#90AEAD]">Fences verify agent locations automatically during check-ins.</p>
                <form onSubmit={handleAddGeofence} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Geofence Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune Central Terminal"
                      value={newFenceName}
                      onChange={(e) => setNewFenceName(e.target.value)}
                      className="input-field border-[#90AEAD]/30 text-[#244855] dark:text-white bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Radius (meters)</label>
                      <select
                        value={newFenceRadius}
                        onChange={(e) => setNewFenceRadius(e.target.value)}
                        className="input-field py-2 px-3 text-xs bg-white dark:bg-slate-900 border-[#90AEAD]/30 text-[#244855] dark:text-white min-h-[38px] cursor-pointer"
                      >
                        <option value="300">300 m</option>
                        <option value="500">500 m</option>
                        <option value="800">800 m</option>
                        <option value="1000">1000 m</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Center City</label>
                      <select
                        value={newFenceCity}
                        onChange={(e) => setNewFenceCity(e.target.value)}
                        className="input-field py-2 px-3 text-xs bg-white dark:bg-slate-900 border-[#90AEAD]/30 text-[#244855] dark:text-white min-h-[38px] cursor-pointer"
                      >
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-2xl text-xs transition-all shadow-accent mt-4 min-h-[40px] cursor-pointer">
                    Deploy Watchdog geofence
                  </button>
                </form>
              </div>
            )}

            {/* MODAL 3: EXPORT REPORT */}
            {modalOpen === 'export' && (
              <div className="space-y-4 text-center py-4">
                <FileText className="w-12 h-12 text-[#E64833] mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-[#244855] dark:text-white">Export GPS Roster Telemetry</h3>
                <p className="text-xs text-[#90AEAD] max-w-xs mx-auto">
                  Compile check-in timestamps, GPS tracking nodes, and mileage summaries into direct dispatch files.
                </p>
                <div className="flex gap-3.5 pt-4">
                  <button
                    onClick={() => {
                      toast.success('Excel spreadsheet compiled and downloaded.');
                      setModalOpen(null);
                    }}
                    className="flex-1 py-3 bg-[#244855] hover:bg-[#1a3340] text-white font-bold rounded-2xl text-xs transition-all min-h-[38px] cursor-pointer"
                  >
                    CSV Spreadsheet
                  </button>
                  <button
                    onClick={() => {
                      toast.success('PDF report generated and downloaded.');
                      setModalOpen(null);
                    }}
                    className="flex-1 py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-2xl text-xs transition-all min-h-[38px] cursor-pointer shadow-accent"
                  >
                    PDF Audit Packet
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
