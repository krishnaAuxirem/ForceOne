import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_TEAM, MOCK_TASKS } from '@/lib/mockData';
import type { TeamMember, Task } from '@/types';
import {
  Users, Search, Plus, Mail, Phone, MapPin, Eye, Edit3, Trash2, X, PlusCircle,
  BarChart3, CheckSquare, Award, Clock, ArrowUpRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function TeamPage() {
  const { user } = useAuth();
  const [team, setTeam] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);
  const [tasks, setTasks] = useLocalStorage<Task[]>('force1_tasks', MOCK_TASKS);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected agent details
  const [selectedAgent, setSelectedAgent] = useState<TeamMember | null>(null);
  
  // Quick task assignment
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: '', location: '', category: 'Survey' });

  const activeAgents = team.filter(m => m.role === 'agent');

  // Filter list
  const filteredTeam = activeAgents.filter(m => {
    return m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           m.region.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeam = filteredTeam.slice(startIndex, startIndex + itemsPerPage);

  const handleAssignQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    if (!taskForm.title || !taskForm.dueDate || !taskForm.location) {
      toast.error('All fields marked * are required.');
      return;
    }

    const newTask: Task = {
      id: 't-' + Math.random().toString(36).substr(2, 9),
      title: taskForm.title,
      description: 'Quick task assigned from team directory dashboard.',
      assignedTo: selectedAgent.id,
      assignedBy: user?.id || 'manager-1',
      priority: 'medium',
      status: 'pending',
      dueDate: taskForm.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      location: taskForm.location,
      category: taskForm.category,
    };

    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
    setTaskForm({ title: '', dueDate: '', location: '', category: 'Survey' });
    toast.success(`Task successfully assigned to ${selectedAgent.name}!`);
  };

  const handleToggleStatus = (agent: TeamMember) => {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    setTeam(prev => prev.map(t => t.id === agent.id ? { ...t, status: newStatus as any } : t));
    toast.success(`${agent.name} status set to ${newStatus}.`);
    if (selectedAgent?.id === agent.id) {
      setSelectedAgent(prev => prev ? { ...prev, status: newStatus as any } : null);
    }
  };

  const handleDeleteAgent = (id: string, name: string) => {
    if (confirm(`Remove agent ${name} from your managed team?`)) {
      setTeam(prev => prev.filter(t => t.id !== id));
      toast.success('Agent removed from directory.');
      if (selectedAgent?.id === id) setSelectedAgent(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Users className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">My Team</h1>
          </div>
          <p className="text-white/70 text-sm">Monitor agent logs, assign quick tasks, inspect attendance, and manage status alerts.</p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: activeAgents.length, sub: 'Staffing roster size', icon: Users, color: 'bg-[#244855]' },
          { label: 'Online / Active', value: activeAgents.filter(a => a.status === 'active').length, sub: 'Field tracking active', icon: Award, color: 'bg-green-500' },
          { label: 'Average Tasks', value: '157', sub: 'Completed per agent', icon: CheckSquare, color: 'bg-[#E64833]' },
          { label: 'Average Attendance', value: '95%', sub: 'Present rate', icon: Clock, color: 'bg-[#874F41]' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-base p-5 border border-[#90AEAD]/10">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
              </div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-[#244855]/85 dark:text-[#90AEAD]">{stat.label}</p>
              <p className="text-[10px] text-[#90AEAD]/80 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Filter and Search */}
      <div className="card-base p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-[#90AEAD]/10">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90AEAD]" />
          <input
            type="text"
            placeholder="Search team by name, region..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Team list datatable */}
      <div className="card-base border border-[#90AEAD]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 text-xs font-bold uppercase tracking-wider text-[#90AEAD]">
                <th className="px-5 py-4">Agent details</th>
                <th className="px-5 py-4">Zone region</th>
                <th className="px-5 py-4">Tasks done</th>
                <th className="px-5 py-4">Attendance Rate</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90AEAD]/10 font-semibold text-[#244855] dark:text-[#90AEAD]">
              {paginatedTeam.map(agent => (
                <tr key={agent.id} className="hover:bg-[#f8fafb]/60 dark:hover:bg-[#244855]/10">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img src={agent.avatar} alt={agent.name} className="w-9 h-9 rounded-full object-cover border border-[#244855]" />
                    <div>
                      <div className="font-bold text-[#244855] dark:text-white">{agent.name}</div>
                      <div className="text-[10px] text-[#90AEAD]">{agent.email}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{agent.region}</td>
                  <td className="px-5 py-3.5 font-bold">{agent.tasksCompleted}</td>
                  <td className="px-5 py-3.5 font-bold text-green-500">{agent.attendanceRate}%</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(agent)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase transition-all ${
                        agent.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {agent.status}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        title="View Performance"
                        className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAgent(agent.id, agent.name)}
                        title="Delete Agent"
                        className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-red-50 hover:text-red-500 transition-all min-h-[36px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTeam.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#90AEAD] text-xs">
                    No agents matched query search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#f8fafb] dark:bg-[#1a2d38] border-t border-[#90AEAD]/10 flex items-center justify-between">
            <span className="text-xs text-[#90AEAD]">
              Showing <span className="font-bold text-[#244855] dark:text-white">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-[#244855] dark:text-white">
                {Math.min(startIndex + itemsPerPage, filteredTeam.length)}
              </span>{' '}
              of <span className="font-bold text-[#244855] dark:text-white">{filteredTeam.length}</span> agents
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white dark:bg-[#244855] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-[#244855] dark:text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white dark:bg-[#244855] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TEAM PROFILE & ASSIGN TASK OVERLAY */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-xl overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between bg-[#244855]/5">
              <div className="flex items-center gap-3">
                <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-11 h-11 rounded-full object-cover border border-[#E64833]" />
                <div>
                  <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">{selectedAgent.name}</h3>
                  <span className="text-xs text-[#90AEAD] capitalize">Region: {selectedAgent.region}</span>
                </div>
              </div>
              <button onClick={() => { setSelectedAgent(null); setShowTaskForm(false); }} className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 border border-[#90AEAD]/10 rounded-xl space-y-1">
                  <span className="text-[#90AEAD]">Email Address</span>
                  <span className="block font-bold text-[#244855] dark:text-white flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#E64833]" />{selectedAgent.email}</span>
                </div>
                <div className="p-3 border border-[#90AEAD]/10 rounded-xl space-y-1">
                  <span className="text-[#90AEAD]">Phone Contact</span>
                  <span className="block font-bold text-[#244855] dark:text-white flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#E64833]" />{selectedAgent.phone}</span>
                </div>
                <div className="p-3 border border-[#90AEAD]/10 rounded-xl space-y-1">
                  <span className="text-[#90AEAD]">Roster status</span>
                  <span className={`block font-bold uppercase ${selectedAgent.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{selectedAgent.status}</span>
                </div>
                <div className="p-3 border border-[#90AEAD]/10 rounded-xl space-y-1">
                  <span className="text-[#90AEAD]">Attendance Score</span>
                  <span className="block font-bold text-green-500">{selectedAgent.attendanceRate}% Rate</span>
                </div>
              </div>

              {/* Quick assign task popup */}
              {showTaskForm ? (
                <form onSubmit={handleAssignQuickTask} className="p-4 bg-[#f8fafb] dark:bg-[#244855]/20 border border-[#90AEAD]/15 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-[#244855] dark:text-white">Assign Task Directly</div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#244855] dark:text-white uppercase mb-1">Task Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Inspect Depot Geofence"
                      value={taskForm.title}
                      onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                      className="input-field py-1.5 px-3 text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#244855] dark:text-white uppercase mb-1">Due Date *</label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                        className="input-field py-1.5 px-3 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#244855] dark:text-white uppercase mb-1">Category</label>
                      <select
                        value={taskForm.category}
                        onChange={e => setTaskForm(f => ({ ...f, category: e.target.value }))}
                        className="input-field font-semibold text-xs py-1.5 px-3"
                      >
                        {['Survey', 'Client Visit', 'Data Collection', 'Installation', 'Report'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#244855] dark:text-white uppercase mb-1">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Bandra East Depot"
                      value={taskForm.location}
                      onChange={e => setTaskForm(f => ({ ...f, location: e.target.value }))}
                      className="input-field py-1.5 px-3 text-xs"
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowTaskForm(false)} className="text-[10px] px-3 py-1.5 bg-gray-100 rounded-lg font-bold">Cancel</button>
                    <button type="submit" className="text-[10px] px-3 py-1.5 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-lg font-bold">Assign Task</button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Assign Quick Task
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
