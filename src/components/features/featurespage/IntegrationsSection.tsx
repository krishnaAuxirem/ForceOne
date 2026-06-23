import { useState } from 'react';
import { Layers, CheckCircle2, RotateCw, Activity, Terminal, ExternalLink } from 'lucide-react';

const INTEGRATION_LIST = [
  { id: 'salesforce', name: 'Salesforce CRM', type: 'CRM', desc: 'Sync customer accounts and auto-dispatch site inspections.', status: 'Connected', apiCount: '12,450 req/day' },
  { id: 'sap', name: 'SAP ERP', type: 'ERP', desc: 'Log item inventory details and calculate regional travel allowances.', status: 'Disconnected', apiCount: '0 req/day' },
  { id: 'gmaps', name: 'Google Maps Engine', type: 'Maps', desc: 'Query navigation routes, coordinates, and geofence locations.', status: 'Connected', apiCount: '48,200 req/day' },
  { id: 'powerbi', name: 'Microsoft Power BI', type: 'Analytics', desc: 'Pipeline GPS timestamps into custom SQL reporting dashboards.', status: 'Connected', apiCount: '4,800 req/day' },
];

export default function IntegrationsSection() {
  const [integrations, setIntegrations] = useState(INTEGRATION_LIST);
  const [activeId, setActiveId] = useState('salesforce');
  const [apiLogs, setApiLogs] = useState<string[]>([
    'GET /api/v2/agents/tracking_logs - 200 OK',
    'POST /api/v2/tasks/dispatch - 201 Created',
  ]);

  const handleToggleConnection = (id: string) => {
    setIntegrations(
      integrations.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Connected' ? 'Disconnected' : 'Connected';
          // Log it
          setApiLogs((logs) => [
            `SYSTEM: Connection to ${item.name} toggled to ${nextStatus.toUpperCase()}`,
            ...logs.slice(0, 3),
          ]);
          return {
            ...item,
            status: nextStatus,
            apiCount: nextStatus === 'Connected' ? '1,500 req/day' : '0 req/day',
          };
        }
        return item;
      })
    );
  };

  const handleSimulateApiCall = () => {
    const selected = integrations.find((i) => i.id === activeId);
    if (selected?.status !== 'Connected') {
      setApiLogs((logs) => [
        `ERROR: API request to ${selected?.name} failed. Status: Disconnected`,
        ...logs.slice(0, 3),
      ]);
      return;
    }
    const randId = Math.floor(Math.random() * 900) + 100;
    const paths = [
      `POST /api/v2/crm/sync_lead_${randId} - 200 OK`,
      `GET /api/v2/maps/geocode?address=Sector_10 - 200 OK`,
      `POST /api/v2/analytics/kpi_update - 202 Accepted`,
    ];
    const newLog = paths[Math.floor(Math.random() * paths.length)];
    setApiLogs((logs) => [newLog, ...logs.slice(0, 3)]);
  };

  const activeIntegration = integrations.find((i) => i.id === activeId) || integrations[0];

  return (
    <section className="py-24 bg-white dark:bg-[#0d1f28] relative border-t border-[#90AEAD]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <Layers className="w-4 h-4" /> Open APIs & Integrations
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Unified SaaS Connectors
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Connect Force1 directly to your existing systems. Automate field workflows by syncing data directly into CRM, ERP, Maps, and Analytics software.
          </p>
        </div>

        {/* Section Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Connector Node graph SVG - Left (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-white shadow-force-lg min-h-[460px] relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Node Hub Graph</span>
                <span className="text-[10px] text-slate-500">Rate Limit: 100,000/day</span>
              </div>

              {/* Node graph SVG */}
              <div className="aspect-square w-full max-w-[260px] mx-auto bg-slate-900/40 rounded-2xl border border-slate-900 flex items-center justify-center relative">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Connection lines */}
                  {integrations.map((item, idx) => {
                    const isSelected = activeId === item.id;
                    const isConnected = item.status === 'Connected';
                    const angles = [45, 135, 225, 315];
                    const angle = (angles[idx] * Math.PI) / 180;
                    const x = 100 + 65 * Math.cos(angle);
                    const y = 100 + 65 * Math.sin(angle);

                    return (
                      <g key={item.id}>
                        <line
                          x1="100"
                          y1="100"
                          x2={x}
                          y2={y}
                          stroke={isSelected ? '#E64833' : isConnected ? '#244855' : '#475569'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          strokeDasharray={isConnected ? '4,4' : 'none'}
                          className={isConnected && isSelected ? 'animate-shimmer' : ''}
                        />
                        {/* Outer node circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r="14"
                          fill="#1e293b"
                          stroke={isSelected ? '#E64833' : isConnected ? '#90AEAD' : '#475569'}
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-slate-800 transition-colors"
                          onClick={() => setActiveId(item.id)}
                        />
                        {/* Tiny abbreviation text inside node */}
                        <text
                          x={x}
                          y={y + 3}
                          fill={isSelected ? '#E64833' : '#ffffff'}
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="cursor-pointer pointer-events-none"
                        >
                          {item.id.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}

                  {/* Central Force1 Circle */}
                  <circle cx="100" cy="100" r="22" fill="#E64833" stroke="white" strokeWidth="2" />
                  <text x="100" y="103" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                    F1 HUB
                  </text>
                </svg>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 text-xs flex justify-between items-center">
              <span className="text-slate-500">Live Connector:</span>
              <span className="font-bold text-[#E64833] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> {activeIntegration.name}
              </span>
            </div>
          </div>

          {/* Interactive Integration Details & Live logs API - Right (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#90AEAD]/10">
                <div>
                  <h4 className="font-bold text-base text-[#244855] dark:text-white flex items-center gap-2">
                    {activeIntegration.name}
                  </h4>
                  <p className="text-xs text-[#90AEAD]">Category: {activeIntegration.type} Integration</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    activeIntegration.status === 'Connected'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-600'
                  }`}>
                    {activeIntegration.status}
                  </span>
                  <button
                    onClick={() => handleToggleConnection(activeIntegration.id)}
                    className="px-3.5 py-1.5 border border-[#90AEAD]/30 text-xs font-bold rounded-lg hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer min-h-[32px]"
                  >
                    {activeIntegration.status === 'Connected' ? 'Disconnect' : 'Connect API'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Integration Action</h5>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeIntegration.desc}
                  </p>
                </div>
                <div className="flex gap-8 text-xs">
                  <div>
                    <span className="text-slate-500">API Usage Rate:</span>
                    <p className="font-bold font-mono text-[#244855] dark:text-white mt-0.5">{activeIntegration.apiCount}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Latency Average:</span>
                    <p className="font-bold font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                      {activeIntegration.status === 'Connected' ? '124 ms' : '--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* API live logs simulation */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white font-mono text-xs">
                <div className="flex items-center justify-between mb-3 text-[10px] text-slate-400 font-bold tracking-wider">
                  <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> API Webhook Console</span>
                  <button
                    onClick={handleSimulateApiCall}
                    className="text-[#E64833] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Ping Request <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {apiLogs.map((log, idx) => (
                    <p
                      key={idx}
                      className={
                        log.startsWith('ERROR')
                          ? 'text-red-400'
                          : log.startsWith('SYSTEM')
                          ? 'text-amber-400 font-semibold'
                          : 'text-emerald-400'
                      }
                    >
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#90AEAD]/10 text-xs text-[#90AEAD] flex justify-between items-center mt-6">
              <span>Security Protocols: <strong>HMAC Webhooks & OAuth 2.0</strong></span>
              <span>Available Webhooks: <strong>14 Dispatch Events</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
