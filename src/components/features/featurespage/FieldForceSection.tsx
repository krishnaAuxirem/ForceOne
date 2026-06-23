import { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, BarChart3, Plus, Trash2, ArrowRight, ShieldCheck, Map, Clock, Percent, ClipboardCheck, Network } from 'lucide-react';

interface FieldForceSectionProps {
  onOpenTrial?: () => void;
  onOpenDemo?: () => void;
}

const CITIES_DATA = {
  Delhi: { agents: '2,450', efficiency: '98.2%', tasks: 142, alert: 'Normal Operation', color: '#E64833' },
  Mumbai: { agents: '1,890', efficiency: '97.5%', tasks: 98, alert: 'High Traffic Route', color: '#90AEAD' },
  Bangalore: { agents: '2,120', efficiency: '99.1%', tasks: 105, alert: 'Optimal Routing', color: '#874F41' },
  Chennai: { agents: '1,150', efficiency: '94.8%', tasks: 54, alert: 'Rain Warning Active', color: '#90AEAD' },
  Pune: { agents: '840', efficiency: '96.4%', tasks: 42, alert: 'General Roster Sync', color: '#244855' },
  Hyderabad: { agents: '1,320', efficiency: '98.0%', tasks: 76, alert: 'New Territory Mapped', color: '#E64833' },
};

const INITIAL_ROSTER = [
  { id: 1, name: 'Anish Mathur', role: 'Team Lead', territory: 'Delhi NCR', phone: '+91 98100 12345' },
  { id: 2, name: 'Radhika Nair', role: 'Sales rep', territory: 'Mumbai South', phone: '+91 99300 54321' },
  { id: 3, name: 'Karthik Raja', role: 'Support Eng', territory: 'Bangalore East', phone: '+91 94440 98765' },
];

