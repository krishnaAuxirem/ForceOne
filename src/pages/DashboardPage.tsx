import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Routes, Route } from 'react-router-dom';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useLocalStorage';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { getRelativeTime } from '@/lib/utils';

// Import newly implemented route-based dashboard components
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import TasksPage from '@/pages/dashboard/TasksPage';
import UsersPage from '@/pages/dashboard/UsersPage';
import TrackingPage from '@/pages/dashboard/TrackingPage';
import RegionsPage from '@/pages/dashboard/RegionsPage';
import ExpensesPage from '@/pages/dashboard/ExpensesPage';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';
import BlogMgmtPage from '@/pages/dashboard/BlogMgmtPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import NotificationsPage from '@/pages/dashboard/NotificationsPage';
import AttendancePage from '@/pages/dashboard/AttendancePage';
import ActivityPage from '@/pages/dashboard/ActivityPage';
import TeamPage from '@/pages/dashboard/TeamPage';
import ReportsPage from '@/pages/dashboard/ReportsPage';

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

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isAgent = user?.role === 'agent';

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

              {/* Notifications Dropdown */}
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
                    <div className="p-4 border-b border-[#90AEAD]/20 flex items-center justify-between">
                      <h4 className="font-bold text-[#244855] dark:text-white text-sm">Recent Alerts</h4>
                      <button onClick={() => { setNotifOpen(false); navigate('/dashboard/notifications'); }} className="text-[10px] text-[#E64833] font-bold hover:underline">
                        View All
                      </button>
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

              <div
                className="w-9 h-9 rounded-full bg-[#E64833] text-white font-bold text-xs flex items-center justify-center border-2 border-white cursor-pointer flex-shrink-0"
                onClick={() => navigate('/dashboard/profile')}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard body - Route mapping */}
        <main className="flex-1 p-4 sm:p-6">
          <Routes>
            {/* Common dashboard overview */}
            <Route path="/" element={<DashboardOverview />} />

            {/* Profile and Notifications */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Shared CRUD Modules (Filtered by role internally) */}
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />

            {/* Admin only routes */}
            <Route path="/users" element={isAdmin ? <UsersPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/regions" element={isAdmin ? <RegionsPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/analytics" element={isAdmin ? <AnalyticsPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/blog" element={isAdmin ? <BlogMgmtPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/settings" element={isAdmin ? <SettingsPage /> : <Navigate to="/dashboard" replace />} />

            {/* Manager only routes */}
            <Route path="/team" element={(isManager || isAdmin) ? <TeamPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/reports" element={(isManager || isAdmin) ? <ReportsPage /> : <Navigate to="/dashboard" replace />} />

            {/* Agent / Admin / Manager Tracking */}
            <Route path="/tracking" element={(isManager || isAdmin) ? <TrackingPage /> : <Navigate to="/dashboard" replace />} />

            {/* Agent only routes */}
            <Route path="/attendance" element={(isAgent || isAdmin || isManager) ? <AttendancePage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/activity" element={(isAgent || isAdmin || isManager) ? <ActivityPage /> : <Navigate to="/dashboard" replace />} />

            {/* Fallback to Overview */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
