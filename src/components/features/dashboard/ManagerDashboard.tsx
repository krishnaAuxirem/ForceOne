import { useState } from 'react';
import { CheckSquare, Users, MapPin, DollarSign, BarChart3, Plus, X, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_TASKS, MOCK_TEAM, MOCK_EXPENSES, CHART_DATA } from '@/lib/mockData';
import { getStatusColor, getPriorityColor, formatDate, generateId } from '@/lib/utils';
import type { Task, Expense } from '@/types';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useLocalStorage<Task[]>('force1_tasks', MOCK_TASKS);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('force1_expenses', MOCK_EXPENSES);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'tracking' | 'expenses' | 'reports'>('overview');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: 'agent-1', priority: 'medium', dueDate: '', location: '', category: 'Survey' });

  const pendingExpenses = expenses.filter(e => e.status === 'pending');

  const createTask = () => {
    if (!taskForm.title || !taskForm.dueDate) { toast.error('Fill required fields'); return; }
    const newTask: Task = {
      id: generateId(), title: taskForm.title, description: taskForm.description,
      assignedTo: taskForm.assignedTo, assignedBy: user?.id || 'manager-1',
      priority: taskForm.priority as Task['priority'], status: 'pending',
      dueDate: taskForm.dueDate, createdAt: new Date().toISOString().split('T')[0],
      location: taskForm.location, category: taskForm.category,
    };
    setTasks(prev => [newTask, ...prev]);
    setTaskForm({ title: '', description: '', assignedTo: 'agent-1', priority: 'medium', dueDate: '', location: '', category: 'Survey' });
    setShowTaskForm(false);
    toast.success('Task assigned successfully!');
  };

  const approveExpense = (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
    toast.success('Expense approved!');
  };

  const rejectExpense = (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
    toast.error('Expense rejected');
  };

  const TABS = ['overview', 'tasks', 'team', 'tracking', 'expenses', 'reports'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#244855] to-[#874F41] rounded-3xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold font-display">Manager Dashboard 📊</h1>
        <p className="text-[#FBE9D0]/80 mt-1">{user?.region} Region · {MOCK_TEAM.filter(m => m.role === 'agent').length} Agents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, sub: `${tasks.filter(t => t.status === 'pending').length} pending`, icon: CheckSquare, color: 'bg-[#244855]' },
          { label: 'Team Members', value: MOCK_TEAM.length, sub: `${MOCK_TEAM.filter(m => m.status === 'active').length} active`, icon: Users, color: 'bg-[#874F41]' },
          { label: 'Pending Approvals', value: pendingExpenses.length, sub: 'expenses', icon: DollarSign, color: 'bg-[#E64833]' },
          { label: 'Completion Rate', value: `${Math.round((tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1)) * 100)}%`, sub: 'this month', icon: BarChart3, color: 'bg-green-500' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-base p-5">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{s.value}</p>
              <p className="text-sm text-[#90AEAD]">{s.label}</p>
              <p className="text-xs text-[#90AEAD]/70">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] capitalize flex-shrink-0 ${activeTab === tab ? 'bg-white dark:bg-[#244855] text-[#244855] dark:text-white shadow-card' : 'text-[#90AEAD] hover:text-[#244855] dark:hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Weekly Task Completion</h3>
            <ResponsiveContainer width="100%" height={220}>
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
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Region Performance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_DATA.regionPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#90AEAD' }} domain={[0, 100]} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: '#90AEAD' }} width={50} />
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="score" fill="#244855" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">Task Management</h3>
            <button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#E64833] text-white rounded-xl text-sm font-semibold hover:bg-[#cc3d29] transition-all min-h-[44px]">
              <Plus className="w-4 h-4" /> Assign Task
            </button>
          </div>
          {showTaskForm && (
            <div className="mb-5 p-5 bg-[#f8fafb] dark:bg-[#244855]/20 rounded-2xl border border-[#90AEAD]/20">
              <div className="flex justify-between mb-3">
                <h4 className="font-bold text-sm text-[#244855] dark:text-white">New Task</h4>
                <button onClick={() => setShowTaskForm(false)}><X className="w-4 h-4 text-[#90AEAD]" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="input-field" placeholder="Task title *" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} />
                <input className="input-field" placeholder="Location" value={taskForm.location} onChange={e => setTaskForm(f => ({ ...f, location: e.target.value }))} />
                <textarea className="input-field sm:col-span-2 resize-none" rows={2} placeholder="Description" value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} />
                <select className="input-field" value={taskForm.assignedTo} onChange={e => setTaskForm(f => ({ ...f, assignedTo: e.target.value }))}>
                  {MOCK_TEAM.filter(m => m.role === 'agent').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <select className="input-field" value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}>
                  {['low', 'medium', 'high', 'urgent'].map(p => <option key={p}>{p}</option>)}
                </select>
                <input className="input-field" type="date" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} />
                <select className="input-field" value={taskForm.category} onChange={e => setTaskForm(f => ({ ...f, category: e.target.value }))}>
                  {['Survey', 'Client Visit', 'Data Collection', 'Installation', 'Report'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={createTask} className="mt-3 w-full py-2.5 bg-[#244855] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3340] transition-all">
                Assign Task
              </button>
            </div>
          )}
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#90AEAD]/20 hover:border-[#244855]/30 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#244855] dark:text-white">{task.title}</p>
                  <p className="text-xs text-[#90AEAD]">Assigned to: {MOCK_TEAM.find(m => m.id === task.assignedTo)?.name || task.assignedTo} · Due: {formatDate(task.dueDate)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium border flex-shrink-0 ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${getStatusColor(task.status)}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Team Overview</h3>
          <div className="space-y-3">
            {MOCK_TEAM.map(member => (
              <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#90AEAD]/20 hover:border-[#244855]/30 transition-all">
                <img src={member.avatar} alt={member.name} className="w-11 h-11 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#244855] dark:text-white">{member.name}</p>
                  <p className="text-xs text-[#90AEAD]">{member.region} · {member.phone}</p>
                </div>
                <div className="text-right text-xs text-[#90AEAD] hidden sm:block">
                  <div>Tasks: <span className="font-semibold text-[#244855] dark:text-white">{member.tasksCompleted}</span></div>
                  <div>Attendance: <span className="font-semibold text-[#244855] dark:text-white">{member.attendanceRate}%</span></div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Live Team Tracking</h3>
          <div className="relative rounded-2xl overflow-hidden bg-[#244855]/10 h-80 mb-4">
            <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&h=400&fit=crop" alt="map" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-[#244855]/50" />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-white text-xs font-semibold">LIVE TRACKING</span>
            </div>
            {MOCK_TEAM.filter(m => m.lat).map((m, i) => (
              <div key={m.id} className="absolute" style={{ left: `${20 + i * 15}%`, top: `${25 + (i % 3) * 20}%` }}>
                <div className="relative">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full border-2 border-white shadow-lg" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${m.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {MOCK_TEAM.slice(0, 4).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafb] dark:bg-[#244855]/20">
                <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#244855] dark:text-white">{m.name}</p>
                  <p className="text-xs text-[#90AEAD] flex items-center gap-1"><MapPin className="w-3 h-3" />{m.region}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Expense Approvals ({pendingExpenses.length} pending)</h3>
          <div className="space-y-3">
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#90AEAD]/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#244855] dark:text-white">{exp.title}</p>
                  <p className="text-xs text-[#90AEAD]">{exp.userName} · {exp.category} · {formatDate(exp.date)}</p>
                </div>
                <p className="text-sm font-bold text-[#244855] dark:text-white flex-shrink-0">₹{exp.amount.toLocaleString('en-IN')}</p>
                {exp.status === 'pending' ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approveExpense(exp.id)} className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all min-h-[32px]">Approve</button>
                    <button onClick={() => rejectExpense(exp.id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all min-h-[32px]">Reject</button>
                  </div>
                ) : (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${getStatusColor(exp.status)}`}>{exp.status}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Monthly Attendance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={CHART_DATA.monthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Line type="monotone" dataKey="present" stroke="#E64833" strokeWidth={2} dot={{ fill: '#E64833' }} />
                <Line type="monotone" dataKey="absent" stroke="#90AEAD" strokeWidth={2} dot={{ fill: '#90AEAD' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Top Performers</h3>
            <div className="space-y-3">
              {MOCK_TEAM.sort((a, b) => b.tasksCompleted - a.tasksCompleted).slice(0, 5).map((m, i) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#f8fafb] text-[#90AEAD]'}`}>{i + 1}</div>
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#244855] dark:text-white">{m.name}</p>
                    <div className="w-full bg-[#90AEAD]/20 rounded-full h-1.5 mt-1">
                      <div className="bg-[#E64833] h-1.5 rounded-full" style={{ width: `${(m.tasksCompleted / 220) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#244855] dark:text-white">{m.tasksCompleted}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
