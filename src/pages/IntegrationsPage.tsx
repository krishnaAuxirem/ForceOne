import { useState, useEffect } from 'react';
import { Layers, Search, Code, Terminal, Check, Copy, Sparkles, Sliders, ExternalLink, Zap, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const INTEGRATIONS_CATALOG = [
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    category: 'CRM',
    desc: 'Automatically sync client addresses, schedule site inspections, and feedback task logs directly into client contact histories.',
    icon: Layers,
    status: 'Ready',
    apiCount: '15,000 req/day',
    docLink: '#doc-salesforce'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    desc: 'Trigger field tasks upon sales deal closures. Synchronize customer feedback capture reports in real time.',
    icon: Layers,
    status: 'Ready',
    apiCount: '1,200 req/day',
    docLink: '#doc-hubspot'
  },
  {
    id: 'sap',
    name: 'SAP ERP',
    category: 'ERP',
    desc: 'Verify inventory stock, log replacement parts, and sync field worker travel logs directly into company finance records.',
    icon: Sliders,
    status: 'Enterprise Only',
    apiCount: '5,000 req/day',
    docLink: '#doc-sap'
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    category: 'ERP',
    desc: 'Log field service tickets, dispatch engineers based on equipment warranty status, and generate client invoices.',
    icon: Sliders,
    status: 'Enterprise Only',
    apiCount: '3,200 req/day',
    docLink: '#doc-netsuite'
  },
  {
    id: 'gmaps',
    name: 'Google Maps Engine',
    category: 'Maps',
    desc: 'Verify agent coordinates, plot geofences, structure polygon-based delivery zones, and calculate real-time traffic offsets.',
    icon: Zap,
    status: 'Ready',
    apiCount: '45,000 req/day',
    docLink: '#doc-gmaps'
  },
  {
    id: 'mapbox',
    name: 'Mapbox Navigation',
    category: 'Maps',
    desc: 'Render optimized travel path polylines inside client-facing apps. Trigger geo-notifications on agent arrival.',
    icon: Zap,
    status: 'Ready',
    apiCount: '8,000 req/day',
    docLink: '#doc-mapbox'
  },
  {
    id: 'slack',
    name: 'Slack Alerts',
    category: 'Communication',
    desc: 'Dispatch emergency alerts, send automatic shift alerts to channels, and let agents update checklist status with chat buttons.',
    icon: Code,
    status: 'Ready',
    apiCount: '25,000 req/day',
    docLink: '#doc-slack'
  },
  {
    id: 'msteams',
    name: 'Microsoft Teams',
    category: 'Communication',
    desc: 'Push operations telemetry logs and geofence check-in updates directly into your office operations team channels.',
    icon: Code,
    status: 'Ready',
    apiCount: '4,000 req/day',
    docLink: '#doc-teams'
  }
];

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/v1/tasks/dispatch',
    desc: 'Create and dispatch a new task to an active field agent.',
    payload: {
      agent_id: 'agent_9981A',
      title: 'Emergency AC Repair',
      address: 'BKC Block G, Bandra East, Mumbai, 400051',
      latitude: 19.0596,
      longitude: 72.8654,
      priority: 'high',
      deadline: '2026-06-23T20:00:00Z'
    }
  },
  {
    method: 'GET',
    path: '/v1/agents/tracking',
    desc: 'Fetch current active GPS telemetry coordinate nodes for all active field agents.',
    payload: {}
  }
];

