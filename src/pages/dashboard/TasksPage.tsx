import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_TASKS, MOCK_TEAM } from '@/lib/mockData';
import type { Task, TeamMember } from '@/types';
import {
  CheckSquare, Plus, Search, Filter, Trash2, Edit3, Eye, Calendar,
  MapPin, Clock, Shield, PlusCircle, CheckCircle, Upload, AlertCircle, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getStatusColor, getPriorityColor, formatDate, generateId } from '@/lib/utils';
import { toast } from 'sonner';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useLocalStorage<Task[]>('force1_tasks', MOCK_TASKS);
  const [team] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected item states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Agent proof submissions
  const [remarks, setRemarks] = useState('');
  const [fileName, setFileName] = useState('');

  // Form states for creating/editing
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    assignedTo: 'agent-1',
    priority: 'medium',
    dueDate: '',
    location: '',
    category: 'Survey',
  });

  // Authorization checks
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  // Filter tasks based on search, role and filters
  const filteredTasks = tasks.filter(task => {
    // Role filter: Agents only see tasks assigned to them
    const matchesUser = isAdminOrManager || task.assignedTo === user?.id || task.assignedTo === 'agent-1';
    
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesUser && matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.dueDate || !formState.location) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const newTask: Task = {
      id: generateId(),
      title: formState.title,
      description: formState.description,
      assignedTo: formState.assignedTo,
      assignedBy: user?.id || 'admin-1',
      priority: formState.priority as Task['priority'],
      status: 'pending',
      dueDate: formState.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      location: formState.location,
      category: formState.category,
    };
    setTasks(prev => [newTask, ...prev]);
    setIsCreateOpen(false);
    toast.success('Task created and assigned successfully!');
    setFormState({
      title: '',
      description: '',
      assignedTo: 'agent-1',
      priority: 'medium',
      dueDate: '',
      location: '',
      category: 'Survey',
    });
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;
    if (!formState.title || !formState.dueDate || !formState.location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setTasks(prev => prev.map(t => t.id === taskToEdit.id ? { ...t, ...formState, priority: formState.priority as any } : t));
    setIsEditOpen(false);
    setTaskToEdit(null);
    toast.success('Task details updated successfully!');
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setFormState({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate,
      location: task.location || '',
      category: task.category,
    });
    setIsEditOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task has been permanently deleted.');
      if (selectedTask?.id === id) setSelectedTask(null);
    }
  };

  const handleAgentStatusUpdate = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success(`Task status updated to ${newStatus}`);
    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleCompleteWithProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!remarks) {
      toast.error('Completion remarks are required.');
      return;
    }
    
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { 
      ...t, 
      status: 'completed',
      proof: fileName ? `Uploaded file: ${fileName}` : 'Remarks: ' + remarks
    } : t));

    toast.success('Task marked as completed! Proof submitted.');
    setRemarks('');
    setFileName('');
    setSelectedTask(null);
  };

  const categories = ['Survey', 'Client Visit', 'Data Collection', 'Installation', 'Report'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/90 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">Task Board</h1>
          </div>
          <p className="text-white/70 text-sm">
            {isAdminOrManager 
              ? `Manage and assign field operations. (${filteredTasks.length} tasks matched)`
              : `View your assigned tasks and log field progress.`}
          </p>
        </div>
        {isAdminOrManager && (
          <button 
            onClick={() => {
              setFormState({
                title: '',
                description: '',
                assignedTo: team.filter(m => m.role === 'agent')[0]?.id || 'agent-1',
                priority: 'medium',
                dueDate: '',
                location: '',
                category: 'Survey',
              });
              setIsCreateOpen(true);
            }} 
            className="flex items-center gap-2 px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-bold text-sm shadow transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4" /> Create & Assign Task
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="card-base p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 border border-[#90AEAD]/10">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90AEAD]" />
          <input
            type="text"
            placeholder="Search by title, location..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field pl-9"
          />
        </div>

        <div>
          <select 
            value={statusFilter} 
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <select 
            value={priorityFilter} 
            onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <select 
            value={categoryFilter} 
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Main Datatable */}
      <div className="card-base border border-[#90AEAD]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 text-xs font-bold uppercase tracking-wider text-[#90AEAD]">
                <th className="px-5 py-4">Task Details</th>
                <th className="px-5 py-4">Assignee</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90AEAD]/10 text-sm">
              {paginatedTasks.map(task => {
                const assignee = team.find(m => m.id === task.assignedTo);
                return (
                  <tr key={task.id} className="hover:bg-[#f8fafb] dark:hover:bg-[#244855]/10 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#244855] dark:text-white">{task.title}</div>
                      <div className="flex items-center gap-3 text-xs text-[#90AEAD] mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{task.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Due {formatDate(task.dueDate)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#244855] text-[#FBE9D0] font-bold text-[10px] flex items-center justify-center border border-[#90AEAD]/20 flex-shrink-0">
                            {assignee.name ? assignee.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-xs text-[#244855] dark:text-white">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#90AEAD] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-[#244855] dark:text-white">{task.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setSelectedTask(task)} 
                          title="View Details" 
                          className="p-2 rounded-xl text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isAdminOrManager && (
                          <>
                            <button 
                              onClick={() => openEditModal(task)} 
                              title="Edit Task" 
                              className="p-2 rounded-xl text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)} 
                              title="Delete Task" 
                              className="p-2 rounded-xl text-[#90AEAD] hover:bg-red-50 hover:text-red-500 transition-all min-h-[36px]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#90AEAD] text-xs">
                    No tasks found matching current filters.
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
                {Math.min(startIndex + itemsPerPage, filteredTasks.length)}
              </span>{' '}
              of <span className="font-bold text-[#244855] dark:text-white">{filteredTasks.length}</span> entries
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white dark:bg-[#244855] hover:bg-[#f8fafb] dark:hover:bg-[#1a3340] border border-[#90AEAD]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] transition-all min-h-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-[#244855] dark:text-white px-2">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white dark:bg-[#244855] hover:bg-[#f8fafb] dark:hover:bg-[#1a3340] border border-[#90AEAD]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] transition-all min-h-[36px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">New Task Assignment</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Survey Market Yard"
                  value={formState.title}
                  onChange={e => setFormState(f => ({ ...f, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Description</label>
                <textarea
                  placeholder="Add details, instructions..."
                  value={formState.description}
                  onChange={e => setFormState(f => ({ ...f, description: e.target.value }))}
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assignee *</label>
                  <select
                    value={formState.assignedTo}
                    onChange={e => setFormState(f => ({ ...f, assignedTo: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {team.filter(m => m.role === 'agent').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={formState.priority}
                    onChange={e => setFormState(f => ({ ...f, priority: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={formState.dueDate}
                    onChange={e => setFormState(f => ({ ...f, dueDate: e.target.value }))}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState(f => ({ ...f, category: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra West, Mumbai"
                  value={formState.location}
                  onChange={e => setFormState(f => ({ ...f, location: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Assign Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && taskToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">Edit Task Details</h3>
              <button onClick={() => { setIsEditOpen(false); setTaskToEdit(null); }} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEditTask} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Task Title *</label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={e => setFormState(f => ({ ...f, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={formState.description}
                  onChange={e => setFormState(f => ({ ...f, description: e.target.value }))}
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assignee</label>
                  <select
                    value={formState.assignedTo}
                    onChange={e => setFormState(f => ({ ...f, assignedTo: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {team.filter(m => m.role === 'agent').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={formState.priority}
                    onChange={e => setFormState(f => ({ ...f, priority: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={formState.dueDate}
                    onChange={e => setFormState(f => ({ ...f, dueDate: e.target.value }))}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState(f => ({ ...f, category: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Location *</label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={e => setFormState(f => ({ ...f, location: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3 bg-[#244855] hover:bg-[#1a3340] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Save Task Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between bg-[#244855]/5">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#90AEAD] tracking-widest">{selectedTask.category} Task Details</span>
                <h3 className="text-base font-bold text-[#244855] dark:text-white font-display mt-0.5">{selectedTask.title}</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs text-[#244855]/90 dark:text-[#90AEAD] bg-[#f8fafb] dark:bg-[#244855]/20 p-4.5 rounded-2xl border border-[#90AEAD]/10 whitespace-pre-wrap">
                {selectedTask.description || 'No detailed instructions provided for this task.'}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs text-[#90AEAD]">
                <div className="flex flex-col gap-1 p-3 border border-[#90AEAD]/10 rounded-xl">
                  <span>Priority</span>
                  <span className={`font-bold mt-1 uppercase ${getPriorityColor(selectedTask.priority)}`}>{selectedTask.priority}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 border border-[#90AEAD]/10 rounded-xl">
                  <span>Status</span>
                  <span className={`font-bold mt-1 uppercase ${getStatusColor(selectedTask.status)}`}>{selectedTask.status}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 border border-[#90AEAD]/10 rounded-xl">
                  <span>Due Date</span>
                  <span className="font-bold text-[#244855] dark:text-white mt-1">{formatDate(selectedTask.dueDate)}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 border border-[#90AEAD]/10 rounded-xl">
                  <span>Location</span>
                  <span className="font-bold text-[#244855] dark:text-white mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedTask.location}</span>
                </div>
              </div>

              {/* Display proof details if task completed */}
              {selectedTask.status === 'completed' && selectedTask.proof && (
                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-xs text-green-700 dark:text-green-400">
                  <span className="font-bold block mb-1">Completion Verification Info:</span>
                  {selectedTask.proof}
                </div>
              )}

              {/* Role-based actions inside details */}
              {!isAdminOrManager && selectedTask.status !== 'completed' && (
                <div className="border-t border-[#90AEAD]/15 pt-4 space-y-4">
                  {selectedTask.status === 'pending' && (
                    <button
                      onClick={() => handleAgentStatusUpdate(selectedTask.id, 'in-progress')}
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow"
                    >
                      Start Tasks Work (In Progress)
                    </button>
                  )}
                  {selectedTask.status === 'in-progress' && (
                    <form onSubmit={handleCompleteWithProof} className="space-y-3 bg-[#f8fafb] dark:bg-[#244855]/20 p-4 rounded-2xl border border-[#90AEAD]/15">
                      <div className="text-xs font-bold text-[#244855] dark:text-white">Submit Task Completion Proof</div>
                      <div>
                        <textarea
                          placeholder="Provide final remarks/notes..."
                          value={remarks}
                          onChange={e => setRemarks(e.target.value)}
                          className="input-field text-xs resize-none"
                          rows={2}
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center justify-between border border-[#90AEAD]/20 bg-white dark:bg-[#1a2d38] p-3 rounded-xl cursor-pointer hover:border-[#244855] transition-all">
                          <span className="text-xs text-[#90AEAD] truncate">{fileName || 'Attach Proof (photo/pdf)...'}</span>
                          <Upload className="w-4 h-4 text-[#90AEAD]" />
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={e => setFileName(e.target.files?.[0]?.name || '')} 
                          />
                        </label>
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all shadow">
                        Mark as Completed & Upload Proof
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
