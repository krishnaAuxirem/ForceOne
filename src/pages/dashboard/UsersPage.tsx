import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_TEAM, MOCK_REGIONS } from '@/lib/mockData';
import type { TeamMember, Region } from '@/types';
import {
  Users, Search, Filter, Plus, Edit3, Trash2, Eye, ShieldAlert,
  Calendar, Phone, Mail, MapPin, Check, X, Shield, Lock, Activity, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getStatusColor, generateId } from '@/lib/utils';
import { toast } from 'sonner';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [team, setTeam] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);
  const [regions] = useLocalStorage<Region[]>('force1_regions', MOCK_REGIONS);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<TeamMember | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'agent',
    status: 'active',
    region: 'Mumbai North',
  });

  // Permissions settings for Selected User
  const [userPermissions, setUserPermissions] = useState({
    createTasks: true,
    approveExpenses: false,
    viewAnalytics: true,
    manageRegions: false,
  });

  // Filter team members
  const filteredTeam = team.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeam = filteredTeam.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.phone) {
      toast.error('All fields marked * are required.');
      return;
    }

    // Check if user already exists
    if (team.some(t => t.email.toLowerCase() === formState.email.toLowerCase())) {
      toast.error('A user with this email address already exists.');
      return;
    }

    const newUser: TeamMember = {
      id: generateId(),
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      role: formState.role as any,
      status: formState.status as any,
      region: formState.region,
      tasksCompleted: 0,
      attendanceRate: 100,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formState.name)}&background=244855&color=FBE9D0&size=100`,
    };

    setTeam(prev => [...prev, newUser]);
    setIsCreateOpen(false);
    toast.success(`${formState.name} registered successfully!`);
    resetForm();
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    if (!formState.name || !formState.email || !formState.phone) {
      toast.error('All fields marked * are required.');
      return;
    }

    setTeam(prev => prev.map(u => u.id === userToEdit.id ? { ...u, ...formState, role: formState.role as any, status: formState.status as any } : u));
    setIsEditOpen(false);
    setUserToEdit(null);
    toast.success('User profile updated successfully!');
  };

  const openEditModal = (member: TeamMember) => {
    setUserToEdit(member);
    setFormState({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
      region: member.region,
    });
    setIsEditOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    const member = team.find(t => t.id === id);
    if (!member) return;

    if (confirm(`Are you sure you want to permanently delete the user account for ${member.name}?`)) {
      setTeam(prev => prev.filter(t => t.id !== id));
      toast.success('User has been removed from the directory.');
      if (selectedUser?.id === id) setSelectedUser(null);
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      phone: '',
      role: 'agent',
      status: 'active',
      region: 'Mumbai North',
    });
  };

  const viewUserDetails = (member: TeamMember) => {
    setSelectedUser(member);
    // Initialize permissions based on role
    setUserPermissions({
      createTasks: member.role === 'admin' || member.role === 'manager',
      approveExpenses: member.role === 'admin' || member.role === 'manager',
      viewAnalytics: true,
      manageRegions: member.role === 'admin',
    });
  };

  const handleToggleStatus = (member: TeamMember) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    setTeam(prev => prev.map(t => t.id === member.id ? { ...t, status: newStatus as any } : t));
    toast.success(`Account status of ${member.name} changed to ${newStatus}.`);
    if (selectedUser?.id === member.id) {
      setSelectedUser(prev => prev ? { ...prev, status: newStatus as any } : null);
    }
  };

  // Mock Activity Logs per user
  const mockUserActivities = [
    { text: 'Checked in at site office', date: 'Today, 9:02 AM' },
    { text: 'Completed Client Visit task', date: 'Yesterday, 4:15 PM' },
    { text: 'Submitted Travel Expense report', date: 'Yesterday, 1:20 PM' },
    { text: 'Updated task status to In Progress', date: '2 days ago, 11:30 AM' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Users className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">User Directory</h1>
          </div>
          <p className="text-white/70 text-sm">Create, inspect, configure permissions, and log performance metrics for force members.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button 
            onClick={() => { resetForm(); setIsCreateOpen(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-bold text-sm shadow transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4" /> Add New User
          </button>
        )}
      </div>

      {/* Filter Options */}
      <div className="card-base p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-[#90AEAD]/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90AEAD]" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <div>
          <select 
            value={roleFilter} 
            onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="agent">Field Agent</option>
          </select>
        </div>
        <div>
          <select 
            value={statusFilter} 
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Datatable */}
      <div className="card-base border border-[#90AEAD]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafb] dark:bg-[#1a2d38] border-b border-[#90AEAD]/10 text-xs font-bold uppercase tracking-wider text-[#90AEAD]">
                <th className="px-5 py-4">Full Identity</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Assigned Region</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90AEAD]/10 text-sm">
              {paginatedTeam.map(member => (
                <tr key={member.id} className="hover:bg-[#f8fafb] dark:hover:bg-[#244855]/10 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#244855] text-[#FBE9D0] font-bold text-xs flex items-center justify-center border border-[#90AEAD]/20 flex-shrink-0">
                        {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-[#244855] dark:text-white">{member.name}</div>
                        <div className="text-xs text-[#90AEAD]">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-xs font-bold capitalize text-[#244855] dark:text-white">
                      <Shield className="w-3.5 h-3.5 text-[#E64833]" /> {member.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#244855] dark:text-white">
                    {member.region}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      disabled={currentUser?.role !== 'admin'}
                      onClick={() => handleToggleStatus(member)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {member.status}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => viewUserDetails(member)}
                        title="View Full Profile"
                        className="p-2 rounded-xl text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {currentUser?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => openEditModal(member)}
                            title="Edit User Profile"
                            className="p-2 rounded-xl text-[#90AEAD] hover:bg-[#244855]/10 hover:text-[#244855] dark:hover:text-white transition-all min-h-[36px]"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(member.id)}
                            title="Delete User"
                            className="p-2 rounded-xl text-[#90AEAD] hover:bg-red-50 hover:text-red-500 transition-all min-h-[36px]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTeam.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[#90AEAD] text-xs">
                    No users match your filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#f8fafb] dark:bg-[#1a2d38] border-t border-[#90AEAD]/10 flex items-center justify-between">
            <span className="text-xs text-[#90AEAD]">
              Showing <span className="font-bold text-[#244855] dark:text-white">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-[#244855] dark:text-white">
                {Math.min(startIndex + itemsPerPage, filteredTeam.length)}
              </span>{' '}
              of <span className="font-bold text-[#244855] dark:text-white">{filteredTeam.length}</span> records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white dark:bg-[#244855] hover:bg-[#f8fafb] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-[#244855] dark:text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white dark:bg-[#244855] hover:bg-[#f8fafb] border border-[#90AEAD]/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[#90AEAD] min-h-[36px] flex items-center justify-center"
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
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">Add User Account</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formState.name}
                  onChange={e => setFormState(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="name@force1.in"
                    value={formState.email}
                    onChange={e => setFormState(f => ({ ...f, email: e.target.value }))}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formState.phone}
                    onChange={e => setFormState(f => ({ ...f, phone: e.target.value }))}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">System Role *</label>
                  <select
                    value={formState.role}
                    onChange={e => setFormState(f => ({ ...f, role: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    <option value="agent">Field Agent</option>
                    <option value="manager">Manager</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assigned Region</label>
                  <select
                    value={formState.region}
                    onChange={e => setFormState(f => ({ ...f, region: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Initial Status</label>
                <select
                  value={formState.status}
                  onChange={e => setFormState(f => ({ ...f, status: e.target.value }))}
                  className="input-field font-semibold text-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Register User Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && userToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">Edit User Profile</h3>
              <button onClick={() => { setIsEditOpen(false); setUserToEdit(null); }} className="p-1 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEditUser} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={e => setFormState(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={e => setFormState(f => ({ ...f, email: e.target.value }))}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={e => setFormState(f => ({ ...f, phone: e.target.value }))}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">System Role *</label>
                  <select
                    value={formState.role}
                    onChange={e => setFormState(f => ({ ...f, role: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    <option value="agent">Field Agent</option>
                    <option value="manager">Manager</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Assigned Region</label>
                  <select
                    value={formState.region}
                    onChange={e => setFormState(f => ({ ...f, region: e.target.value }))}
                    className="input-field font-semibold text-xs"
                  >
                    {regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244855] dark:text-white uppercase tracking-wider mb-1">Account Status</label>
                <select
                  value={formState.status}
                  onChange={e => setFormState(f => ({ ...f, status: e.target.value }))}
                  className="input-field font-semibold text-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 bg-[#244855] hover:bg-[#1a3340] text-white rounded-xl font-bold text-sm shadow transition-all mt-2">
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2d38] rounded-3xl w-full max-w-2xl overflow-hidden shadow-xl animate-scale-in">
            <div className="p-5 border-b border-[#90AEAD]/10 flex items-center justify-between bg-[#244855]/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E64833] text-white font-bold text-sm flex items-center justify-center border border-[#E64833] flex-shrink-0">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#244855] dark:text-white font-display">{selectedUser.name}</h3>
                  <span className="text-xs text-[#90AEAD] capitalize">{selectedUser.role} · {selectedUser.region}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg text-[#90AEAD] hover:bg-[#244855]/10"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 grid md:grid-cols-2 gap-6">
              {/* Profile Details & Permissions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#90AEAD] tracking-widest mb-3">Contact Information</h4>
                  <div className="space-y-2 text-xs text-[#244855] dark:text-[#90AEAD]">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#E64833]" />{selectedUser.email}</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#E64833]" />{selectedUser.phone}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#E64833]" />{selectedUser.region}</div>
                  </div>
                </div>

                <div className="border-t border-[#90AEAD]/10 pt-4">
                  <h4 className="text-xs uppercase font-bold text-[#90AEAD] tracking-widest mb-3 flex items-center gap-1">
                    <Lock className="w-4 h-4" /> Role Permissions
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { key: 'createTasks', label: 'Create & Assign Tasks' },
                      { key: 'approveExpenses', label: 'Approve Expenses' },
                      { key: 'viewAnalytics', label: 'View Performance Analytics' },
                      { key: 'manageRegions', label: 'Manage Global Regions' },
                    ].map(p => (
                      <div key={p.key} className="flex items-center justify-between p-2 bg-[#f8fafb] dark:bg-[#244855]/10 rounded-lg">
                        <span className="text-xs font-semibold text-[#244855] dark:text-white">{p.label}</span>
                        <div className="flex items-center">
                          {userPermissions[p.key as keyof typeof userPermissions] ? (
                            <Check className="w-4 h-4 text-green-500 font-bold" />
                          ) : (
                            <X className="w-4 h-4 text-red-400 font-bold" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Logs */}
              <div className="border-t md:border-t-0 md:border-l border-[#90AEAD]/10 md:pl-6 space-y-4">
                <h4 className="text-xs uppercase font-bold text-[#90AEAD] tracking-widest mb-3 flex items-center gap-1">
                  <Activity className="w-4 h-4 text-[#E64833]" /> Activity History
                </h4>
                <div className="relative border-l border-[#90AEAD]/20 pl-4 space-y-4.5 py-1">
                  {mockUserActivities.map((act, i) => (
                    <div key={i} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#E64833] rounded-full border border-white dark:border-[#1a2d38]" />
                      <div className="text-xs font-semibold text-[#244855] dark:text-white">{act.text}</div>
                      <div className="text-[10px] text-[#90AEAD] mt-0.5">{act.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