const CODE_TEMPLATES: Record<string, Record<string, string>> = {
  curl: {
    post: `curl -X POST "https://api.force1.in/v1/tasks/dispatch" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "agent_9981A",
    "title": "Emergency AC Repair",
    "address": "BKC Block G, Bandra East, Mumbai",
    "latitude": 19.0596,
    "longitude": 72.8654,
    "priority": "high"
  }'`,
    get: `curl -X GET "https://api.force1.in/v1/agents/tracking?status=active" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  },
  python: {
    post: `import requests

url = "https://api.force1.in/v1/tasks/dispatch"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "agent_id": "agent_9981A",
    "title": "Emergency AC Repair",
    "address": "BKC Block G, Bandra East, Mumbai",
    "latitude": 19.0596,
    "longitude": 72.8654,
    "priority": "high"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    get: `import requests

url = "https://api.force1.in/v1/agents/tracking"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
params = {"status": "active"}

response = requests.get(url, headers=headers, params=params)
print(response.json())`
  },
  node: {
    post: `const axios = require('axios');

const dispatchTask = async () => {
  const url = 'https://api.force1.in/v1/tasks/dispatch';
  const config = {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  };
  const payload = {
    agent_id: 'agent_9981A',
    title: 'Emergency AC Repair',
    address: 'BKC Block G, Bandra East, Mumbai',
    latitude: 19.0596,
    longitude: 72.8654,
    priority: 'high'
  };

  try {
    const res = await axios.post(url, payload, config);
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }
};

dispatchTask();`,
    get: `const axios = require('axios');

const getTracking = async () => {
  const url = 'https://api.force1.in/v1/agents/tracking?status=active';
  const config = {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  };

  try {
    const res = await axios.get(url, config);
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data);
  }
};

getTracking();`
  },
  go: {
    post: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	url := "https://api.force1.in/v1/tasks/dispatch"
	payload := map[string]interface{}{
		"agent_id":  "agent_9981A",
		"title":     "Emergency AC Repair",
		"address":   "BKC Block G, Bandra East, Mumbai",
		"latitude":  19.0596,
		"longitude": 72.8654,
		"priority":  "high",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)
}`,
    get: `package main

import (
	"fmt"
	"net/http"
)

func main() {
	url := "https://api.force1.in/v1/agents/tracking?status=active"
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)
}`
  }
};

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Developer console states
  const [activeEndpointIdx, setActiveEndpointIdx] = useState<number>(0);
  const [activeLang, setActiveLang] = useState<string>('curl');
  const [apiConsoleOutput, setApiConsoleOutput] = useState<string>('// Console output will appear here after triggering "Send Request"');
  const [apiConsoleLoading, setApiConsoleLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  // Filter Catalog Connectors
  const filteredConnectors = INTEGRATIONS_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Copy API code snippet
  const handleCopyCode = () => {
    const codeSnippet = activeEndpointIdx === 0 
      ? CODE_TEMPLATES[activeLang].post 
      : CODE_TEMPLATES[activeLang].get;
    
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    toast.success('Code snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate API sandbox response execution
  const executeApiSimulation = () => {
    setApiConsoleLoading(true);
    setApiConsoleOutput('// Sending request to https://api.force1.in ...');
    
    setTimeout(() => {
      setApiConsoleLoading(false);
      if (activeEndpointIdx === 0) {
        setApiConsoleOutput(JSON.stringify({
          status: 'success',
          code: 201,
          message: 'Task successfully provisioned and dispatched',
          data: {
            task_id: 'tsk_22810X',
            agent_id: 'agent_9981A',
            allocated_at: new Date().toISOString(),
            route: {
              est_travel_time: '18 mins',
              est_distance: '4.8 km',
              geofence_status: 'armed'
            }
          }
        }, null, 2));
      } else {
        setApiConsoleOutput(JSON.stringify({
          status: 'success',
          code: 200,
          timestamp: new Date().toISOString(),
          active_nodes_count: 3,
          nodes: [
            { agent_id: 'agent_9981A', name: 'Ramesh K.', lat: 19.0596, lng: 72.8654, battery: '85%', connectivity: '5G' },
            { agent_id: 'agent_4401B', name: 'Amit S.', lat: 19.0760, lng: 72.8777, battery: '92%', connectivity: '4G' },
            { agent_id: 'agent_2139C', name: 'Sneha P.', lat: 19.0432, lng: 72.8231, battery: '78%', connectivity: 'Offline-Cached' }
          ]
        }, null, 2));
      }
    }, 1200);
  };

  const currentCodeSnippet = activeEndpointIdx === 0 
    ? CODE_TEMPLATES[activeLang].post 
    : CODE_TEMPLATES[activeLang].get;

  return (
    <main className="pt-20 bg-white dark:bg-[#0d1f28] text-[#244855] dark:text-white transition-colors duration-300">
      
      {/* 1. Hero Title Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-[#90AEAD]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#244855]/5 to-[#E64833]/5 dark:from-[#244855]/20 dark:to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-4">
            <Layers className="w-4 h-4" /> Integrations Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-[#244855] dark:text-white mb-6">
            Connect Your <span className="text-[#E64833]">Operations Stack</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#90AEAD] leading-relaxed mb-8">
            Pipeline coordinates, tasks, and expense logs seamlessly. Sync Force1 directly with your CRMs, ERP databases, communication portals, and geolocation engines.
          </p>
        </div>
      </section>

      {/* 2. Interactive Marketplace Grid & Filters */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-[#90AEAD]/10">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800/40 p-1.5 rounded-2xl w-full md:w-auto">
            {['All', 'CRM', 'ERP', 'Maps', 'Communication'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#244855] text-white shadow-force'
                    : 'text-[#90AEAD] hover:text-[#244855] dark:hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#90AEAD]" />
            </span>
            <input
              type="text"
              placeholder="Search connectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

        </div>

        {/* Catalog Grid Cards */}
        {filteredConnectors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredConnectors.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="card-base p-5 flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300 border border-[#90AEAD]/20"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-[#E64833]/15 text-[#E64833] rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.status === 'Ready' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-[#874F41]/10 text-[#874F41]'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="text-left">
                      <h4 className="font-bold text-base text-[#244855] dark:text-white mb-1.5">{item.name}</h4>
                      <p className="text-xs text-[#90AEAD] leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#90AEAD]/10 mt-5 flex items-center justify-between text-[10px] text-[#90AEAD] font-semibold">
                    <span>Usage: <strong>{item.apiCount}</strong></span>
                    <a href={item.docLink} className="text-[#E64833] hover:underline flex items-center gap-0.5">
                      Docs <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 card-base border border-dashed border-[#90AEAD]/30 max-w-md mx-auto">
            <Layers className="w-12 h-12 text-[#90AEAD] mx-auto mb-3" />
            <h4 className="font-bold text-lg text-[#244855] dark:text-white">No connectors found</h4>
            <p className="text-xs text-[#90AEAD] mt-1.5">Try adjusting your category tab filter or search text query.</p>
          </div>
        )}

      </section>

      {/* 3. Interactive Developer API Console Playground */}
      <section className="py-20 bg-slate-900 border-y border-slate-950 text-white relative overflow-hidden">
        
        {/* Subtle geometric circles */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#244855]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E64833]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Console description */}
            <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-4">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Interactive API Console
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
                  Robust Restful <span className="text-[#E64833]">APIs</span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Trigger task updates, request tracking telemetry, and sync dispatch states directly via standard HTTP requests. Select an endpoint on the right and test the payload responses directly.
                </p>

                {/* API endpoints checklist selection */}
                <div className="mt-8 space-y-3">
                  {API_ENDPOINTS.map((ep, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setActiveEndpointIdx(idx); resetConsoleOutput(); }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 focus:outline-none cursor-pointer ${
                        activeEndpointIdx === idx
                          ? 'bg-slate-800 border-[#E64833] shadow-accent/25 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {ep.method}
                          </span>
                          <span className="text-xs font-mono font-bold text-white">{ep.path}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{ep.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
                Security: <strong>OAuth Bearer token authorization</strong>
              </div>
            </div>

            {/* Right Interactive Code Viewer & JSON Console */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              
              {/* Code Snippet Editor Block */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 relative flex flex-col justify-between min-h-[220px]">
                
                {/* File Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-[#E64833]" />
                    <span>Developer Snippet Preview</span>
                  </div>
                  
                  {/* Language Selector tabs */}
                  <div className="flex gap-2">
                    {['curl', 'python', 'node', 'go'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`text-[10px] uppercase font-bold focus:outline-none px-1.5 py-0.5 rounded cursor-pointer ${
                          activeLang === lang ? 'text-[#E64833] bg-slate-800' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preformatted Code Content */}
                <pre className="text-left font-mono text-[11px] text-[#90AEAD] leading-relaxed overflow-x-auto whitespace-pre select-all p-1 max-h-48">
                  <code>{currentCodeSnippet}</code>
                </pre>

                {/* Code action copy details */}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-900">
                  <button
                    onClick={handleCopyCode}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[32px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                  <button
                    onClick={executeApiSimulation}
                    disabled={apiConsoleLoading}
                    className="p-2 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[32px] disabled:opacity-50"
                  >
                    Send Request
                  </button>
                </div>

              </div>

              {/* API live response console */}
              <div className="bg-[#0c1015] rounded-2xl border border-slate-900 p-4 flex-1 min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3 text-[10px] font-bold text-slate-500 tracking-wider">
                    <span>RESPONSE BODY PANEL</span>
                    {apiConsoleLoading ? (
                      <span className="text-amber-400 animate-pulse font-mono">LOADING RESPONSE...</span>
                    ) : (
                      <span className="text-emerald-400 font-mono">200 STATUS READY</span>
                    )}
                  </div>
                  
                  {/* Console body outputs */}
                  <pre className="text-left font-mono text-[10.5px] text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre max-h-44 scrollbar-none">
                    <code>{apiConsoleOutput}</code>
                  </pre>
                </div>
                
                <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono pt-3 border-t border-slate-900/60 mt-4">
                  <span>Latency: {apiConsoleLoading ? 'Calculating...' : '114 ms'}</span>
                  <span>Payload size: {apiConsoleOutput.length} bytes</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. API Docs FAQ Accordion */}
      <section className="py-20 bg-slate-50 dark:bg-[#152731]/50 border-t border-[#90AEAD]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-[#244855] dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-[#E64833]" /> Developers <span className="text-[#E64833]">FAQs</span>
            </h2>
            <p className="text-sm text-[#90AEAD] mt-2">
              Learn about rate limits, security, custom webhooks, and SDK setups.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How do I authenticate my API requests?', a: 'All request endpoints in the ForceOne API require an Authorization Bearer token header. You can generate secure API keys with customizable permissions (Read/Write/Dispatch) directly inside your Admin Settings -> API Keys panel.' },
              { q: 'What are the platform rate limits?', a: 'Starter plans are limited to 100 requests per minute. Professional plans support up to 500 requests per minute, and Enterprise plans feature custom dedicated API node limits up to 10,000 requests per minute with active priority queuing.' },
              { q: 'How does webhook verification work?', a: 'Webhook payload bodies are signed with an HMAC SHA-256 signature generated using your custom signing key. When receiving a webhook payload, verify the "X-Force1-Signature" header matching your recalculated SHA-256 payload hash.' },
              { q: 'Do you offer native software SDK packs?', a: 'Yes! We support official SDK packages for Python (pip install forceone-sdk), Node.js/TypeScript (npm install @forceone/sdk), and Go modules. Check our developer docs for installation procedures.' }
            ].map((faq, idx) => {
              const [open, setOpen] = useState(false);
              return (
                <div key={idx} className="bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-2xl overflow-hidden shadow-sm transition-all">
                  <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#244855] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors focus:outline-none min-h-[44px]"
                  >
                    <span>{faq.q}</span>
                    <span className={`transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><Sliders className="w-3.5 h-3.5 text-[#90AEAD]" /></span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#90AEAD] leading-relaxed border-t border-[#90AEAD]/10 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Enterprise API CTA */}
      <section className="py-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl my-16 bg-[#244855] text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#244855] to-[#E64833]/15" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
            Need a Custom API <span className="text-[#E64833]">Connector?</span>
          </h2>
          <p className="max-w-md mx-auto text-sm text-[#90AEAD]">
            Our developer team regularly structures custom pipelines for proprietary systems and custom legacy databases.
          </p>
          <div className="flex justify-center gap-3">
            <a href="/contact" className="btn-accent px-8 py-3.5 rounded-xl font-bold">
              Talk to API Engineers
            </a>
          </div>
        </div>
      </section>

    </main>
  );

  function resetConsoleOutput() {
    setApiConsoleOutput('// Console output will appear here after triggering "Send Request"');
  }
}
