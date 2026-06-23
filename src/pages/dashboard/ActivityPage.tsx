import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_TEAM } from '@/lib/mockData';
import type { TeamMember } from '@/types';
import {
  FileText, Search, Filter, Clock, MapPin, CheckCircle2, DollarSign,
  Users, User, Compass, Calendar, AlertCircle, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ActivityLog {
  id: string;
  userName: string;
  userRole: string;
  avatar: string;
  action: string;
  timestamp: string;
  category: 'checkin' | 'task' | 'expense' | 'admin' | 'gps';
  details?: string;
}

export default function ActivityPage() {
  const [team] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock comprehensive list of activities
  const [activities] = useState<ActivityLog[]>([
    { id: 'act1', userName: 'Rahul Sharma', userRole: 'agent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', action: 'Completed task: Data Collection — Bandra', timestamp: '2026-06-22T14:30:00', category: 'task', details: 'Remarks: Collected retail prices of 20 products.' },
    { id: 'act2', userName: 'Rahul Sharma', userRole: 'agent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', action: 'Submitted expense claim: Auto Rickshaw Fare ₹850', timestamp: '2026-06-22T11:00:00', category: 'expense', details: 'Auto rickshaw fare for Bandra client round trip.' },
    { id: 'act3', userName: 'Priya Patel', userRole: 'manager', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face', action: 'Approved Expense Claim: Local Train Pass (Sneha Desai)', timestamp: '2026-06-22T10:15:00', category: 'expense' },
    { id: 'act4', userName: 'Rahul Sharma', userRole: 'agent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', action: 'Checked in at Andheri West Office', timestamp: '2026-06-22T09:02:00', category: 'checkin', details: 'Location: 19.118, 72.856' },
    { id: 'act5', userName: 'Sneha Desai', userRole: 'agent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face', action: 'Checked in at Dadar Office', timestamp: '2026-06-22T09:00:00', category: 'checkin' },
    { id: 'act6', userName: 'Arjun Singh', userRole: 'admin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', action: 'Registered user account: Vijay Kumar (Field Agent)', timestamp: '2026-06-21T17:30:00', category: 'admin', details: 'Assigned region: Pune. Initial status: Active.' },
    { id: 'act7', userName: 'Kiran Joshi', userRole: 'agent', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face', action: 'GPS boundary entry detected: Thane Logistics Park', timestamp: '2026-06-21T15:15:00', category: 'gps', details: 'Triggered automatically via geofence entry.' },
    { id: 'act8', userName: 'Priya Patel', userRole: 'manager', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face', action: 'Assigned new task: Client Visit — Powai to Sneha Desai', timestamp: '2026-06-21T11:00:00', category: 'task' },
  ]);

  // Filters logic
  const filteredActivities = activities.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;

    return matchesSearch && matchesCategory && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryIcon = (category: ActivityLog['category']) => {
    switch (category) {
      case 'checkin':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'expense':
        return <DollarSign className="w-4 h-4 text-[#E64833]" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-[#244855]" />;
      case 'gps':
      default:
        return <Compass className="w-4 h-4 text-amber-500" />;
    }
  };

  const getCategoryColor = (category: ActivityLog['category']) => {
    switch (category) {
      case 'checkin':
        return 'bg-blue-100 dark:bg-blue-500/10 text-blue-600';
      case 'task':
        return 'bg-green-100 dark:bg-green-500/10 text-green-600';
      case 'expense':
        return 'bg-[#E64833]/10 text-[#E64833]';
      case 'admin':
        return 'bg-[#244855]/10 text-[#244855]';
      case 'gps':
      default:
        return 'bg-amber-100 dark:bg-amber-500/10 text-amber-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <FileText className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">System Audit Logs</h1>
          </div>
          <p className="text-white/70 text-sm">Monitor system events, tasks progress, automated geofence pings, and expense reviews.</p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="card-base p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-[#90AEAD]/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90AEAD]" />
          <input
            type="text"
            placeholder="Search by action, name..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <div>
          <select 
            value={categoryFilter} 
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All Event Categories</option>
            <option value="checkin">Check-in Statuses</option>
            <option value="task">Tasks Progress</option>
            <option value="expense">Expenses Updates</option>
            <option value="admin">Admin System Actions</option>
            <option value="gps">GPS Boundary Pings</option>
          </select>
        </div>
        <div>
          <select 
            value={roleFilter} 
            onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }} 
            className="input-field font-semibold text-xs"
          >
            <option value="all">All User Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Field Agent</option>
          </select>
        </div>
      </div>

      {/* Timeline Audit Logs */}
      <div className="card-base p-6 border border-[#90AEAD]/10">
        <div className="relative border-l-2 border-[#90AEAD]/20 pl-6 space-y-6.5 py-2">
          {paginatedLogs.map(log => (
            <div key={log.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#1a2d38] border-2 border-[#244855] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#E64833] rounded-full" />
              </div>
              
              <div className="flex gap-3 items-start flex-1 pr-4">
                <img src={log.avatar} alt={log.userName} className="w-8 h-8 rounded-full object-cover border border-[#90AEAD]/20" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#244855] dark:text-white">{log.userName}</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#90AEAD]/10 text-[#90AEAD]">{log.userRole}</span>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${getCategoryColor(log.category)}`}>
                      {getCategoryIcon(log.category)} {log.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#244855] dark:text-white mt-1.5">
                    {log.action}
                  </p>
                  {log.details && (
                    <p className="text-[10.5px] text-[#90AEAD] mt-1 bg-[#f8fafb]/60 dark:bg-[#1a2d38]/40 p-2 rounded border border-[#90AEAD]/10">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right text-[10px] text-[#90AEAD]/70 flex-shrink-0">
                <span className="flex items-center gap-1 sm:justify-end"><Clock className="w-3.5 h-3.5" />{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="block mt-0.5">{new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          ))}

          {paginatedLogs.length === 0 && (
            <div className="text-center py-10">
              <AlertCircle className="w-8 h-8 text-[#90AEAD] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#90AEAD]">No activities match your filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#f8fafb] dark:bg-[#1a2d38] border-t border-[#90AEAD]/10 flex items-center justify-between mt-6 -mx-6 -mb-6">
            <span className="text-xs text-[#90AEAD]">
              Showing <span className="font-bold text-[#244855] dark:text-white">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-[#244855] dark:text-white">
                {Math.min(startIndex + itemsPerPage, filteredActivities.length)}
              </span>{' '}
              of <span className="font-bold text-[#244855] dark:text-white">{filteredActivities.length}</span> logs
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
    </div>
  );
}
