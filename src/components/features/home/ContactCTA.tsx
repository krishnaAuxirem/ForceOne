import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#244855] via-[#1a3340] to-[#244855]" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(144,174,173,0.1) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#E64833]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#874F41]/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FBE9D0] text-sm font-semibold mb-6">
          🚀 Ready to Transform Your Field Operations?
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6">
          Start Managing Your <span className="text-[#E64833]">Field Force</span> Smarter
        </h2>
        <p className="text-xl text-[#90AEAD] mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 500+ enterprises already using Force1 to optimize their field operations. Get started in minutes — no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E64833] hover:bg-[#cc3d29] rounded-2xl text-white font-bold text-lg shadow-accent transition-all duration-200 hover:scale-[1.02] active:scale-95">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-200">
            Talk to Sales
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <a href="tel:+918001234567" className="flex items-center gap-2 text-[#90AEAD] hover:text-white transition-colors">
            <Phone className="w-4 h-4 text-[#E64833]" />
            <span className="text-sm">+91 800 123 4567</span>
          </a>
          <a href="mailto:support@force1.in" className="flex items-center gap-2 text-[#90AEAD] hover:text-white transition-colors">
            <Mail className="w-4 h-4 text-[#E64833]" />
            <span className="text-sm">support@force1.in</span>
          </a>
          <div className="flex items-center gap-2 text-[#90AEAD] text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            14-day free trial · No credit card
          </div>
        </div>
      </div>
    </section>
  );
}
