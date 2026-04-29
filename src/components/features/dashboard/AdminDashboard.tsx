import { useState } from 'react';
import { Users, BarChart3, Settings, MapPin, Newspaper, Shield, Plus, X, Trash2, Edit3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_TEAM, MOCK_REGIONS, MOCK_BLOGS, CHART_DATA } from '@/lib/mockData';
import { getStatusColor, generateId } from '@/lib/utils';
import type { TeamMember, Region, BlogPost } from '@/types';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [team, setTeam] = useLocalStorage<TeamMember[]>('force1_team', MOCK_TEAM);
  const [regions, setRegions] = useLocalStorage<Region[]>('force1_regions', MOCK_REGIONS);
  const [blogs, setBlogs] = useLocalStorage<BlogPost[]>('force1_blogs', MOCK_BLOGS);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'regions' | 'analytics' | 'blog' | 'settings'>('overview');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', role: 'agent', region: 'Mumbai North' });
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', category: 'Technology', readTime: '5 min read' });
  const [settings, setSettings] = useLocalStorage('force1_settings', {
    companyName: 'Force1 Demo Corp', maxAgentsPerManager: 15, gpsInterval: 30,
    darkMode: false, emailNotifications: true, smsAlerts: false,
  });

  const deleteUser = (id: string) => { setTeam(prev => prev.filter(m => m.id !== id)); toast.success('User deleted'); };
  
  const addUser = () => {
    if (!userForm.name || !userForm.email) { toast.error('Name and email required'); return; }
    const newMember: TeamMember = {
      id: generateId(), name: userForm.name, email: userForm.email, phone: userForm.phone,
      role: userForm.role as any, status: 'active', region: userForm.region,
      tasksCompleted: 0, attendanceRate: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userForm.name)}&background=244855&color=FBE9D0&size=60`,
    };
    setTeam(prev => [...prev, newMember]);
    setUserForm({ name: '', email: '', phone: '', role: 'agent', region: 'Mumbai North' });
    setShowUserForm(false);
    toast.success('User added successfully!');
  };

  const saveBlog = () => {
    if (!blogForm.title || !blogForm.excerpt) { toast.error('Title and excerpt required'); return; }
    if (editingBlog) {
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...blogForm } : b));
      toast.success('Blog post updated!');
    } else {
      const newBlog: BlogPost = {
        id: generateId(), ...blogForm, author: user?.name || 'Admin',
        date: new Date().toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        tags: [blogForm.category],
        content: blogForm.content || blogForm.excerpt,
      };
      setBlogs(prev => [newBlog, ...prev]);
      toast.success('Blog post published!');
    }
    setBlogForm({ title: '', excerpt: '', content: '', category: 'Technology', readTime: '5 min read' });
    setShowBlogForm(false);
    setEditingBlog(null);
  };

  const deleteBlog = (id: string) => { setBlogs(prev => prev.filter(b => b.id !== id)); toast.success('Post deleted'); };

  const TABS = ['overview', 'users', 'regions', 'analytics', 'blog', 'settings'];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#244855] via-[#E64833]/80 to-[#874F41] rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-[#FBE9D0]" />
          <h1 className="text-2xl md:text-3xl font-bold font-display">Admin Control Panel</h1>
        </div>
        <p className="text-white/70">Full system access · {team.length} users · {regions.length} regions</p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: team.length, sub: `${team.filter(m => m.status === 'active').length} active`, color: 'bg-[#244855]', icon: Users },
          { label: 'Regions', value: regions.length, sub: 'managed zones', color: 'bg-[#874F41]', icon: MapPin },
          { label: 'Avg Completion', value: `${Math.round(regions.reduce((s, r) => s + r.completionRate, 0) / regions.length)}%`, sub: 'across regions', color: 'bg-[#E64833]', icon: BarChart3 },
          { label: 'Blog Posts', value: blogs.length, sub: 'published', color: 'bg-green-500', icon: Newspaper },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-base p-5">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
              <p className="text-2xl font-bold font-display text-[#244855] dark:text-white">{s.value}</p>
              <p className="text-sm text-[#90AEAD]">{s.label}</p>
              <p className="text-xs text-[#90AEAD]/70">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f8fafb] dark:bg-[#1a2d38] rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] capitalize flex-shrink-0 ${activeTab === tab ? 'bg-white dark:bg-[#244855] text-[#244855] dark:text-white shadow-card' : 'text-[#90AEAD] hover:text-[#244855] dark:hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Region Performance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_DATA.regionPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 11, fill: '#90AEAD' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="score" fill="#E64833" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Expense Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={CHART_DATA.expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {CHART_DATA.expenseByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">User Management</h3>
            <button onClick={() => setShowUserForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#E64833] text-white rounded-xl text-sm font-semibold hover:bg-[#cc3d29] transition-all min-h-[44px]">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
          {showUserForm && (
            <div className="mb-5 p-5 bg-[#f8fafb] dark:bg-[#244855]/20 rounded-2xl border border-[#90AEAD]/20">
              <div className="flex justify-between mb-3">
                <h4 className="font-bold text-sm text-[#244855] dark:text-white">New User</h4>
                <button onClick={() => setShowUserForm(false)}><X className="w-4 h-4 text-[#90AEAD]" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="input-field" placeholder="Full name *" value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} />
                <input className="input-field" placeholder="Email *" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} />
                <input className="input-field" placeholder="Phone" value={userForm.phone} onChange={e => setUserForm(f => ({ ...f, phone: e.target.value }))} />
                <select className="input-field" value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="agent">Field Agent</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <select className="input-field sm:col-span-2" value={userForm.region} onChange={e => setUserForm(f => ({ ...f, region: e.target.value }))}>
                  {regions.map(r => <option key={r.id}>{r.name}</option>)}
                </select>
              </div>
              <button onClick={addUser} className="mt-3 w-full py-2.5 bg-[#244855] text-white rounded-xl font-semibold text-sm">Add User</button>
            </div>
          )}
          <div className="space-y-3">
            {team.map(member => (
              <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#90AEAD]/20 hover:border-[#244855]/30 transition-all">
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#244855] dark:text-white">{member.name}</p>
                  <p className="text-xs text-[#90AEAD]">{member.email} · {member.region}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#244855]/10 text-[#244855] dark:text-[#90AEAD] font-medium capitalize hidden sm:block">{member.role}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${getStatusColor(member.status)}`}>{member.status}</span>
                <button onClick={() => deleteUser(member.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#90AEAD] hover:text-red-500 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'regions' && (
        <div className="card-base p-6">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Region Management</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map(region => (
              <div key={region.id} className="p-5 rounded-2xl border border-[#90AEAD]/20 hover:border-[#244855]/40 bg-[#f8fafb] dark:bg-[#244855]/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-[#244855] rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
                </div>
                <h4 className="font-bold text-[#244855] dark:text-white mb-2">{region.name}</h4>
                <div className="space-y-1.5 text-xs text-[#90AEAD]">
                  <div className="flex justify-between"><span>Agents:</span><span className="font-semibold text-[#244855] dark:text-white">{region.agentCount}</span></div>
                  <div className="flex justify-between"><span>Managers:</span><span className="font-semibold text-[#244855] dark:text-white">{region.managerCount}</span></div>
                  <div className="flex justify-between"><span>Active Tasks:</span><span className="font-semibold text-[#244855] dark:text-white">{region.activeTasksCount}</span></div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#90AEAD]">Completion</span>
                    <span className="font-bold text-[#E64833]">{region.completionRate}%</span>
                  </div>
                  <div className="w-full bg-[#90AEAD]/20 rounded-full h-2">
                    <div className="bg-[#E64833] h-2 rounded-full transition-all" style={{ width: `${region.completionRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Weekly Task Trends</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_DATA.weeklyTasks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#90AEAD20" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <YAxis tick={{ fontSize: 12, fill: '#90AEAD' }} />
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Bar dataKey="assigned" fill="#90AEAD" radius={[4, 4, 0, 0]} name="Assigned" />
                <Bar dataKey="completed" fill="#E64833" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-base p-6">
            <h3 className="font-bold text-[#244855] dark:text-white font-display mb-4">Expense Categories</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={CHART_DATA.expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name }) => name}>
                  {CHART_DATA.expenseByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#244855', border: 'none', borderRadius: '12px', color: 'white' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#244855] dark:text-white font-display">Blog Management</h3>
            <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', excerpt: '', content: '', category: 'Technology', readTime: '5 min read' }); setShowBlogForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#E64833] text-white rounded-xl text-sm font-semibold hover:bg-[#cc3d29] transition-all min-h-[44px]">
              <Plus className="w-4 h-4" /> New Post
            </button>
          </div>
          {showBlogForm && (
            <div className="mb-5 p-5 bg-[#f8fafb] dark:bg-[#244855]/20 rounded-2xl border border-[#90AEAD]/20">
              <div className="flex justify-between mb-3">
                <h4 className="font-bold text-sm text-[#244855] dark:text-white">{editingBlog ? 'Edit Post' : 'New Post'}</h4>
                <button onClick={() => { setShowBlogForm(false); setEditingBlog(null); }}><X className="w-4 h-4 text-[#90AEAD]" /></button>
              </div>
              <div className="space-y-3">
                <input className="input-field" placeholder="Post title *" value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} />
                <textarea className="input-field resize-none" rows={2} placeholder="Excerpt *" value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} />
                <textarea className="input-field resize-none" rows={4} placeholder="Content" value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <select className="input-field" value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}>
                    {['Technology', 'Management', 'Case Study', 'Trends'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input className="input-field" placeholder="Read time" value={blogForm.readTime} onChange={e => setBlogForm(f => ({ ...f, readTime: e.target.value }))} />
                </div>
              </div>
              <button onClick={saveBlog} className="mt-3 w-full py-2.5 bg-[#244855] text-white rounded-xl font-semibold text-sm">
                {editingBlog ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          )}
          <div className="space-y-3">
            {blogs.map(blog => (
              <div key={blog.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#90AEAD]/20 hover:border-[#244855]/30 transition-all">
                <img src={blog.image} alt={blog.title} className="w-16 h-12 rounded-xl object-cover flex-shrink-0 hidden sm:block" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#244855] dark:text-white truncate">{blog.title}</p>
                  <p className="text-xs text-[#90AEAD]">{blog.author} · {blog.date} · {blog.readTime}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#244855]/10 text-[#244855] dark:text-[#90AEAD] font-medium hidden sm:block">{blog.category}</span>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingBlog(blog); setBlogForm({ title: blog.title, excerpt: blog.excerpt, content: blog.content, category: blog.category, readTime: blog.readTime }); setShowBlogForm(true); }}
                    className="p-2 rounded-lg hover:bg-[#244855]/10 text-[#90AEAD] hover:text-[#244855] transition-all min-h-[36px] min-w-[36px] flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteBlog(blog.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#90AEAD] hover:text-red-500 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card-base p-6 max-w-2xl">
          <h3 className="font-bold text-[#244855] dark:text-white font-display mb-6">System Settings</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-2">Company Name</label>
              <input className="input-field" value={settings.companyName} onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-2">Max Agents per Manager</label>
              <input className="input-field" type="number" value={settings.maxAgentsPerManager} onChange={e => setSettings(s => ({ ...s, maxAgentsPerManager: parseInt(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-2">GPS Update Interval (seconds)</label>
              <input className="input-field" type="number" value={settings.gpsInterval} onChange={e => setSettings(s => ({ ...s, gpsInterval: parseInt(e.target.value) }))} />
            </div>
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'smsAlerts', label: 'SMS Alerts' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-[#90AEAD]/20">
                <span className="text-sm font-semibold text-[#244855] dark:text-white">{label}</span>
                <button
                  onClick={() => setSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }))}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${settings[key as keyof typeof settings] ? 'bg-[#E64833]' : 'bg-[#90AEAD]/40'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${settings[key as keyof typeof settings] ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
            <button onClick={() => toast.success('Settings saved!')} className="w-full py-3 bg-[#244855] text-white rounded-xl font-semibold hover:bg-[#1a3340] transition-all">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
