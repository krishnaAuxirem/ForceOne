import { useState } from 'react';
import { CheckSquare, Clock, DollarSign, MapPin, Upload, Plus, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_TASKS, MOCK_ATTENDANCE, MOCK_EXPENSES } from '@/lib/mockData';
import { getStatusColor, getPriorityColor, formatDate, generateId } from '@/lib/utils';
import type { Task, AttendanceRecord, Expense } from '@/types';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WEEK_DATA = [
  { day: 'Mon', tasks: 4 }, { day: 'Tue', tasks: 6 }, { day: 'Wed', tasks: 3 },
  { day: 'Thu', tasks: 7 }, { day: 'Fri', tasks: 5 }, { day: 'Sat', tasks: 2 }, { day: 'Sun', tasks: 1 },
];

export default function AgentDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useLocalStorage<Task[]>('force1_tasks', MOCK_TASKS);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('force1_attendance', MOCK_ATTENDANCE);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('force1_expenses', MOCK_EXPENSES);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'attendance' | 'expenses' | 'activity'>('overview');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'Travel', description: '' });

  const myTasks = tasks.filter(t => t.assignedTo === user?.id || t.assignedTo === 'agent-1');
  const todayAttendance = attendance.find(a => a.userId === user?.id || a.userId === 'agent-1');
  const myExpenses = expenses.filter(e => e.userId === user?.id || e.userId === 'agent-1');

  const handleCheckIn = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const existing = attendance.find(a => (a.userId === user?.id || a.userId === 'agent-1') && a.date === today);
    if (existing) { toast.error('Already checked in today'); return; }
    const record: AttendanceRecord = {
      id: generateId(), userId: user?.id || 'agent-1', date: today,
      checkIn: now.toTimeString().slice(0, 5), status: now.getHours() >= 10 ? 'late' : 'present',
      location: 'Current GPS Location (Mock)',
    };
    setAttendance(prev => [record, ...prev]);
    toast.success('Checked in successfully!');
  };

  const handleCheckOut = () => {
    const today = new Date().toISOString().split('T')[0];
    setAttendance(prev => prev.map(a =>
      (a.userId === user?.id || a.userId === 'agent-1') && a.date === today
        ? { ...a, checkOut: new Date().toTimeString().slice(0, 5) }
        : a
    ));
    toast.success('Checked out successfully!');
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    toast.success(`Task marked as ${status}`);
  };

  const submitExpense = () => {
    if (!expenseForm.title || !expenseForm.amount) { toast.error('Please fill all required fields'); return; }
    const exp: Expense = {
      id: generateId(), userId: user?.id || 'agent-1', userName: user?.name || 'Agent',
      title: expenseForm.title, amount: parseFloat(expenseForm.amount), category: expenseForm.category,
      date: new Date().toISOString().split('T')[0], status: 'pending', description: expenseForm.description,
    };
    setExpenses(prev => [exp, ...prev]);
    setExpenseForm({ title: '', amount: '', category: 'Travel', description: '' });
    setShowExpenseForm(false);
    toast.success('Expense submitted for approval!');
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: CheckSquare },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'activity', label: 'Activity', icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#244855] to-[#1a3340] rounded-3xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[#90AEAD] text-sm mb-1">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'},</p>
            <h1 className="text-2xl md:text-3xl font-bold font-display">{user?.name}</h1>
            <p className="text-[#90AEAD] text-sm mt-1">{user?.region} · Field Agent</p>
          </div>
          <div className="flex gap-3">
            {!todayAttendance?.checkIn ? (
              <button onClick={handleCheckIn} className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-semibold text-sm transition-all">
                <Clock className="w-4 h-4" /> Check In
              </button>
            ) : !todayAttendance?.checkOut ? (
              <button onClick={handleCheckOut} className="flex items-center gap-2 px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-semibold text-sm transition-all">
                <Clock className="w-4 h-4" /> Check Out
              </button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl text-white text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" /> Done for today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Tasks', value: myTasks.length, sub: `${myTasks.filter(t => t.status === 'pending').length} pending`, icon: CheckSquare, color: 'bg-[#244855]' },
          { label: 'Completed', value: myTasks.filter(t => t.status === 'completed').length, sub: 'this week', icon: CheckCircle2, color: 'bg-green-500' },
          { label: 'Attendance', value: `${user?.attendanceRate || 96}%`, sub: 'this month', icon: Clock, color: 'bg-[#E64833]' },
          { label: 'Expenses', value: `₹${myExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN')}`, sub: `${myExpenses.filter(e => e.status === 'pending').length} pending`, icon: DollarSign, color: 'bg-[#874F41]' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-base p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{stat.value}</p>
              <p className="text-sm text-[#90AEAD] mt-0.5">{stat.label}</p>
              <p className="text-xs text-[#90AEAD]/70">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#244855] text-[#244855] dark:text-white shadow-card'
                  : 'text-[#90AEAD] hover:text-[#244855] dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">This Week's Tasks</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WEEK_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="tasks" fill="#E64833" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Today's Tasks</h3>
            <div className="space-y-3">
              {myTasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafb] dark:bg-[#244855]/20">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-[#244855] dark:text-white truncate ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>{task.title}</p>
                    <p className="text-xs text-[#90AEAD]">{task.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">My Tasks</h3>
          <div className="space-y-4">
            {myTasks.map(task => (
              <div key={task.id} className="border border-[#90AEAD]/20 rounded-2xl p-4 hover:border-[#244855]/40 transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-[#244855] dark:text-white text-sm">{task.title}</h4>
                    <p className="text-xs text-[#90AEAD] mt-1">{task.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#90AEAD]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{task.location || 'Field'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due: {formatDate(task.dueDate)}</span>
                  </div>
                  {task.status !== 'completed' && (
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <button onClick={() => updateTaskStatus(task.id, 'in-progress')} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all min-h-[32px]">
                          Start
                        </button>
                      )}
                      <button onClick={() => updateTaskStatus(task.id, 'completed')} className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all min-h-[32px]">
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Attendance History</h3>
          <div className="space-y-3">
            {attendance.filter(a => a.userId === 'agent-1' || a.userId === user?.id).map(record => (
              <div key={record.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#f8fafb] dark:bg-[#244855]/20">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${record.status === 'present' ? 'bg-green-500' : record.status === 'late' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#244855] dark:text-white">{formatDate(record.date)}</p>
                  {record.location && <p className="text-xs text-[#90AEAD] flex items-center gap-1"><MapPin className="w-3 h-3" />{record.location}</p>}
                </div>
                <div className="text-right text-xs text-[#90AEAD]">
                  {record.checkIn && <div>In: <span className="font-semibold text-[#244855] dark:text-white">{record.checkIn}</span></div>}
                  {record.checkOut && <div>Out: <span className="font-semibold text-[#244855] dark:text-white">{record.checkOut}</span></div>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(record.status)}`}>{record.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">My Expenses</h3>
            <button onClick={() => setShowExpenseForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#E64833] text-white rounded-xl text-sm font-semibold hover:bg-[#cc3d29] transition-all min-h-[44px]">
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>

          {showExpenseForm && (
            <div className="mb-5 p-5 bg-[#f8fafb] dark:bg-[#244855]/20 rounded-2xl border border-[#90AEAD]/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[#244855] dark:text-white text-sm">New Expense</h4>
                <button onClick={() => setShowExpenseForm(false)} className="p-1 rounded-lg hover:bg-[#90AEAD]/20 text-[#90AEAD]"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="input-field" placeholder="Expense title *" value={expenseForm.title} onChange={e => setExpenseForm(f => ({ ...f, title: e.target.value }))} />
                <input className="input-field" type="number" placeholder="Amount (₹) *" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} />
                <select className="input-field" value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}>
                  {['Travel', 'Entertainment', 'Office', 'Equipment', 'Others'].map(c => <option key={c}>{c}</option>)}
                </select>
                <input className="input-field" placeholder="Description" value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <button onClick={submitExpense} className="mt-3 w-full py-2.5 bg-[#244855] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3340] transition-all">
                Submit for Approval
              </button>
            </div>
          )}

          <div className="space-y-3">
            {myExpenses.map(exp => (
              <div key={exp.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#90AEAD]/20 hover:border-[#244855]/30 transition-all">
                <div className="w-10 h-10 bg-[#E64833]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4.5 h-4.5 text-[#E64833]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#244855] dark:text-white">{exp.title}</p>
                  <p className="text-xs text-[#90AEAD]">{exp.category} · {formatDate(exp.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#244855] dark:text-white">₹{exp.amount.toLocaleString('en-IN')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(exp.status)}`}>{exp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Activity History</h3>
          <div className="space-y-4">
            {[
              { action: 'Completed task: Data Collection — Bandra', time: 'Today 2:30 PM', icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
              { action: 'Submitted expense: Auto Rickshaw Fare ₹850', time: 'Today 11:00 AM', icon: DollarSign, color: 'text-[#E64833] bg-[#E64833]/10' },
              { action: 'Checked in at Andheri Office', time: 'Today 9:02 AM', icon: Clock, color: 'text-blue-500 bg-blue-100' },
              { action: 'Updated task status: Site Survey (In Progress)', time: 'Yesterday 3:15 PM', icon: CheckSquare, color: 'text-[#244855] bg-[#244855]/10' },
              { action: 'Checked out', time: 'Yesterday 6:30 PM', icon: Clock, color: 'text-amber-500 bg-amber-100' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#244855] dark:text-white">{item.action}</p>
                    <p className="text-xs text-[#90AEAD] mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
