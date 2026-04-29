import { useEffect, useRef } from 'react';
import { CheckSquare, Plus, Filter, Clock, AlertCircle, CheckCircle2, CircleDot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPriorityColor } from '@/lib/utils';

const SAMPLE_TASKS = [
  { title: 'Site Survey — Andheri West', agent: 'Rahul Sharma', priority: 'high', status: 'in-progress', due: 'Today 5PM', category: 'Survey' },
  { title: 'Client Visit — TechPark Powai', agent: 'Sneha Desai', priority: 'urgent', status: 'pending', due: 'Today 3PM', category: 'Client Visit' },
  { title: 'Data Collection — Bandra Market', agent: 'Kiran Joshi', priority: 'medium', status: 'completed', due: 'Yesterday', category: 'Data' },
  { title: 'Installation — Dadar Zone 3', agent: 'Vijay Kumar', priority: 'low', status: 'completed', due: '2 days ago', category: 'Install' },
];

const STATUS_ICONS: Record<string, any> = {
  'in-progress': CircleDot,
  'pending': Clock,
  'completed': CheckCircle2,
};

const STATUS_COLORS: Record<string, string> = {
  'in-progress': 'text-blue-500',
  'pending': 'text-amber-500',
  'completed': 'text-green-500',
};

export default function TaskManagementSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white dark:bg-[#0d1f28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: UI preview */}
          <div className="reveal order-2 lg:order-1">
            <div className="bg-[#f8fafb] dark:bg-[#1a2d38] rounded-3xl p-4 shadow-force-lg border border-[#90AEAD]/20">
              {/* Header bar */}
              <div className="flex items-center justify-between mb-4 p-2">
                <h4 className="font-bold text-[#244855] dark:text-white font-display text-sm">Task Board</h4>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#244855] text-white text-xs rounded-lg">
                    <Plus className="w-3 h-3" /> New Task
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#90AEAD]/30 text-[#244855] dark:text-white text-xs rounded-lg">
                    <Filter className="w-3 h-3" /> Filter
                  </button>
                </div>
              </div>

              {/* Task list */}
              <div className="space-y-2.5">
                {SAMPLE_TASKS.map((task, i) => {
                  const StatusIcon = STATUS_ICONS[task.status] || CheckSquare;
                  return (
                    <div key={i} className="bg-white dark:bg-[#244855]/30 rounded-2xl p-3.5 border border-[#90AEAD]/20 hover:border-[#244855]/40 dark:hover:border-[#90AEAD]/40 transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <StatusIcon className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 ${STATUS_COLORS[task.status]}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold text-[#244855] dark:text-white ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                            {task.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-xs text-[#90AEAD]">👤 {task.agent}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-[#90AEAD]">
                              <Clock className="w-3 h-3" />{task.due}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#90AEAD]/15 text-[#244855] dark:text-[#90AEAD] font-medium hidden sm:block">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'Pending', value: '12', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                  { label: 'In Progress', value: '8', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Done Today', value: '24', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-[#90AEAD] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="reveal order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#244855]/10 border border-[#244855]/20 text-[#244855] dark:text-[#90AEAD] text-sm font-semibold mb-6">
              <CheckSquare className="w-4 h-4" /> Smart Task Management
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-5">
              Assign, Track & <span className="text-[#E64833]">Close Tasks</span> Effortlessly
            </h2>
            <p className="text-lg text-[#90AEAD] leading-relaxed mb-8">
              Full task lifecycle management — from creation to completion. Assign tasks to agents, set priorities, track progress in real time, and get proof-of-completion photos.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: Plus, title: 'One-Click Task Assignment', desc: 'Assign tasks to any agent with priority, deadline, and location details.' },
                { icon: AlertCircle, title: 'Priority & SLA Tracking', desc: 'Urgent to low — track SLA breaches with automated alerts.' },
                { icon: CheckCircle2, title: 'Proof of Completion', desc: 'Agents upload photos and notes as proof when tasks are done.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-[#E64833]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-[#E64833]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#244855] dark:text-white text-sm mb-1">{title}</h4>
                    <p className="text-sm text-[#90AEAD]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register" className="btn-accent inline-flex items-center gap-2">
              Start Managing Tasks <CheckSquare className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
