import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AgentDashboard from '@/components/features/dashboard/AgentDashboard';
import ManagerDashboard from '@/components/features/dashboard/ManagerDashboard';
import AdminDashboard from '@/components/features/dashboard/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useLocalStorage';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { getRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafb]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#244855] border-t-[#E64833] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#90AEAD]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const DashboardComponent = user?.role === 'admin' ? AdminDashboard
    : user?.role === 'manager' ? ManagerDashboard
    : AgentDashboard;

  return (
    <div className="min-h-screen bg-[#f8fafb] dark:bg-[#0d1f28] flex">
      <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-[#1a2d38] border-b border-[#90AEAD]/15 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2.5 rounded-xl text-[#244855] hover:bg-[#244855]/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-base font-bold font-display text-[#244855] dark:text-white capitalize">
                  {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'manager' ? 'Manager Dashboard' : 'Agent Dashboard'}
                </h2>
                <p className="text-xs text-[#90AEAD] hidden sm:block">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl text-[#244855] dark:text-[#90AEAD] hover:bg-[#244855]/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center">
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setNotifOpen(o => !o)} className="relative p-2.5 rounded-xl text-[#244855] dark:text-[#90AEAD] hover:bg-[#244855]/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Bell className="w-4.5 h-4.5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-[#E64833] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifs}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1a2d38] rounded-2xl shadow-card-hover border border-[#90AEAD]/20 overflow-hidden animate-scale-in z-30">
                    <div className="p-4 border-b border-[#90AEAD]/20">
                      <h4 className="font-bold text-[#244855] dark:text-white text-sm">Notifications</h4>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {MOCK_NOTIFICATIONS.map(n => (
                        <div key={n.id} className={`p-3.5 border-b border-[#90AEAD]/10 hover:bg-[#f8fafb] dark:hover:bg-[#244855]/20 transition-all ${!n.read ? 'bg-[#E64833]/5' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                            <div>
                              <p className="text-sm font-semibold text-[#244855] dark:text-white">{n.title}</p>
                              <p className="text-xs text-[#90AEAD] mt-0.5">{n.message}</p>
                              <p className="text-xs text-[#90AEAD]/60 mt-1">{getRelativeTime(n.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=244855&color=FBE9D0`}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#E64833] cursor-pointer"
                onClick={() => navigate('/dashboard/profile')}
              />
            </div>
          </div>
        </header>

        {/* Dashboard body */}
        <main className="flex-1 p-4 sm:p-6">
          <DashboardComponent />
        </main>
      </div>
    </div>
  );
}
