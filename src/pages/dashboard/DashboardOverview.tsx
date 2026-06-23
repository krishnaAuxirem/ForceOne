import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BarChart3, Settings, MapPin, Newspaper, Shield, CheckSquare,
  Clock, DollarSign, CheckCircle2, User, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  MOCK_TEAM, MOCK_REGIONS, MOCK_BLOGS, MOCK_TASKS, MOCK_EXPENSES, MOCK_ATTENDANCE, MOCK_NOTIFICATIONS, CHART_DATA
} from '@/lib/mockData';
import { getStatusColor, formatDate } from '@/lib/utils';
import type { TeamMember, Region, BlogPost, Task, Expense, AttendanceRecord } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load state from localStorage to ensure shared CRUD data
  const [team] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);
  const [regions] = useLocalStorage<Region[]>('force1_regions', MOCK_REGIONS);
  const [blogs] = useLocalStorage<BlogPost[]>('force1_blogs', MOCK_BLOGS);
  const [tasks] = useLocalStorage<Task[]>('force1_tasks', MOCK_TASKS);
  const [expenses] = useLocalStorage<Expense[]>('force1_expenses', MOCK_EXPENSES);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('force1_attendance', MOCK_ATTENDANCE);

  if (!user) return null;

  // Render role-specific overview
  switch (user.role) {
    case 'admin':
      return <AdminOverview team={team} regions={regions} blogs={blogs} navigate={navigate} />;
    case 'manager':
      return <ManagerOverview tasks={tasks} team={team} expenses={expenses} navigate={navigate} user={user} />;
    case 'agent':
    default:
      return (
        <AgentOverview
          tasks={tasks}
          attendance={attendance}
          setAttendance={setAttendance}
          expenses={expenses}
          user={user}
          navigate={navigate}
        />
      );
  }
}

