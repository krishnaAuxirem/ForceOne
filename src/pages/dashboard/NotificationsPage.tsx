import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import type { Notification } from '@/types';
import { Bell, Trash2, CheckCircle2, AlertTriangle, Info, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { getRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('force1_notifications', MOCK_NOTIFICATIONS);

  // States
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Notification marked as read.');
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    toast.success('Notification marked as unread.');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted.');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  const handleClearAll = () => {
    if (confirm('Delete all notifications permanently?')) {
      setNotifications([]);
      toast.success('Notifications cleared.');
    }
  };

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#244855] via-[#244855]/95 to-[#E64833]/80 p-6 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Bell className="w-6 h-6 text-[#FBE9D0]" />
            <h1 className="text-2xl md:text-3xl font-bold font-display">System Notifications</h1>
          </div>
          <p className="text-white/70 text-sm">Review activity updates, task completions, and claims reviews. You have {unreadCount} unread alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white font-bold text-xs shadow transition-all min-h-[40px]"
          >
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* Filter and Clear options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1.5 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-xl p-1 border border-[#90AEAD]/10 self-start">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: 'Archived / Read' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-white dark:bg-[#244855] text-[#244855] dark:text-white shadow-sm'
                  : 'text-[#90AEAD] hover:text-[#244855] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-bold hover:underline self-end"
          >
            <Trash2 className="w-4 h-4" /> Clear All Alerts
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="card-base p-5 border border-[#90AEAD]/10 space-y-3">
        {filteredNotifications.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
              !notif.read
                ? 'bg-[#E64833]/5 border-[#E64833]/20 shadow-sm'
                : 'bg-[#f8fafb]/60 dark:bg-[#1a2d38]/40 border-[#90AEAD]/10'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {getNotifIcon(notif.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h4 className={`text-sm font-bold text-[#244855] dark:text-white ${!notif.read ? '' : 'opacity-70'}`}>
                  {notif.title}
                </h4>
                <span className="text-[10px] text-[#90AEAD] whitespace-nowrap">
                  {getRelativeTime(notif.timestamp)}
                </span>
              </div>
              <p className="text-xs text-[#90AEAD] mt-1 pr-6 leading-relaxed">
                {notif.message}
              </p>
              
              <div className="flex items-center gap-3.5 mt-3 pt-2.5 border-t border-[#90AEAD]/10">
                {!notif.read ? (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-[10px] text-[#244855] dark:text-white font-bold hover:underline"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkAsUnread(notif.id)}
                    className="text-[10px] text-[#90AEAD] font-bold hover:underline"
                  >
                    Mark as Unread
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(notif.id)}
                  className="text-[10px] text-red-500 font-bold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-8 h-8 text-[#90AEAD] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#90AEAD]">No notifications found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
