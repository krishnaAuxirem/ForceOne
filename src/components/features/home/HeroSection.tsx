import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const SLIDES = [
  {
    id: 0,
    bg: heroBg,
    headline: 'Manage Your Field Force in Real Time',
    sub: 'Track agents, assign tasks, monitor attendance, and optimize your on-ground operations — all from one powerful platform.',
    badge: ' Trusted by 500+ Enterprises',
    cta: 'Start Free Trial',
    ctaTo: '/register',
  },
  {
    id: 1,
    bg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&h=900&fit=crop',
    headline: 'Live GPS Tracking for Every Agent',
    sub: 'See exactly where your field team is at any moment. Route optimization, geo-fencing, and real-time location sharing.',
    badge: ' GPS-Powered Intelligence',
    cta: 'See Live Tracking',
    ctaTo: '/register',
  },
  {
    id: 2,
    bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
    headline: 'Powerful Analytics & Reports',
    sub: 'Make data-driven decisions with real-time dashboards, performance reports, and predictive analytics for your entire field force.',
    badge: ' AI-Powered Insights',
    cta: 'View Dashboard',
    ctaTo: '/dashboard',
  },
];

const FEATURES = [
  'Real-time GPS Tracking',
  'Task Assignment & CRUD',
  'Attendance Management',
  'Expense Approval Flow',
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % SLIDES.length);
      }, 5000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying]);

  const prev = () => { setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length); };
  const next = () => { setCurrent(c => (c + 1) % SLIDES.length); };

  const slide = SLIDES[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Slide backgrounds */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img src={s.bg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#244855]/95 via-[#244855]/80 to-[#244855]/40" />
        </div>
      ))}

      {/* Animated grid overlay */}
      <div className="absolute inset-0 z-[2]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(144,174,173,0.12) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Content */}
      <div className="relative z-[3] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6 animate-fade-in">
            <span>{slide.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-display leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {slide.headline.split(' ').slice(0, 4).join(' ')}<br />
            <span className="text-[#E64833]">{slide.headline.split(' ').slice(4).join(' ')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#90AEAD] leading-relaxed mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {slide.sub}
          </p>

          {/* Feature list */}
          <div className="flex flex-wrap gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#E64833]" />
                {f}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to={slide.ctaTo} className="inline-flex items-center gap-2 px-8 py-4 bg-[#E64833] hover:bg-[#cc3d29] rounded-2xl text-white font-bold text-lg shadow-accent transition-all duration-200 hover:scale-[1.02] active:scale-95">
              {slide.cta} <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white" fill="white" />
              </div>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {[
            { value: '500+', label: 'Enterprises' },
            { value: '50K+', label: 'Field Agents' },
            { value: '2M+', label: 'Tasks Tracked' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white font-display">{stat.value}</div>
              <div className="text-sm text-[#90AEAD] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-4">
        <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-[#E64833]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