// ==========================================
// ADMIN OVERVIEW
// ==========================================
function AdminOverview({
  team, regions, blogs, navigate
}: {
  team: TeamMember[]; regions: Region[]; blogs: BlogPost[]; navigate: any;
}) {
  const activeCount = team.filter(m => m.status === 'active').length;
  const avgCompletion = Math.round(regions.reduce((s, r) => s + r.completionRate, 0) / Math.max(regions.length, 1));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-[#244855] via-[#E64833]/80 to-[#874F41] rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-[#FBE9D0]" />
          <h1 className="text-2xl md:text-3xl font-bold font-display">Admin Control Panel</h1>
        </div>
        <p className="text-white/70 text-sm">Full enterprise system status · {team.length} total staff members across {regions.length} regions.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: team.length, sub: `${activeCount} active status`, color: 'bg-[#244855]', icon: Users, path: '/dashboard/users' },
          { label: 'Managed Zones', value: regions.length, sub: 'active regions', color: 'bg-[#874F41]', icon: MapPin, path: '/dashboard/regions' },
          { label: 'Avg Completion', value: `${avgCompletion}%`, sub: 'overall target rate', color: 'bg-[#E64833]', icon: BarChart3, path: '/dashboard/analytics' },
          { label: 'Blog Articles', value: blogs.length, sub: 'published updates', color: 'bg-green-500', icon: Newspaper, path: '/dashboard/blog' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              onClick={() => navigate(s.path)}
              className="card-base p-5 hover:shadow-card-hover transition-all cursor-pointer border border-[#90AEAD]/10 hover:border-[#244855]/20 group"
            >
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5 text-white" /></div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{s.value}</p>
              <p className="text-sm font-semibold text-[#244855]/85 dark:text-[#90AEAD]">{s.label}</p>
              <p className="text-xs text-[#90AEAD]/80 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Regional Task Completion</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA.regionPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 11, fill: '#90AEAD' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="score" fill="#E64833" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">System Expense Categories</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHART_DATA.expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {CHART_DATA.expenseByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Actions & Logs Shortcut */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-base p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">System Notifications</h3>
            <button onClick={() => navigate('/dashboard/notifications')} className="text-xs text-[#E64833] font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.slice(0, 3).map(n => (
              <div key={n.id} className="flex gap-3 items-start p-3 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-xl border border-[#90AEAD]/10">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#244855] dark:text-white">{n.title}</p>
                  <p className="text-xs text-[#90AEAD] truncate">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-base p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-3">System Settings</h3>
            <p className="text-xs text-[#90AEAD] mb-4">Access company details, set agent capacities, and edit tracking update intervals.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="w-full py-2.5 bg-[#244855] text-white rounded-xl text-xs font-bold hover:bg-[#1a3340] transition-all flex items-center justify-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" /> Configure Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MANAGER OVERVIEW
// ==========================================
function ManagerOverview({
  tasks, team, expenses, navigate, user
}: {
  tasks: Task[]; team: TeamMember[]; expenses: Expense[]; navigate: any; user: any;
}) {
  const pendingExpenses = expenses.filter(e => e.status === 'pending');
  const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const completionRate = Math.round((tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1)) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-[#244855] to-[#874F41] rounded-3xl p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold font-display">Manager Dashboard </h1>
        <p className="text-[#FBE9D0]/80 text-sm mt-1">Region: <span className="font-bold">{user.region || 'Mumbai'}</span> Zone · Managing {team.length} Active Agents</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Tasks', value: activeTasks.length, sub: `${tasks.length} total tasks`, icon: CheckSquare, color: 'bg-[#244855]', path: '/dashboard/tasks' },
          { label: 'Team Members', value: team.length, sub: 'Field personnel', icon: Users, color: 'bg-[#874F41]', path: '/dashboard/team' },
          { label: 'Pending Approvals', value: pendingExpenses.length, sub: 'expense reports', icon: DollarSign, color: 'bg-[#E64833]', path: '/dashboard/expenses' },
          { label: 'Completion Rate', value: `${completionRate}%`, sub: 'overall achievement', icon: BarChart3, color: 'bg-green-500', path: '/dashboard/reports' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              onClick={() => navigate(s.path)}
              className="card-base p-5 hover:shadow-card-hover transition-all cursor-pointer border border-[#90AEAD]/10 hover:border-[#244855]/20 group"
            >
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5 text-white" /></div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{s.value}</p>
              <p className="text-sm font-semibold text-[#244855]/85 dark:text-[#90AEAD]">{s.label}</p>
              <p className="text-xs text-[#90AEAD]/80 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Weekly Task Completion</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA.weeklyTasks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="assigned" fill="#90AEAD" radius={[4, 4, 0, 0]} name="Assigned" />
                <Bar dataKey="completed" fill="#E64833" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live GPS Map preview */}
        <div className="card-base p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">Live Tracking Map</h3>
            <button onClick={() => navigate('/dashboard/tracking')} className="text-xs text-[#E64833] font-semibold hover:underline flex items-center gap-1">
              Open Full Screen <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#244855]/10 min-h-[200px]">
            <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&h=400&fit=crop" alt="map" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-[#244855]/40" />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-white text-[10px] font-bold">LIVE AGENT GPS</span>
            </div>
            {team.filter(m => m.lat).slice(0, 3).map((m, i) => (
              <div key={m.id} className="absolute transition-all" style={{ left: `${25 + i * 20}%`, top: `${30 + (i % 2) * 20}%` }}>
                <div className="w-8 h-8 rounded-full bg-[#E64833] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-lg animate-bounce flex-shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FIELD AGENT OVERVIEW
// ==========================================
function AgentOverview({
  tasks, attendance, setAttendance, expenses, user, navigate
}: {
  tasks: Task[]; attendance: AttendanceRecord[]; setAttendance: any; expenses: Expense[]; user: any; navigate: any;
}) {
  const myTasks = tasks.filter(t => t.assignedTo === user.id || t.assignedTo === 'agent-1');
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => (a.userId === user.id || a.userId === 'agent-1') && a.date === today);
  const myExpenses = expenses.filter(e => e.userId === user.id || e.userId === 'agent-1');

  const pendingCount = myTasks.filter(t => t.status === 'pending').length;
  const completedCount = myTasks.filter(t => t.status === 'completed').length;
  const totalExpense = myExpenses.reduce((s, e) => s + e.amount, 0);

  const handleCheckIn = () => {
    const now = new Date();
    const existing = attendance.find(a => (a.userId === user.id || a.userId === 'agent-1') && a.date === today);
    if (existing) { toast.error('Already checked in today!'); return; }
    const record: AttendanceRecord = {
      id: Math.random().toString(), userId: user.id || 'agent-1', date: today,
      checkIn: now.toTimeString().slice(0, 5), status: now.getHours() >= 10 ? 'late' : 'present',
      location: 'Andheri West Office, Mumbai',
    };
    setAttendance((prev: any) => [record, ...prev]);
    toast.success('Checked in successfully!');
  };

  const handleCheckOut = () => {
    const existing = attendance.find(a => (a.userId === user.id || a.userId === 'agent-1') && a.date === today);
    if (!existing) { toast.error('Check-in record not found for today!'); return; }
    if (existing.checkOut) { toast.error('Already checked out today!'); return; }

    setAttendance((prev: any) =>
      prev.map((a: any) =>
        (a.userId === user.id || a.userId === 'agent-1') && a.date === today
          ? { ...a, checkOut: new Date().toTimeString().slice(0, 5) }
          : a
      )
    );
    toast.success('Checked out successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-[#244855] to-[#1a3340] rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[#90AEAD] text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-bold font-display">{user.name}</h1>
            <p className="text-[#90AEAD] text-sm mt-1">{user.region || 'Mumbai North'} Zone · Field Agent</p>
          </div>
          <div className="flex gap-3">
            {!todayRecord?.checkIn ? (
              <button onClick={handleCheckIn} className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-semibold text-sm transition-all shadow-md">
                <Clock className="w-4 h-4" /> Check In
              </button>
            ) : !todayRecord?.checkOut ? (
              <button onClick={handleCheckOut} className="flex items-center gap-2 px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-semibold text-sm transition-all shadow-md">
                <Clock className="w-4 h-4" /> Check Out
              </button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl text-white text-sm border border-white/10">
                <CheckCircle2 className="w-4.5 h-4.5 text-green-400" /> Done for today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Tasks', value: myTasks.length, sub: `${pendingCount} pending`, icon: CheckSquare, color: 'bg-[#244855]', path: '/dashboard/tasks' },
          { label: 'Completed', value: completedCount, sub: 'total tasks completed', icon: CheckCircle2, color: 'bg-green-500', path: '/dashboard/tasks' },
          { label: 'Attendance', value: `${user.attendanceRate || 96}%`, sub: 'monthly rate', icon: Clock, color: 'bg-[#E64833]', path: '/dashboard/attendance' },
          { label: 'Expenses Claims', value: `₹${totalExpense.toLocaleString('en-IN')}`, sub: `${myExpenses.filter(e => e.status === 'pending').length} pending approval`, icon: DollarSign, color: 'bg-[#874F41]', path: '/dashboard/expenses' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              onClick={() => navigate(s.path)}
              className="card-base p-5 hover:shadow-card-hover transition-all cursor-pointer border border-[#90AEAD]/10 hover:border-[#244855]/20 group"
            >
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5 text-white" /></div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{s.value}</p>
              <p className="text-sm font-semibold text-[#244855]/85 dark:text-[#90AEAD]">{s.label}</p>
              <p className="text-xs text-[#90AEAD]/80 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Tasks & Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">Pending Tasks</h3>
            <button onClick={() => navigate('/dashboard/tasks')} className="text-xs text-[#E64833] font-semibold hover:underline flex items-center gap-1">
              View Tasks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {myTasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
              <div key={task.id} className="p-3 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-xl border border-[#90AEAD]/15 flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-bold text-[#244855] dark:text-white truncate">{task.title}</p>
                  <p className="text-xs text-[#90AEAD] truncate">{task.location}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(task.status)} flex-shrink-0`}>
                  {task.status}
                </span>
              </div>
            ))}
            {myTasks.filter(t => t.status !== 'completed').length === 0 && (
              <p className="text-xs text-[#90AEAD] text-center py-6">All tasks completed! Check in tomorrow.</p>
            )}
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">Recent Activity</h3>
            <button onClick={() => navigate('/dashboard/activity')} className="text-xs text-[#E64833] font-semibold hover:underline flex items-center gap-1">
              See Activity Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3.5">
            {[
              { action: 'Checked in at Andheri West Office', time: 'Today 9:02 AM', type: 'checkin' },
              { action: 'Completed Site Survey — Powai', time: 'Yesterday 5:45 PM', type: 'task' },
              { action: 'Claimed Travel Reimbursement ₹450', time: 'Yesterday 3:30 PM', type: 'expense' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#E64833] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#244855] dark:text-white font-semibold">{item.action}</p>
                  <p className="text-[10px] text-[#90AEAD] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
