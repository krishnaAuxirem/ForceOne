import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface FinalCTAProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export default function FinalCTA({ onOpenTrial, onOpenDemo }: FinalCTAProps) {
  return (
    <section className="py-24 gradient-teal text-white text-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-2xl z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E64833]/15 rounded-full blur-3xl z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FBE9D0] text-xs font-semibold mb-6">
          Instant Deployment
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6 max-w-3xl mx-auto">
          Start Managing Your Field Workforce Smarter
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#90AEAD] leading-relaxed max-w-2xl mx-auto mb-10">
          Join 500+ service and sales companies already maximizing team SLA completion rates, tracking field fuel allowances, and optimizing territories.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 mb-10">
          <button
            onClick={onOpenTrial}
            className="w-full sm:w-auto px-8 py-4 bg-[#E64833] hover:bg-[#cc3d29] text-white font-bold rounded-2xl shadow-accent transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base min-h-[48px] cursor-pointer"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm flex items-center justify-center gap-2 text-base min-h-[48px] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-[#FBE9D0]" />
            Book Live Demo
          </button>
        </div>

        {/* Credentials list */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5 text-xs text-[#90AEAD] font-semibold">
          {['No Credit Card Required', '14-Day Full Access Trial', 'Deploy in 10 Minutes'].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