export default function FieldForceSection({ onOpenTrial, onOpenDemo }: FieldForceSectionProps) {
  const [selectedCity, setSelectedCity] = useState<'Delhi' | 'Mumbai' | 'Bangalore' | 'Chennai' | 'Pune' | 'Hyderabad'>('Delhi');
  const [activeTab, setActiveTab] = useState<'builder' | 'shifts' | 'territories' | 'analytics'>('builder');
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [newName, setNewName] = useState('');
  const [newTerritory, setNewTerritory] = useState('Delhi NCR');
  const [newRole, setNewRole] = useState('Sales rep');

  // Stats counter simulation
  const [counts, setCounts] = useState({
    agents: 0,
    companies: 0,
    efficiency: 0,
    tasks: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounts({
        agents: 10000,
        companies: 500,
        efficiency: 98,
        tasks: 1000000,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newMember = {
      id: Date.now(),
      name: newName,
      role: newRole,
      territory: newTerritory,
      phone: '+91 98888 77777',
    };
    setRoster([...roster, newMember]);
    setNewName('');
  };

  const handleRemoveMember = (id: number) => {
    setRoster(roster.filter(m => m.id !== id));
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#1a2d38] via-[#0d1f28] to-[#1a2d38] text-white border-t border-[#90AEAD]/20 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#244855]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#E64833]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total Active Agents', value: '10,248+', change: 'Live tracked', icon: <Users className="w-5 h-5 text-[#E64833]" /> },
            { label: 'Managed Territories', value: '24 Regions', change: 'Pan India scope', icon: <Map className="w-5 h-5 text-[#90AEAD]" /> },
            { label: 'Completed Jobs', value: '1,048,290+', change: '99.9% database SLA', icon: <ClipboardCheck className="w-5 h-5 text-[#874F41]" /> },
            { label: 'Attendance Rate', value: '98.6%', change: 'Selfie verified', icon: <Percent className="w-5 h-5 text-emerald-400" /> },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-slate-950/40 border border-[#90AEAD]/10 backdrop-blur-md rounded-2xl p-5.5 hover:border-[#E64833]/50 hover:-translate-y-1 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10px] sm:text-xs font-bold text-[#90AEAD] uppercase tracking-wider">{kpi.label}</span>
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {kpi.icon}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-[#FBE9D0]">{kpi.value}</h3>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                <span>●</span> {kpi.change}
              </p>
            </div>
          ))}
        </div>

        {/* Two-Column Roster Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-stretch mb-20">
          
          {/* LEFT: 3D Map / Browser Dashboard Mockup (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px] backdrop-blur-md">
            {/* Browser chrome headers */}
            <div className="px-5 py-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#E64833]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#90AEAD]/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-4">admin.force1.co/workforce/map</span>
              </div>
              <span className="text-[10px] font-bold bg-[#E64833]/15 text-[#E64833] border border-[#E64833]/30 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E64833] animate-ping" /> Real-time Node Map
              </span>
            </div>

            {/* India SVG map layout */}
            <div className="relative flex-1 bg-[#0f1f26] overflow-hidden flex items-center justify-center p-6 min-h-[380px]">
              {/* Floating Performance Indicator */}
              <div className="absolute top-4 left-4 bg-slate-950/80 border border-[#90AEAD]/10 p-3 rounded-xl backdrop-blur-sm z-10 text-[10px] space-y-1">
                <p className="font-bold text-[#FBE9D0] uppercase tracking-wider">Territory Capacity</p>
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#E64833]" />
                  <span>High: Delhi, Bangalore</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#90AEAD]" />
                  <span>Moderate: Mumbai, Chennai</span>
                </div>
              </div>

              {/* India connection SVG */}
              <svg viewBox="0 0 200 200" className="w-full max-w-[280px] h-auto select-none opacity-85">
                {/* stylized connection paths between cities */}
                <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="2,2">
                  {/* Delhi connections */}
                  <line x1="95" y1="55" x2="68" y2="120" />
                  <line x1="95" y1="55" x2="93" y2="165" />
                  <line x1="95" y1="55" x2="105" y2="135" />
                  {/* Mumbai connections */}
                  <line x1="68" y1="120" x2="78" y2="130" />
                  <line x1="68" y1="120" x2="93" y2="165" />
                  {/* Chennai connections */}
                  <line x1="112" y1="165" x2="93" y2="165" />
                  <line x1="112" y1="165" x2="105" y2="135" />
                </g>

                {/* Country outline (simplified nodes) */}
                <polygon
                  points="95,20 110,35 125,50 140,80 120,110 122,140 115,160 112,175 95,190 90,170 82,150 78,138 65,125 58,110 70,80 82,60 90,40"
                  fill="none"
                  stroke="#244855"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.3"
                />

                {/* City node dots */}
                {[
                  { name: 'Delhi', cx: 95, cy: 55 },
                  { name: 'Mumbai', cx: 68, cy: 120 },
                  { name: 'Pune', cx: 78, cy: 130 },
                  { name: 'Bangalore', cx: 93, cy: 165 },
                  { name: 'Chennai', cx: 112, cy: 165 },
                  { name: 'Hyderabad', cx: 105, cy: 135 },
                ].map((city) => {
                  const isSelected = selectedCity === city.name;
                  const details = CITIES_DATA[city.name as keyof typeof CITIES_DATA];
                  return (
                    <g key={city.name} className="cursor-pointer" onClick={() => setSelectedCity(city.name as any)}>
                      {/* Pulse circle */}
                      <circle
                        cx={city.cx}
                        cy={city.cy}
                        r={isSelected ? 10 : 5}
                        fill={details.color}
                        fillOpacity={isSelected ? 0.3 : 0.15}
                        className={isSelected ? 'animate-ping' : ''}
                        style={{ animationDuration: '3s' }}
                      />
                      {/* Anchor Circle */}
                      <circle
                        cx={city.cx}
                        cy={city.cy}
                        r={isSelected ? 4.5 : 3.5}
                        fill={details.color}
                        stroke="white"
                        strokeWidth="1"
                      />
                      {/* Label */}
                      <text
                        x={city.cx}
                        y={city.cy - 7}
                        fill={isSelected ? '#FBE9D0' : '#90AEAD'}
                        fontSize="6.5"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textAnchor="middle"
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating city stats card */}
              <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-white/10 p-4 rounded-2xl backdrop-blur-md max-w-xs text-xs space-y-2 z-10 shadow-lg animate-scale-in">
                <p className="font-bold text-sm text-[#FBE9D0] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E64833]" /> {selectedCity} Hub Data
                </p>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between gap-6">
                    <span className="text-[#90AEAD]">Active Reps:</span>
                    <span className="font-bold font-mono">{CITIES_DATA[selectedCity].agents}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-[#90AEAD]">SLA Rate:</span>
                    <span className="font-bold text-emerald-400 font-mono">{CITIES_DATA[selectedCity].efficiency}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-[#90AEAD]">Unassigned Tasks:</span>
                    <span className="font-bold text-amber-400 font-mono">{CITIES_DATA[selectedCity].tasks}</span>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 text-[9px] text-[#90AEAD] italic">
                    Status: {CITIES_DATA[selectedCity].alert}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom active notifications feed */}
            <div className="p-3.5 bg-slate-950 border-t border-white/10 flex items-center gap-2.5 text-[10px] text-slate-400 overflow-hidden font-mono">
              <span className="text-[#E64833] font-bold">LIVE ACTIVITY FEED:</span>
              <span className="truncate animate-pulse">Agent Priyesh Mishra checked in at geofence CP Node (Delhi NCR) - Status: On Time</span>
            </div>
          </div>

          {/* RIGHT: Heading, Description & Interactive Tools (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E64833] flex items-center gap-1.5 mb-2.5">
                <Network className="w-4 h-4" /> Operations Control Board
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight mb-4 text-[#FBE9D0]">
                Control Roster Lists & Shifts Dynamically
              </h2>
              <p className="text-sm text-[#90AEAD] leading-relaxed mb-6">
                Organize regional agent structures and configure operational rules. Select a tool tab below to preview live administrative modules.
              </p>

              {/* Pill Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 bg-white/5 p-1 rounded-xl border border-white/10">
                {[
                  { id: 'builder', label: 'Team Builder', icon: <Users className="w-3.5 h-3.5" /> },
                  { id: 'shifts', label: 'Shift Sched', icon: <Clock className="w-3.5 h-3.5" /> },
                  { id: 'territories', label: 'Territories', icon: <MapPin className="w-3.5 h-3.5" /> },
                  { id: 'analytics', label: 'BI Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[34px] ${
                      activeTab === t.id
                        ? 'bg-[#E64833] text-white shadow-md shadow-[#E64833]/30'
                        : 'text-[#90AEAD] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB INTERFACES */}
            <div className="flex-1 min-h-[300px]">
              
              {/* TAB 1: TEAM BUILDER */}
              {activeTab === 'builder' && (
                <div className="space-y-4 animate-scale-in">
                  <form onSubmit={handleAddMember} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter representative name..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="input-field py-2 text-xs flex-grow bg-slate-900 border-white/10 text-white min-h-[38px] placeholder-slate-500 focus:border-[#E64833]"
                    />
                    <button
                      type="submit"
                      className="bg-[#E64833] hover:bg-[#cc3d29] text-white px-3.5 rounded-xl font-bold text-xs min-h-[38px] cursor-pointer shadow-accent flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </form>

                  <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-slate-950/40">
                    {roster.map((m) => (
                      <div key={m.id} className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-all">
                        <div>
                          <p className="font-bold text-xs text-[#FBE9D0]">{m.name}</p>
                          <p className="text-[10px] text-[#90AEAD] mt-0.5">{m.role} • {m.territory}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="p-2 text-slate-500 hover:text-[#E64833] transition-colors rounded-lg hover:bg-[#E64833]/15 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SHIFT SCHEDULING */}
              {activeTab === 'shifts' && (
                <div className="space-y-4.5 animate-scale-in">
                  {[
                    { name: 'General Shift', hours: '09:00 AM - 06:00 PM', capacity: 48, status: 'Overload Warning', color: 'border-[#E64833] bg-[#E64833]/5 text-[#E64833]' },
                    { name: 'Evening Guard', hours: '03:00 PM - 12:00 AM', capacity: 24, status: 'Optimal Load', color: 'border-[#90AEAD]/30 bg-white/5 text-[#90AEAD]' },
                    { name: 'Emergency Support', hours: 'Flexible On-Call', capacity: 12, status: 'Standby Active', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
                  ].map((shift, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-white/10 rounded-2xl space-y-2 hover:border-[#90AEAD]/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#FBE9D0]">{shift.name}</h4>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${shift.color}`}>
                          {shift.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">Timing: {shift.hours}</p>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-[#E64833] h-full"
                          style={{ width: `${(shift.capacity / 60) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-[#90AEAD] pt-0.5">
                        <span>Staff: {shift.capacity} Reps</span>
                        <span>Capacity: 60 max</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: TERRITORY MANAGEMENT */}
              {activeTab === 'territories' && (
                <div className="grid sm:grid-cols-2 gap-4 animate-scale-in">
                  {[
                    { code: 'DL-NCR', name: 'Delhi NCR Hub', agents: 14, efficiency: '98.2%', tasks: 142, color: 'border-[#E64833] text-[#E64833]' },
                    { code: 'MH-MUM', name: 'Mumbai South', agents: 11, efficiency: '97.5%', tasks: 98, color: 'border-[#90AEAD]/30 text-[#90AEAD]' },
                    { code: 'KA-BLR', name: 'Bangalore East', agents: 16, efficiency: '99.1%', tasks: 105, color: 'border-[#E64833] text-[#E64833]' },
                    { code: 'TN-CHN', name: 'Chennai North', agents: 8, efficiency: '94.8%', tasks: 54, color: 'border-emerald-500/30 text-emerald-400' },
                  ].map((ter, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/50 border border-white/10 hover:border-[#90AEAD]/40 transition-all rounded-2xl p-4 space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5">{ter.code}</span>
                        <span className={`w-2 h-2 rounded-full bg-current ${ter.color.split(' ')[1]}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#FBE9D0] truncate">{ter.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-400 mt-2.5">
                          <div>
                            <span className="text-[#90AEAD]">Reps:</span> {ter.agents}
                          </div>
                          <div>
                            <span className="text-[#90AEAD]">SLA:</span> <span className="text-emerald-400 font-bold">{ter.efficiency}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[#90AEAD]">Active Jobs:</span> {ter.tasks}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mini SVG Sparkline Chart */}
                      <div className="pt-2 border-t border-white/5 h-6">
                        <svg viewBox="0 0 100 20" className="w-full h-full">
                          <path
                            d={`M 0,${15 - idx * 2} L 20,${10 + idx} L 40,${15 - idx} L 60,${8 + idx * 2} L 80,12 L 100,5`}
                            fill="none"
                            stroke="#E64833"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: WORKFORCE ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-4 animate-scale-in">
                  <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-4.5 space-y-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#90AEAD]">Average Rep Utilization</span>
                    <h5 className="font-mono text-2xl font-extrabold text-[#FBE9D0]">86.4%</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Calculated from real-time dynamic check-in buffers and GPS tracking logs across active shifts.
                    </p>
                    <div className="pt-2">
                      <div className="flex justify-between text-[9px] text-[#90AEAD] mb-1">
                        <span>Workforce Capacity Outlay</span>
                        <span>86% (High Load)</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-[#E64833] h-full" style={{ width: '86%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950/20 border border-[#90AEAD]/10 rounded-xl text-[10px] text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-5.5 h-5.5 text-[#E64833] flex-shrink-0" />
                    <span>Compliance logs confirm that 99.4% of geofenced visits met client time requirements last week.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Dynamic Statistics row */}
        <div className="border-t border-[#90AEAD]/10 pt-16 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            {[
              { value: `${counts.agents.toLocaleString()}+`, label: 'Agents Managed' },
              { value: `${counts.companies}+`, label: 'Companies Trusted' },
              { value: `${counts.efficiency}%`, label: 'Routing Efficiency' },
              { value: '1M+', label: 'Tasks Completed' },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-[#E64833] tracking-tight">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-[#90AEAD] font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section CTA banner */}
        <div className="bg-gradient-to-r from-[#244855] to-[#0f1f26] border border-[#90AEAD]/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E64833]/10 rounded-full blur-3xl z-0" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight text-[#FBE9D0]">
              Manage Your Entire Workforce From One Platform
            </h3>
            <p className="text-sm text-[#90AEAD] leading-relaxed">
              Provision teams, automate shift assignments, optimize routing, and audit travel allowances on the fly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                onClick={onOpenTrial}
                className="px-6 py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-xl text-xs transition-all shadow-accent flex items-center gap-1.5 min-h-[40px] cursor-pointer"
              >
                Start Free Trial <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenDemo}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm min-h-[40px] cursor-pointer"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
