import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Signal, Clock } from 'lucide-react';
import liveTrackingImg from '@/assets/live-tracking.jpg';

const AGENTS = [
  { id: 1, name: 'Rahul Sharma', status: 'active', location: 'Andheri West', task: 'Site Survey', time: '2m ago', lat: 28, lng: 42, color: '#E64833' },
  { id: 2, name: 'Sneha Desai', status: 'active', location: 'Bandra', task: 'Client Visit', time: '5m ago', lat: 55, lng: 28, color: '#244855' },
  { id: 3, name: 'Kiran Joshi', status: 'transit', location: 'Powai', task: 'Data Collection', time: '1m ago', lat: 40, lng: 65, color: '#874F41' },
  { id: 4, name: 'Vijay Kumar', status: 'active', location: 'Dadar', task: 'Installation', time: 'Just now', lat: 68, lng: 48, color: '#90AEAD' },
];

export default function LiveTrackingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#FBE9D0]/30 dark:bg-[#152c35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: content */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#244855]/10 border border-[#244855]/20 text-[#244855] dark:text-[#90AEAD] text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot"></span>
              Live Right Now
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-5">
              Real-Time GPS Tracking <span className="text-[#E64833]">for Every Agent</span>
            </h2>
            <p className="text-lg text-[#90AEAD] leading-relaxed mb-8">
              See your entire field force on a live map. Track routes, monitor locations, set geo-fences, and respond instantly to field events — all in real time.
            </p>

            <div className="space-y-4 mb-8">
              {AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelected(agent.id === selected ? null : agent.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    selected === agent.id
                      ? 'border-[#E64833] bg-[#E64833]/5'
                      : 'border-[#90AEAD]/20 bg-white dark:bg-[#1a2d38] hover:border-[#244855]/40'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: agent.color }}>
                      {agent.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${agent.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#244855] dark:text-white">{agent.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-[#90AEAD]">
                        <MapPin className="w-3 h-3" />{agent.location}
                      </span>
                      <span className="text-xs text-[#90AEAD]">· {agent.task}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#90AEAD]">
                    <Clock className="w-3 h-3" />{agent.time}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-[#244855] dark:text-[#90AEAD]">
                <Signal className="w-4 h-4 text-green-500" />
                <span>4 agents online</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#244855] dark:text-[#90AEAD]">
                <Navigation className="w-4 h-4 text-[#E64833]" />
                <span>Routes optimized</span>
              </div>
            </div>
          </div>

          {/* Right: Map mock */}
          <div className="reveal relative">
            <div className="relative rounded-3xl overflow-hidden shadow-force-lg border-4 border-white dark:border-[#244855]">
              <img src={liveTrackingImg} alt="Live tracking map" className="w-full aspect-video object-cover" />
              <div className="absolute inset-0 bg-[#244855]/30" />

              {/* Agent pins on map */}
              {AGENTS.map(agent => (
                <div
                  key={agent.id}
                  className={`absolute transition-all duration-300 cursor-pointer ${selected === agent.id ? 'z-20 scale-125' : 'z-10'}`}
                  style={{ left: `${agent.lng}%`, top: `${agent.lat}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => setSelected(agent.id === selected ? null : agent.id)}
                >
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg`} style={{ backgroundColor: agent.color }}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    {agent.status === 'active' && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: agent.color }}></div>
                    )}
                    {selected === agent.id && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg px-2.5 py-1.5 whitespace-nowrap z-30">
                        <p className="text-xs font-bold text-[#244855]">{agent.name}</p>
                        <p className="text-xs text-[#90AEAD]">{agent.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Live badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-white text-xs font-semibold">LIVE</span>
              </div>

              {/* Stats overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {[
                  { label: 'Active', value: '4', color: 'bg-green-500' },
                  { label: 'Zones', value: '3', color: 'bg-[#E64833]' },
                ].map(s => (
                  <div key={s.label} className="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                    <div className={`text-base font-bold text-white`}>{s.value}</div>
                    <div className="text-[10px] text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1a2d38] rounded-2xl shadow-card-hover p-4 border border-[#90AEAD]/20 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E64833]/10 rounded-xl flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-[#E64833]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#244855] dark:text-white">Route Optimized</p>
                  <p className="text-xs text-[#90AEAD]">Saved 45 min today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
