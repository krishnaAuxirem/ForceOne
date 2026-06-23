import { useEffect, useRef } from 'react';
import { MapPin, CheckSquare, Clock, DollarSign, BarChart3, Shield, Smartphone, Zap, Users, Bell, Globe, Lock } from 'lucide-react';

const FEATURES = [
  { icon: MapPin, title: 'Live GPS Tracking', desc: 'Real-time location of every field agent on an interactive map with route history and geo-fencing capabilities.', color: 'bg-[#E64833]' },
  { icon: CheckSquare, title: 'Smart Task Management', desc: 'Assign, track, and manage tasks with priorities, deadlines, and proof-of-completion uploads.', color: 'bg-[#244855]' },
  { icon: Clock, title: 'Attendance System', desc: 'Automated GPS-based check-in/out with leave management and attendance analytics.', color: 'bg-[#874F41]' },
  { icon: DollarSign, title: 'Expense Management', desc: 'Digital expense submission with receipt upload, category tagging, and manager approval workflow.', color: 'bg-[#90AEAD]' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Powerful insights into team performance, task completion rates, and operational efficiency.', color: 'bg-[#E64833]' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Granular permissions for Admins, Managers, and Field Agents with secure data segregation.', color: 'bg-[#244855]' },
  { icon: Smartphone, title: 'Mobile-First Design', desc: 'Fully responsive UI optimized for field use on any device — offline-capable with sync.', color: 'bg-[#874F41]' },
  { icon: Zap, title: 'Real-Time Notifications', desc: 'Instant alerts for task updates, approvals, check-ins, and critical field events.', color: 'bg-[#90AEAD]' },
  { icon: Users, title: 'Team Management', desc: 'Manage entire field teams, assign to regions, track performance, and generate reports.', color: 'bg-[#E64833]' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Configurable alerts for late check-ins, missed tasks, expense thresholds, and SLA breaches.', color: 'bg-[#244855]' },
  { icon: Globe, title: 'Multi-Region Support', desc: 'Manage field operations across multiple cities, states, and regions from a single platform.', color: 'bg-[#874F41]' },
  { icon: Lock, title: 'Enterprise Security', desc: 'AES-256 encryption, two-factor authentication, audit logs, and GDPR-compliant data handling.', color: 'bg-[#90AEAD]' },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-20 lg:py-28 bg-white dark:bg-[#0d1f28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E64833]/10 border border-[#E64833]/20 text-[#E64833] text-sm font-semibold mb-4">
             Full-Featured Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Everything You Need to <span className="text-[#E64833]">Manage Your Field Force</span>
          </h2>
          <p className="text-lg text-[#90AEAD] leading-relaxed">
            A complete suite of tools built for modern field operations — from GPS tracking to analytics, all in one platform.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="reveal card-base p-6 group hover:-translate-y-1 cursor-default"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-[#244855] dark:text-white mb-2 font-display">{f.title}</h3>
                <p className="text-sm text-[#90AEAD] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
