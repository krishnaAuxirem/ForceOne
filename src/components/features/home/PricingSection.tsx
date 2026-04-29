import { useEffect, useRef } from 'react';
import { Check, X, Zap, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    price: 999,
    period: '/month',
    desc: 'Perfect for small field teams just getting started.',
    color: 'border-[#90AEAD]/30',
    headerBg: 'bg-[#90AEAD]/10',
    iconColor: 'text-[#90AEAD]',
    cta: 'Start Free Trial',
    features: [
      { label: 'Up to 10 Field Agents', included: true },
      { label: 'GPS Live Tracking', included: true },
      { label: 'Task Management', included: true },
      { label: 'Attendance System', included: true },
      { label: 'Basic Reports', included: true },
      { label: 'Mobile App', included: true },
      { label: 'Expense Management', included: false },
      { label: 'Advanced Analytics', included: false },
      { label: 'Multi-Region Support', included: false },
      { label: 'Priority Support', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Shield,
    price: 2999,
    period: '/month',
    desc: 'For growing teams that need more power and flexibility.',
    color: 'border-[#E64833]',
    headerBg: 'bg-[#244855]',
    iconColor: 'text-white',
    popular: true,
    cta: 'Get Started',
    features: [
      { label: 'Up to 50 Field Agents', included: true },
      { label: 'GPS Live Tracking', included: true },
      { label: 'Task Management', included: true },
      { label: 'Attendance System', included: true },
      { label: 'Advanced Reports', included: true },
      { label: 'Mobile App', included: true },
      { label: 'Expense Management', included: true },
      { label: 'Advanced Analytics', included: true },
      { label: 'Multi-Region Support', included: true },
      { label: 'Priority Support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    price: 7999,
    period: '/month',
    desc: 'For large enterprises managing hundreds of agents.',
    color: 'border-[#874F41]/40',
    headerBg: 'bg-[#874F41]/10',
    iconColor: 'text-[#874F41]',
    cta: 'Contact Sales',
    features: [
      { label: 'Unlimited Field Agents', included: true },
      { label: 'GPS Live Tracking', included: true },
      { label: 'Task Management', included: true },
      { label: 'Attendance System', included: true },
      { label: 'Custom Reports', included: true },
      { label: 'Mobile App + White Label', included: true },
      { label: 'Expense Management', included: true },
      { label: 'AI-Powered Analytics', included: true },
      { label: 'Multi-Region Support', included: true },
      { label: '24/7 Dedicated Support', included: true },
    ],
  },
];

export default function PricingSection() {
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
    <section id="pricing" ref={sectionRef} className="py-20 lg:py-28 bg-white dark:bg-[#0d1f28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#244855]/10 border border-[#244855]/20 text-[#244855] dark:text-[#90AEAD] text-sm font-semibold mb-4">
            💰 Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-[#244855] dark:text-white mb-4">
            Simple Plans, <span className="text-[#E64833]">No Hidden Fees</span>
          </h2>
          <p className="text-lg text-[#90AEAD]">All plans include a 14-day free trial. No credit card required.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative card-base border-2 ${plan.color} overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-300`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#E64833] text-white text-xs font-bold text-center py-1.5 tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 ${plan.popular ? 'pt-10' : ''} ${plan.headerBg}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${plan.popular ? 'bg-white/20' : 'bg-white'} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${plan.popular ? 'text-white' : plan.iconColor}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold font-display text-lg ${plan.popular ? 'text-white' : 'text-[#244855] dark:text-white'}`}>{plan.name}</h3>
                      <p className={`text-xs ${plan.popular ? 'text-white/70' : 'text-[#90AEAD]'}`}>{plan.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className={`text-4xl font-bold font-display ${plan.popular ? 'text-white' : 'text-[#244855] dark:text-white'}`}>
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-sm mb-1 ${plan.popular ? 'text-white/70' : 'text-[#90AEAD]'}`}>{plan.period}</span>
                  </div>
                </div>

                <div className="p-6 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map(f => (
                      <li key={f.label} className="flex items-center gap-3">
                        {f.included ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${f.included ? 'text-[#244855] dark:text-white' : 'text-gray-400'}`}>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/register"
                    className={`w-full flex items-center justify-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 min-h-[44px] ${
                      plan.popular
                        ? 'bg-[#E64833] text-white shadow-accent hover:bg-[#cc3d29]'
                        : 'border-2 border-[#244855] text-[#244855] dark:text-white dark:border-white hover:bg-[#244855] hover:text-white dark:hover:bg-white dark:hover:text-[#244855]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-[#90AEAD] mt-8 reveal">
          All prices are in INR and exclude GST. Annual billing saves 20%.
          <Link to="/contact" className="text-[#E64833] ml-1 hover:underline">Contact us for custom pricing →</Link>
        </p>
      </div>
    </section>
  );
}
