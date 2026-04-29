import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Clock, DollarSign, Users, Map, BarChart3,
  Settings, FileText, MapPin, Menu, X, Bell, LogOut, ChevronRight, Newspaper,
  Shield, BookOpen, User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AGENT_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/dashboard/tasks', icon: CheckSquare, label: 'My Tasks' },
  { to: '/dashboard/attendance', icon: Clock, label: 'Attendance' },
  { to: '/dashboard/expenses', icon: DollarSign, label: 'Expenses' },
  { to: '/dashboard/activity', icon: FileText, label: 'Activity' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

const MANAGER_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/dashboard/team', icon: Users, label: 'My Team' },
  { to: '/dashboard/tracking', icon: Map, label: 'Live Tracking' },
  { to: '/dashboard/expenses', icon: DollarSign, label: 'Expenses' },
  { to: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

const ADMIN_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/dashboard/users', icon: Users, label: 'Users' },
  { to: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/dashboard/tracking', icon: Map, label: 'Live Tracking' },
  { to: '/dashboard/regions', icon: MapPin, label: 'Regions' },
  { to: '/dashboard/expenses', icon: DollarSign, label: 'Expenses' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/blog', icon: Newspaper, label: 'Blog Mgmt' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? ADMIN_LINKS
    : user?.role === 'manager' ? MANAGER_LINKS
    : AGENT_LINKS;

  const isActive = (link: { to: string; exact?: boolean }) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to) && link.to !== '/dashboard';
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E64833] rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-white font-display">Force<span className="text-[#E64833]">1</span></span>
        </Link>
        <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg text-[#90AEAD] hover:text-white hover:bg-white/10 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 mx-3 mt-4 rounded-xl bg-white/8 border border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=244855&color=FBE9D0`}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#E64833]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot"></div>
              <span className="text-xs text-[#90AEAD] capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 mt-3 overflow-y-auto space-y-0.5">
        <p className="text-[10px] font-semibold text-[#90AEAD]/60 uppercase tracking-widest px-3 mb-2">
          {user?.role === 'admin' ? 'Administration' : user?.role === 'manager' ? 'Management' : 'Field Operations'}
        </p>
        {links.map(link => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] group ${
                active
                  ? 'bg-[#E64833]/25 text-white border border-[#E64833]/30'
                  : 'text-[#90AEAD] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-[#E64833]' : 'text-[#90AEAD] group-hover:text-white'}`} />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-[#E64833]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#90AEAD] hover:text-white hover:bg-white/10 transition-all text-sm min-h-[44px]">
          <BookOpen className="w-4 h-4" />
          <span>Back to Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#90AEAD] hover:text-[#E64833] hover:bg-[#E64833]/10 transition-all text-sm min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1a2d38] min-h-screen fixed left-0 top-0 z-30 border-r border-white/5">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-72 bg-[#1a2d38] h-full flex flex-col z-10 animate-fade-in-left">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
