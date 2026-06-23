import { Link, useLocation } from 'react-router-dom';
import { MapPin, Mail, Phone, Twitter, Linkedin, Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.includes('#')) {
      const [base, hash] = path.split('#');
      return location.pathname === base && location.hash === `#${hash}`;
    }
    return location.pathname === path;
  };

  return (
    <footer className="bg-[#244855] text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 bg-[#E64833] rounded-xl flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold font-display">Force<span className="text-[#E64833]">1</span></span>
            </Link>
            <p className="text-[#90AEAD] text-sm leading-relaxed mb-5">
              The most powerful field force management platform for modern businesses. Track, manage, and optimize your on-ground teams in real time.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E64833] flex items-center justify-center transition-all duration-200 group"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-[#90AEAD] group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Product</h4>
            <ul className="space-y-3">
              {[
                { label: 'Features', to: '/features' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Live Tracking', to: '/dashboard/tracking' },
                { label: 'Mobile App', to: '/mobile-app' },
                { label: 'Integrations', to: '/integrations' },
              ].map(item => {
                const active = isActive(item.to);
                return (
                  <li key={item.label}>
                    <Link 
                      to={item.to} 
                      className={`text-sm transition-colors duration-200 ${
                        active 
                          ? 'text-[#E64833] font-bold' 
                          : 'text-[#90AEAD] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Blog', to: '/blog' },
                { label: 'Careers', to: '/about#careers' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms & Conditions', to: '/terms' },
              ].map(item => {
                const active = isActive(item.to);
                return (
                  <li key={item.label}>
                    <Link 
                      to={item.to} 
                      className={`text-sm transition-colors duration-200 ${
                        active 
                          ? 'text-[#E64833] font-bold' 
                          : 'text-[#90AEAD] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#90AEAD]" />
                </div>
                <span className="text-[#90AEAD] text-sm leading-relaxed">
                  Force1 HQ, Bandra Kurla Complex,<br />Mumbai, Maharashtra 400051
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#90AEAD]" />
                </div>
                <a href="mailto:support@force1.in" className="text-[#90AEAD] hover:text-white text-sm transition-colors">
                  support@force1.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#90AEAD]" />
                </div>
                <a href="tel:+918001234567" className="text-[#90AEAD] hover:text-white text-sm transition-colors">
                  +91 800 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#90AEAD] text-sm">
            © 2026 Force1. All rights reserved. Built with love in India.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[#90AEAD] hover:text-white text-xs transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[#90AEAD] hover:text-white text-xs transition-colors">Terms</Link>
            <Link to="/contact" className="text-[#90AEAD] hover:text-white text-xs transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#E64833] hover:bg-[#cc3d29] rounded-2xl shadow-accent flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </button>
    </footer>
  );
}
