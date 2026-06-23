import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';

const REGION_TASK_DATA = [
  { name: 'Delhi East', completed: 92, target: 100 },
  { name: 'Mumbai South', completed: 88, target: 100 },
  { name: 'Bangalore West', completed: 96, target: 100 },
  { name: 'Chennai North', completed: 82, target: 100 },
  { name: 'Kolkata Central', completed: 85, target: 100 },
];

const ROUTE_EFFICIENCY_DATA = [
  { day: 'Mon', avgHours: 1.8, optimalHours: 1.2 },
  { day: 'Tue', avgHours: 1.6, optimalHours: 1.2 },
  { day: 'Wed', avgHours: 1.5, optimalHours: 1.2 },
  { day: 'Thu', avgHours: 1.4, optimalHours: 1.2 },
  { day: 'Fri', avgHours: 1.3, optimalHours: 1.2 },
  { day: 'Sat', avgHours: 1.1, optimalHours: 1.0 },
  { day: 'Sun', avgHours: 1.0, optimalHours: 1.0 },
];

const EXPENSE_CATEGORIES = [
  { name: 'Fuel & Commute', value: 45000, color: '#244855' },
  { name: 'Hotel & Lodging', value: 28000, color: '#E64833' },
  { name: 'Meals & Food', value: 15400, color: '#874F41' },
  { name: 'Tools & Hardware', value: 9200, color: '#90AEAD' },
];

export default function AnalyticsSection() {
  const [activeReport, setActiveReport] = useState<'tasks' | 'routes' | 'expenses'>('tasks');

  return (
    <section className="py-24 bg-white dark:bg-[#0d1f28] relative border-t border-[#90AEAD]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <BarChart3 className="w-4 h-4" /> Reporting & BI Analytics
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Enterprise Decision Support
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Harness ground data to optimize fuel costs, improve SLA fulfillment times, and manage department expenses using clean visualized charts.
          </p>
        </div>

        {/* KPI Scorecards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'SLA Fulfillment', value: '94.2%', change: '+3.4% MoM', icon: <Percent className="w-5 h-5 text-[#E64833]" /> },
            { label: 'Avg Travel Duration', value: '1.4 hrs', change: '-18% fuel saved', icon: <TrendingUp className="w-5 h-5 text-[#244855] dark:text-[#90AEAD]" /> },
            { label: 'Claim Payouts', value: '₹97,600', change: '100% audited', icon: <DollarSign className="w-5 h-5 text-[#874F41]" /> },
            { label: 'Scheduled Visits', value: '1,248', change: '98% completion', icon: <Calendar className="w-5 h-5 text-[#90AEAD]" /> },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-[#1a2d38] p-5 rounded-2xl border border-[#90AEAD]/20 shadow-sm relative group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-[#90AEAD]">{kpi.label}</span>
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-[#90AEAD]/20 flex items-center justify-center">
                  {kpi.icon}
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-[#244855] dark:text-white font-mono leading-none">
                {kpi.value}
              </h3>
              <p className="text-[10px] text-emerald-500 font-semibold mt-2.5">{kpi.change}</p>
            </div>
          ))}
        </div>

        {/* Chart Viewport Wrapper */}
        <div className="bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl p-6 shadow-force-lg">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between pb-6 border-b border-[#90AEAD]/10 gap-4 mb-8">
            <div>
              <h4 className="font-bold text-[#244855] dark:text-white text-lg">BI Reports Deck</h4>
              <p className="text-xs text-[#90AEAD]">Interact with active graphs by toggling report categories.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveReport('tasks')}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                  activeReport === 'tasks'
                    ? 'bg-[#244855] text-white'
                    : 'bg-slate-50 dark:bg-slate-900 text-[#90AEAD] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Task Completion Rates
              </button>
              <button
                onClick={() => setActiveReport('routes')}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                  activeReport === 'routes'
                    ? 'bg-[#244855] text-white'
                    : 'bg-slate-50 dark:bg-slate-900 text-[#90AEAD] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Route Efficiency
              </button>
              <button
                onClick={() => setActiveReport('expenses')}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                  activeReport === 'expenses'
                    ? 'bg-[#244855] text-white'
                    : 'bg-slate-50 dark:bg-slate-900 text-[#90AEAD] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Expense Split
              </button>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="h-[360px] w-full text-xs">
            {activeReport === 'tasks' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REGION_TASK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#90AEAD" fontWeight="bold" />
                  <YAxis stroke="#90AEAD" unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26,45,56,0.95)',
                      borderColor: 'rgba(144,174,173,0.3)',
                      color: '#FBE9D0',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Completed Visits %" fill="#E64833" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target SLA %" fill="#244855" opacity={0.2} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeReport === 'routes' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ROUTE_EFFICIENCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" stroke="#90AEAD" fontWeight="bold" />
                  <YAxis stroke="#90AEAD" label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: -10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26,45,56,0.95)',
                      borderColor: 'rgba(144,174,173,0.3)',
                      color: '#FBE9D0',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="avgHours" name="Actual Travel Hrs" stroke="#E64833" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="optimalHours" name="Optimized Benchmark" stroke="#90AEAD" strokeDasharray="5 5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeReport === 'expenses' && (
              <div className="grid md:grid-cols-2 h-full items-center">
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={EXPENSE_CATEGORIES}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {EXPENSE_CATEGORIES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => `₹${Number(val).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: 'rgba(26,45,56,0.95)',
                          borderColor: 'rgba(144,174,173,0.3)',
                          color: '#FBE9D0',
                          borderRadius: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend details */}
                <div className="space-y-4 max-w-sm">
                  <h5 className="font-bold text-[#244855] dark:text-white text-sm mb-4">Total Budget Outlay split</h5>
                  {EXPENSE_CATEGORIES.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                      </div>
                      <span className="font-mono text-[#244855] dark:text-white">
                        ₹{item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
