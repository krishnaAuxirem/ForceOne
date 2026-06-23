import { useState } from 'react';
import { MessageSquare, Bell, Megaphone, Send, ShieldAlert, CheckCircle } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, sender: 'Vikram Seth', role: 'Technician', text: 'Just checked in at the Dwarka Sector 10 hub. Starting fibre inspections now.', time: '14:40' },
  { id: 2, sender: 'Anjali Sharma', role: 'Sales Rep', text: 'Tata Croma audit complete. Uploaded the signature and store images.', time: '14:42' },
  { id: 3, sender: 'Admin Dispatch', role: 'Operations', text: 'Reminder: Weekly sync scheduled for 5:30 PM today. Please sync your offline data before joining.', time: '14:45' },
];

export default function CommunicationSection() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [activeChannel, setActiveChannel] = useState('#delhi-field-force');
  const [simulatedNotifications, setSimulatedNotifications] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'chat' | 'broadcast'>('chat');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'You (Manager)',
      role: 'Administrator',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setSimulatedNotifications([broadcastText, ...simulatedNotifications]);
    setBroadcastText('');
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setSimulatedNotifications(prev => prev.slice(0, prev.length - 1));
    }, 5000);
  };

  return (
    <section className="py-24 bg-[#FBE9D0]/20 dark:bg-[#152c35]/50 border-t border-[#90AEAD]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E64833]/10 text-[#E64833] text-sm font-semibold mb-3">
            <MessageSquare className="w-4 h-4" /> Communication Center
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Unified Communication Hub
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            Bridge the gap between dispatchers and field agents. Broadcast safety alerts, sync team chats, and trigger instant push notifications.
          </p>
        </div>

        {/* Section Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Channel Sidebar & Chat Panel - Left (8 Columns) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar Channels */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-[#12222b] p-4.5 border-r border-[#90AEAD]/10 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#90AEAD] uppercase tracking-wider mb-4">Operations Channels</h4>
                <div className="space-y-1">
                  {[
                    { name: '#delhi-field-force', active: true, count: 18 },
                    { name: '#announcements', active: false, count: 0 },
                    { name: '#mumbai-sales-hub', active: false, count: 12 },
                    { name: '#safety-emergencies', active: false, count: 1 },
                  ].map((chan) => (
                    <button
                      key={chan.name}
                      onClick={() => setActiveChannel(chan.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer transition-all min-h-[38px] ${
                        activeChannel === chan.name
                          ? 'bg-[#244855] text-white'
                          : 'text-[#90AEAD] hover:bg-slate-100 dark:hover:bg-[#1a2d38] hover:text-[#244855] dark:hover:text-white'
                      }`}
                    >
                      <span>{chan.name}</span>
                      {chan.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          activeChannel === chan.name ? 'bg-[#E64833] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                        }`}>
                          {chan.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#90AEAD]/10 mt-6 text-xs text-[#90AEAD]">
                <strong>14 Agents Online</strong>
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 flex flex-col justify-between p-5 bg-white dark:bg-[#1a2d38]">
              {/* Chat Header */}
              <div className="pb-3 border-b border-[#90AEAD]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#244855] dark:text-white text-base">{activeChannel}</h4>
                  <p className="text-xs text-[#90AEAD]">Active sync channel for ground staff coordination.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTab('chat')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
                      selectedTab === 'chat'
                        ? 'bg-[#E64833]/15 text-[#E64833]'
                        : 'text-[#90AEAD] hover:bg-[#90AEAD]/10'
                    }`}
                  >
                    Team Chat
                  </button>
                  <button
                    onClick={() => setSelectedTab('broadcast')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
                      selectedTab === 'broadcast'
                        ? 'bg-[#E64833]/15 text-[#E64833]'
                        : 'text-[#90AEAD] hover:bg-[#90AEAD]/10'
                    }`}
                  >
                    Broadcaster
                  </button>
                </div>
              </div>

              {selectedTab === 'chat' ? (
                /* CHAT MODE */
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 max-h-[280px]">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex flex-col items-start text-xs bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl max-w-[85%] border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-bold text-[#244855] dark:text-white">{msg.sender}</span>
                          <span className="text-[10px] text-slate-400">({msg.role})</span>
                          <span className="text-[10px] text-[#90AEAD] ml-auto">{msg.time}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-[#90AEAD]/10">
                    <input
                      type="text"
                      placeholder="Type message to channel..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="input-field flex-1"
                    />
                    <button
                      type="submit"
                      className="bg-[#244855] hover:bg-[#1a3340] text-white p-3 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer shadow-force"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                /* BROADCAST MODE */
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full my-6">
                  <h4 className="font-bold text-sm text-[#244855] dark:text-white mb-2 flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-[#E64833]" /> Operations Broadcast Dispatch
                  </h4>
                  <p className="text-xs text-[#90AEAD] mb-4">
                    Send high-priority popups to all mobile screens. Alerts will override lock screens and active tasks.
                  </p>
                  <form onSubmit={handleSendBroadcast} className="space-y-4">
                    <textarea
                      placeholder="Enter emergency warning or announcement..."
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      className="input-field min-h-[80px] py-3 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold py-3 px-4 rounded-xl transition-all text-sm shadow-accent flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                    >
                      <Megaphone className="w-4 h-4" /> Dispatch Push Notification
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Simulated Mobile Device with Push Alerts - Right (4 Columns) */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between text-white shadow-force-lg relative min-h-[500px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-4.5 h-4.5 text-[#E64833]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agent Lock Screen</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Type a message in the Broadcaster tab to trigger an alert here.</p>

              {/* Push notifications stack */}
              <div className="space-y-4">
                {simulatedNotifications.length > 0 ? (
                  simulatedNotifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#E64833]/15 border border-[#E64833]/40 rounded-2xl space-y-2 animate-scale-in"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-[#E64833]">
                        <ShieldAlert className="w-4.5 h-4.5 animate-bounce" /> HIGH PRIORITY ALERT
                      </div>
                      <p className="text-sm font-semibold text-white leading-relaxed">{notif}</p>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-[#E64833]/20 flex justify-between">
                        <span>Sender: Operations Team</span>
                        <span>Now</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 border border-slate-900 bg-slate-900/40 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                    <CheckCircle className="w-6 h-6 text-slate-700 mx-auto" />
                    <p>No active emergency broadcasts at the moment.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl text-[11px] text-slate-400">
              <strong>Push Engine:</strong> Force1 uses Google Firebase & Apple APNs to deliver notifications in under 150ms even on slow 2G networks.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
