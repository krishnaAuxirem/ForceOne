import { useEffect, useState } from 'react';
import { Play, ArrowRight, ShieldCheck, Users, Building, Activity } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

interface HeroSectionProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export default function HeroSection({ onOpenTrial, onOpenDemo }: HeroSectionProps) {
  const [stats, setStats] = useState({
    agents: 0,
    companies: 0,
    completion: 0,
    uptime: 0,
  });

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        agents: Math.min(Math.floor((10000 / steps) * step), 10000),
        companies: Math.min(Math.floor((500 / steps) * step), 500),
        completion: Math.min(Math.floor((98 / steps) * step), 98),
        uptime: parseFloat(Math.min((99.9 / steps) * step, 99.9).toFixed(1)),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#244855] text-white pt-24 pb-16">
      {/* Background Image with Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Field Agents Tracking"
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#244855] via-[#244855]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#244855]/95 via-transparent to-[#244855]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-white/10 border border-white/20 text-[#FBE9D0] text-sm font-semibold mb-8 backdrop-blur-md shadow-inner animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#E64833] animate-ping" />
           Force1 Platform Version 3.4
        </div>

        {/* Large Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight max-w-5xl mx-auto leading-tight mb-8">
          Powerful Features Built For <span className="text-[#E64833] relative">Modern Field Teams<span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#E64833]/30 rounded-full"></span></span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#90AEAD] max-w-3xl mx-auto mb-12 leading-relaxed">
          Streamline tracking, job scheduling, attendance logs, expenses, and messaging. 
          Empower your on-ground workforce and gain absolute control with real-time field data.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 mb-20">
          <button
            onClick={onOpenTrial}
            className="w-full sm:w-auto px-8 py-4 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-2xl shadow-accent transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-base min-h-[48px]"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 text-base min-h-[48px]"
          >
            <Play className="w-4 h-4 fill-current text-[#FBE9D0]" />
            Schedule Demo
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Users className="w-5 h-5 text-[#E64833]" />,
              value: `${stats.agents.toLocaleString()}+`,
              label: 'Active Agents',
              desc: 'Tracking concurrently',
            },
            {
              icon: <Building className="w-5 h-5 text-[#E64833]" />,
              value: `${stats.companies}+`,
              label: 'Companies',
              desc: 'Trusting Force1 globally',
            },
            {
              icon: <Activity className="w-5 h-5 text-[#E64833]" />,
              value: `${stats.completion}%`,
              label: 'Task Completion',
              desc: 'Average execution rate',
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-[#E64833]" />,
              value: `${stats.uptime}%`,
              label: 'Uptime SLA',
              desc: 'Guaranteed cloud stability',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:border-[#90AEAD]/40 text-center relative group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#FBE9D0] mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-white mb-0.5">
                {stat.label}
              </div>
              <div className="text-xs text-[#90AEAD]">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Wave Transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] text-white dark:text-[#0d1f28] fill-current"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V0Z" />
        </svg>
      </div>
    </section>
  );
}
