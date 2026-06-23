import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  MOCK_TASKS, MOCK_TEAM, MOCK_REGIONS, MOCK_EXPENSES, MOCK_ATTENDANCE, CHART_DATA
} from '@/lib/mockData';
import type { Task, TeamMember, Region, Expense, AttendanceRecord } from '@/types';
import {
  BarChart3, Calendar, Filter, Download, ArrowUpRight, ArrowDownRight,
  TrendingUp, Users, MapPin, CheckSquare, DollarSign, Award, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [tasks] = useLocalStorage<Task[]>('force1_tasks', MOCK_TASKS);
  const [team] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);
  const [regions] = useLocalStorage<Region[]>('force1_regions', MOCK_REGIONS);
  const [expenses] = useLocalStorage<Expense[]>('force1_expenses', MOCK_EXPENSES);
  const [attendance] = useLocalStorage<AttendanceRecord[]>('force1_attendance', MOCK_ATTENDANCE);

  const [dateRange, setDateRange] = useState('month');

  // Export reports simulator
  const handleExportData = () => {
    toast.success('Compiling analytics data. CSV download will start shortly...');
  };

  // Compile totals
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskSuccessRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalActiveStaff = team.filter(m => m.status === 'active').length;
  const totalApprovedSpend = expenses.filter(e => e.status === 'approved').reduce((s, c) => s + c.amount, 0);
  
  const presentCount = attendance.filter(a => a.date === '2026-04-29' && a.status === 'present').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <BarChart3 className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">System Analytics</h1>
          </div>
          <p className="text-white/70 text-sm">Real-time charts, productivity curves, expense splits, and attendance ratios.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-2 rounded-xl text-white font-semibold text-xs min-h-[40px] focus:outline-none capitalize cursor-pointer"
          >
            <option className="text-black" value="today">Today</option>
            <option className="text-black" value="week">This Week</option>
            <option className="text-black" value="month">This Month</option>
            <option className="text-black" value="quarter">This Quarter</option>
          </select>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-bold text-xs shadow transition-all min-h-[40px]"
          >
            <Download className="w-3.5 h-3.5" /> Export Logs
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Agent Completion Rate', value: `${taskSuccessRate}%`, sub: '+3.2% vs last month', icon: Award, color: 'bg-green-500', trend: 'up' },
          { label: 'Active Field Force', value: totalActiveStaff, sub: 'Online tracking active', icon: Users, color: 'bg-[#244855]', trend: 'neutral' },
          { label: 'Approved Claims', value: `₹${totalApprovedSpend.toLocaleString('en-IN')}`, sub: 'Claims reimbursement', icon: DollarSign, color: 'bg-[#E64833]', trend: 'down' },
          { label: 'Daily Presence Rate', value: '94%', sub: 'Last updated today', icon: Clock, color: 'bg-[#874F41]', trend: 'up' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card-base p-5 border border-[#90AEAD]/10">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
                <span className="text-[10px] font-bold text-[#90AEAD] flex items-center">
                  {kpi.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />}
                  {kpi.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                </span>
              </div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{kpi.value}</p>
              <p className="text-sm font-semibold text-[#244855]/90 dark:text-[#90AEAD]">{kpi.label}</p>
              <p className="text-xs text-[#90AEAD]/80 mt-0.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Row of Charts (2x2 Grid) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Task Distribution */}
        <div className="card-base p-6 border border-[#90AEAD]/10">
          <div className="mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm">Weekly Task completion trends</h3>
            <p className="text-xs text-[#90AEAD]">Comparison between assigned and completed tasks.</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA.weeklyTasks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 11, fill: '#90AEAD' }} />
                <Tooltip contentStyle={{ fontSize: 11, background: '#244855', color: 'white', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="assigned" fill="#90AEAD" radius={[4, 4, 0, 0]} name="Assigned" />
                <Bar dataKey="completed" fill="#E64833" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region performance bar chart */}
        <div className="card-base p-6 border border-[#90AEAD]/10">
          <div className="mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm">Regional performance rankings</h3>
            <p className="text-xs text-[#90AEAD]">Efficiency index rating score per geographical sector.</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA.regionPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#90AEAD' }} domain={[0, 100]} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 10, fill: '#90AEAD' }} width={50} />
                <Tooltip contentStyle={{ fontSize: 11, background: '#244855', color: 'white', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#244855" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense distribution pie chart */}
        <div className="card-base p-6 border border-[#90AEAD]/10">
          <div className="mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm">Expense category breakdown</h3>
            <p className="text-xs text-[#90AEAD]">Expense claims allocation percentage.</p>
          </div>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHART_DATA.expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name }) => name}>
                  {CHART_DATA.expenseByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, background: '#244855', color: 'white', border: 'none', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Attendance curve chart */}
        <div className="card-base p-6 border border-[#90AEAD]/10">
          <div className="mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display text-sm">Monthly Attendance rates</h3>
            <p className="text-xs text-[#90AEAD]">Weekly present vs absent statistics metrics.</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA.monthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 11, fill: '#90AEAD' }} />
                <Tooltip contentStyle={{ fontSize: 11, background: '#244855', color: 'white', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="present" stroke="#E64833" strokeWidth={2.5} dot={{ fill: '#E64833' }} name="Present %" />
                <Line type="monotone" dataKey="absent" stroke="#90AEAD" strokeWidth={2.5} dot={{ fill: '#90AEAD' }} name="Absent %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
