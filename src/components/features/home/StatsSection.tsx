import { useEffect, useRef, useState } from 'react';
import { Users, CheckCircle2, MapPin, TrendingUp } from 'lucide-react';

const STATS = [
  { icon: Users, value: 50000, suffix: '+', label: 'Field Agents Managed', color: 'text-[#E64833]', bg: 'bg-[#E64833]/10' },
  { icon: CheckCircle2, value: 2000000, suffix: '+', label: 'Tasks Completed', color: 'text-[#244855]', bg: 'bg-[#244855]/10' },
  { icon: MapPin, value: 500, suffix: '+', label: 'Enterprise Clients', color: 'text-[#874F41]', bg: 'bg-[#874F41]/10' },
  { icon: TrendingUp, value: 45, suffix: '%', label: 'Avg Productivity Boost', color: 'text-[#90AEAD]', bg: 'bg-[#90AEAD]/10' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const start = Date.now();
        const timer = setInterval(() => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.floor(eased * value));
          if (progress >= 1) { clearInterval(timer); setDisplay(value); }
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const format = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;

  return <span ref={ref}>{format(display)}{suffix}</span>;
}

export default function StatsSection() {
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
    <section ref={sectionRef} className="py-20 lg:py-24 gradient-teal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <p className="text-[#90AEAD] text-sm font-semibold uppercase tracking-widest mb-3">By The Numbers</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            Trusted by <span className="text-[#E64833]">Industry Leaders</span>
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {STATS.map(({ icon: Icon, value, suffix, label, color, bg }) => (
            <div key={label} className="glass-card rounded-3xl p-6 md:p-8 text-center group hover:scale-[1.02] transition-transform duration-300">
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <div className={`text-4xl md:text-5xl font-bold font-display ${color} mb-2`}>
                <AnimatedCounter value={value} suffix={suffix} />
              </div>
              <p className="text-[#90AEAD] text-sm leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Trust logos */}
        <div className="mt-16 text-center reveal">
          <p className="text-[#90AEAD] text-sm mb-8 uppercase tracking-widest">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {['Reliance', 'Tata', 'Infosys', 'HDFC', 'Bajaj', 'Airtel'].map(brand => (
              <div key={brand} className="text-white/40 font-bold text-xl font-display hover:text-white/70 transition-colors cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
