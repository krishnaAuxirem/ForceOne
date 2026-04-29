import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sanjay Mehta',
    role: 'VP Operations, Reliance Retail',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'Force1 completely transformed how we manage our 1,200 field agents across Maharashtra. Real-time tracking and automated attendance saved us 3 hours of daily administrative work per manager.',
    company: 'Reliance Retail',
    metric: '+38% productivity',
  },
  {
    id: 2,
    name: 'Kavitha Rao',
    role: 'Field Operations Head, HDFC Life',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'The expense management module alone justified the investment. Approval time went from 3 weeks to 48 hours. Our field agents love how easy the mobile interface is.',
    company: 'HDFC Life',
    metric: '85% faster approvals',
  },
  {
    id: 3,
    name: 'Rajesh Nair',
    role: 'GM Sales, Bajaj Finserv',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'We deployed Force1 for our 800-agent team in 6 states. The analytics dashboard gives our leadership team unprecedented visibility into field performance. Highly recommended.',
    company: 'Bajaj Finserv',
    metric: '45% task completion boost',
  },
  {
    id: 4,
    name: 'Anita Kulkarni',
    role: 'HR Director, Airtel Business',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: "Force1's attendance tracking has been flawless. We eliminated buddy punching entirely with geo-fencing, and our attendance accuracy jumped from 72% to 99% within the first month.",
    company: 'Airtel Business',
    metric: '99% attendance accuracy',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#FBE9D0]/30 dark:bg-[#0d1f28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#874F41]/10 border border-[#874F41]/20 text-[#874F41] text-sm font-semibold mb-4">
            ⭐ Customer Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            What Our Customers <span className="text-[#E64833]">Are Saying</span>
          </h2>
          <p className="text-lg text-[#90AEAD]">Real results from real enterprises using Force1 every day.</p>
        </div>

        {/* Desktop: 2 columns */}
        <div className="hidden md:grid grid-cols-2 gap-6 reveal">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="card-base p-8 relative overflow-hidden group hover:-translate-y-1">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#E64833]/10 group-hover:text-[#E64833]/20 transition-colors" />
              <div className="flex items-start gap-4 mb-5">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <p className="font-bold text-[#244855] dark:text-white font-display">{t.name}</p>
                  <p className="text-sm text-[#90AEAD]">{t.role}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#244855]/80 dark:text-[#90AEAD] leading-relaxed mb-4 text-sm">"{t.text}"</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E64833]/10 rounded-full text-xs font-bold text-[#E64833]">
                📈 {t.metric}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden reveal">
          <div className="card-base p-6 relative overflow-hidden">
            <Quote className="absolute top-4 right-4 w-8 h-8 text-[#E64833]/10" />
            <div className="flex items-start gap-3 mb-4">
              <img src={TESTIMONIALS[current].avatar} alt={TESTIMONIALS[current].name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-[#244855] dark:text-white text-sm">{TESTIMONIALS[current].name}</p>
                <p className="text-xs text-[#90AEAD]">{TESTIMONIALS[current].role}</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[#244855]/80 dark:text-[#90AEAD] leading-relaxed text-sm mb-3">"{TESTIMONIALS[current].text}"</p>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E64833]/10 rounded-full text-xs font-bold text-[#E64833]">
              📈 {TESTIMONIALS[current].metric}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full border-2 border-[#244855]/20 flex items-center justify-center hover:bg-[#244855] hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all ${i === current ? 'w-6 h-2.5 bg-[#E64833]' : 'w-2.5 h-2.5 bg-[#90AEAD]/40'}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border-2 border-[#244855]/20 flex items-center justify-center hover:bg-[#244855] hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
