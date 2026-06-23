import { useState, useEffect } from 'react';
import { Check, X, Zap, Shield, Crown, HelpCircle, ChevronDown, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    basePrice: 999,
    desc: 'Perfect for small field teams just getting started.',
    color: 'border-[#90AEAD]/30',
    headerBg: 'bg-[#90AEAD]/10 dark:bg-[#90AEAD]/5',
    iconColor: 'text-[#90AEAD]',
    cta: 'Start Free Trial',
    features: [
      { label: 'Up to 15 Field Agents', included: true },
      { label: 'GPS Live Tracking (15 min interval)', included: true },
      { label: 'Task & Visit Management', included: true },
      { label: 'Attendance System (Selfie + GPS)', included: true },
      { label: 'Basic Reports', included: true },
      { label: 'Mobile App Access', included: true },
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
    basePrice: 2999,
    desc: 'For growing teams that need more power and flexibility.',
    color: 'border-[#E64833]',
    headerBg: 'bg-[#244855]/95 dark:bg-[#1f3640]',
    iconColor: 'text-white',
    popular: true,
    cta: 'Get Started',
    features: [
      { label: 'Up to 100 Field Agents', included: true },
      { label: 'GPS Live Tracking (2 min interval)', included: true },
      { label: 'Task & Visit Management', included: true },
      { label: 'Attendance System (Geofenced)', included: true },
      { label: 'Advanced Reports & Exports', included: true },
      { label: 'Mobile App Access', included: true },
      { label: 'Expense Management & OCR', included: true },
      { label: 'Advanced Analytics', included: true },
      { label: 'Multi-Region Support', included: true },
      { label: 'Priority Support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    basePrice: 7999,
    desc: 'For large enterprises managing hundreds of agents.',
    color: 'border-[#874F41]/40',
    headerBg: 'bg-[#874F41]/15 dark:bg-[#874F41]/10',
    iconColor: 'text-[#874F41]',
    cta: 'Contact Sales',
    features: [
      { label: 'Unlimited Field Agents', included: true },
      { label: 'GPS Live Tracking (15s Real-time)', included: true },
      { label: 'AI Auto-routing & Optimization', included: true },
      { label: 'Custom Geofences & Wi-Fi Check-in', included: true },
      { label: 'Custom PDF/Excel Reports', included: true },
      { label: 'Mobile App + White Label Option', included: true },
      { label: 'Expense Approval Workflows', included: true },
      { label: 'AI-Powered Predictive Analytics', included: true },
      { label: 'Multi-Region & Sub-org Setup', included: true },
      { label: '24/7 Dedicated Support Manager', included: true },
    ],
  },
];

const COMPARISON_FEATURES = [
  { category: 'Tracking & Attendance', name: 'GPS Ping Rate', starter: '15 mins', professional: '2 mins', enterprise: 'Real-time (15s)' },
  { category: 'Tracking & Attendance', name: 'Geofences', starter: 'Up to 5', professional: 'Up to 100', enterprise: 'Unlimited' },
  { category: 'Tracking & Attendance', name: 'Selfie Verification', starter: 'Yes', professional: 'Yes', enterprise: 'Yes (AI Face Match)' },
  { category: 'Tracking & Attendance', name: 'Offline Operations', starter: 'Limited cache', professional: 'Full local DB sync', enterprise: 'Full local DB sync' },
  
  { category: 'Operations & Dispatch', name: 'Daily Tasks per Agent', starter: '10 visits', professional: '50 visits', enterprise: 'Unlimited' },
  { category: 'Operations & Dispatch', name: 'Route Optimization', starter: 'Manual routing', professional: 'Basic optimization', enterprise: 'AI-driven dynamic routing' },
  { category: 'Operations & Dispatch', name: 'Expense Logs with OCR', starter: 'Manual entry', professional: 'Receipt OCR scan', enterprise: 'OCR + Auto-reimbursement' },
  
  { category: 'Integrations & Developers', name: 'API Access', starter: 'Read-only', professional: 'Full REST API (100 req/min)', enterprise: 'Custom Rate Limit + SDKs' },
  { category: 'Integrations & Developers', name: 'Webhooks', starter: 'None', professional: '5 dispatch events', enterprise: 'Unlimited custom event topics' },
  { category: 'Integrations & Developers', name: 'White-label Mobile App', starter: 'No', professional: 'No', enterprise: 'Yes (Add-on)' },
  
  { category: 'Analytics & Support', name: 'Reports Archive', starter: '30 Days', professional: '1 Year', enterprise: 'Unlimited / Custom' },
  { category: 'Analytics & Support', name: 'Customer Support', starter: 'Email (24-48h)', professional: 'Priority Email/Phone', enterprise: '24/7 Dedicated Manager' },
];

const FAQS = [
  { q: 'Can I change my plan or billing cycle later?', a: 'Yes! You can upgrade, downgrade, or switch between monthly and annual billing cycles at any time from your Billing Settings. Upgrades will take effect immediately, while downgrades apply at the end of the current billing cycle.' },
  { q: 'What happens when my 14-day trial ends?', a: 'Once your free trial expires, your dashboard access will be paused until you choose a subscription plan. We will not charge you automatically since we do not require a credit card for signing up.' },
  { q: 'Are there any hidden fees or hardware requirements?', a: 'No hidden fees. All prices exclude local GST/taxes. The system does not require any special hardware tracker—agents can use their existing iOS or Android smartphones.' },
  { q: 'What is your refund policy?', a: 'We offer a 30-day money-back guarantee for all newly initiated subscriptions. If you are not satisfied with Force1, contact support and we will process a full refund within 3 business days.' },
  { q: 'Do you offer custom pricing for non-profits or startups?', a: 'Yes! We support early-stage startups and registered NGOs with custom discounts. Get in touch with our sales team at support@force1.in to share details and receive a customized quote.' },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [teamSize, setTeamSize] = useState(15);
  const [calcPlan, setCalcPlan] = useState<'starter' | 'professional' | 'enterprise'>('starter');
  const [calcCost, setCalcCost] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  // Update recommended plan & cost dynamically based on team size
  useEffect(() => {
    let plan: 'starter' | 'professional' | 'enterprise' = 'starter';
    let basePricePerAgent = 0;

    if (teamSize <= 15) {
      plan = 'starter';
      basePricePerAgent = 99; // Starter is ₹99/agent/month
    } else if (teamSize <= 100) {
      plan = 'professional';
      basePricePerAgent = 79; // Professional is ₹79/agent/month
    } else {
      plan = 'enterprise';
      basePricePerAgent = 59; // Enterprise is ₹59/agent/month
    }

    setCalcPlan(plan);
    
    // Apply annual discount
    const multiplier = isAnnual ? 0.8 : 1;
    setCalcCost(Math.round(teamSize * basePricePerAgent * multiplier));
  }, [teamSize, isAnnual]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getSavings = (price: number) => {
    return Math.round(price * 12 * 0.2);
  };

  return (
    <main className="pt-20 bg-white dark:bg-[#0d1f28] text-[#244855] dark:text-white transition-colors duration-300">
      
      {/* 1. Header Hero */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-[#90AEAD]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#244855]/5 to-[#E64833]/5 dark:from-[#244855]/20 dark:to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E64833]/10 border border-[#E64833]/20 text-[#E64833] text-sm font-semibold mb-4 animate-fade-in">
            Plans Tailored to Your Growth
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-[#244855] dark:text-white mb-6">
            Simple, Transparent <span className="text-[#E64833]">Pricing</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#90AEAD] leading-relaxed mb-8">
            Manage your mobile workforce, coordinate logistics, and dispatch tasks with zero hidden charges. Start in minutes with a 14-day free trial.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-[#244855] dark:text-white' : 'text-[#90AEAD]'}`}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-[#244855] dark:bg-white/10 rounded-full transition-colors duration-300 flex items-center p-1 cursor-pointer focus:outline-none"
              aria-label="Toggle billing cycle"
            >
              <div
                className={`w-5 h-5 bg-[#E64833] rounded-full transition-transform duration-300 transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-[#244855] dark:text-white' : 'text-[#90AEAD]'}`}>
              Annual Billing
              <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Pricing Plans Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            // Calculate prices dynamically based on cycle
            const monthlyRate = isAnnual ? plan.basePrice * 0.8 : plan.basePrice;
            const savings = getSavings(plan.basePrice);

            return (
              <div
                key={plan.id}
                className={`relative card-base border-2 ${plan.color} overflow-hidden flex flex-col hover:-translate-y-2.5 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#E64833] text-white text-[10px] font-bold text-center py-1.5 tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                
                {/* Plan Header */}
                <div className={`p-6 ${plan.popular ? 'pt-10' : ''} ${plan.headerBg}`}>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${plan.popular ? 'bg-white/20' : 'bg-white shadow-sm border border-[#90AEAD]/20'} flex items-center justify-center`}>
                      <Icon className={`w-5.5 h-5.5 ${plan.popular ? 'text-white' : plan.iconColor}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold font-display text-xl ${plan.popular ? 'text-white' : 'text-[#244855] dark:text-white'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-xs ${plan.popular ? 'text-white/80' : 'text-[#90AEAD]'} max-w-[200px]`}>
                        {plan.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end gap-1.5 mb-2">
                    <span className={`text-4xl md:text-5xl font-bold font-display ${plan.popular ? 'text-white' : 'text-[#244855] dark:text-white'}`}>
                      ₹{Math.round(monthlyRate).toLocaleString('en-IN')}
                    </span>
                    <span className={`text-xs mb-1.5 ${plan.popular ? 'text-white/70' : 'text-[#90AEAD]'}`}>/month</span>
                  </div>

                  {isAnnual ? (
                    <div className={`text-[10px] font-bold ${plan.popular ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      Billed annually (Save ₹{savings.toLocaleString('en-IN')}/year)
                    </div>
                  ) : (
                    <div className="text-[10px] text-transparent select-none">No annual discount applied</div>
                  )}
                </div>

                {/* Plan Features */}
                <div className="p-6 flex-1 space-y-4">
                  <p className="text-[11px] font-bold text-[#90AEAD] uppercase tracking-wider">Features Included:</p>
                  <ul className="space-y-3.5">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {f.included ? (
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${f.included ? 'text-[#244855] dark:text-white font-medium' : 'text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700'}`}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action */}
                <div className="p-6 pt-0 mt-auto">
                  <Link
                    to={plan.id === 'enterprise' ? '/contact' : '/register'}
                    className={`w-full flex items-center justify-center py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-98 min-h-[44px] ${
                      plan.popular
                        ? 'bg-[#E64833] text-white shadow-accent hover:bg-[#cc3d29]'
                        : 'border-2 border-[#244855] text-[#244855] dark:text-white dark:border-white/30 hover:bg-[#244855] hover:text-white dark:hover:bg-white dark:hover:text-[#244855]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Cost Calculator Section */}
      <section className="py-20 bg-slate-50 dark:bg-[#152731]/50 border-y border-[#90AEAD]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#244855]/15 dark:bg-[#244855]/30 text-[#244855] dark:text-[#90AEAD] text-xs font-semibold mb-3">
              <Calculator className="w-4 h-4" /> Team Size Estimator
            </div>
            <h2 className="text-3xl font-bold font-display text-[#244855] dark:text-white">
              Estimate Your Custom <span className="text-[#E64833]">Agent Roster</span> Cost
            </h2>
            <p className="text-sm text-[#90AEAD] mt-2">
              Drag the slider based on the number of field agents to find your estimated pricing.
            </p>
          </div>

          <div className="card-base p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center justify-between shadow-force-lg">
            
            {/* Slider Controls */}
            <div className="flex-1 w-full space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Number of Field Agents:</span>
                <span className="text-2xl font-bold text-[#E64833] font-mono">{teamSize} Agents</span>
              </div>

              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#E64833]"
              />

              <div className="flex justify-between text-xs text-[#90AEAD] font-semibold">
                <span>5 Agents</span>
                <span>100 Agents</span>
                <span>250 Agents</span>
                <span>500 Agents</span>
              </div>
            </div>

            {/* Calculations Panel */}
            <div className="w-full md:w-80 p-5 rounded-2xl bg-[#244855] text-white flex flex-col justify-between self-stretch relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#90AEAD] uppercase">Recommended Tier</span>
                <h4 className="text-xl font-bold font-display text-white mt-1 capitalize flex items-center gap-1.5">
                  {calcPlan === 'enterprise' ? <Crown className="w-4 h-4 text-[#874F41]" /> : calcPlan === 'professional' ? <Shield className="w-4 h-4 text-emerald-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
                  {calcPlan} Plan
                </h4>
                <p className="text-[10px] text-white/70 mt-1">Ideal for {teamSize <= 15 ? 'small team operations' : teamSize <= 100 ? 'medium businesses' : 'large operations'}.</p>
              </div>

              <div className="my-6">
                <span className="text-[10px] font-bold tracking-widest text-[#90AEAD] uppercase">Estimated Pricing</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-mono font-bold text-white">₹{calcCost.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#90AEAD]">/month</span>
                </div>
                {isAnnual && (
                  <span className="text-[9px] text-emerald-400 font-bold block mt-1">Annual savings calculated in cost.</span>
                )}
              </div>

              <Link
                to={calcPlan === 'enterprise' ? '/contact' : '/register'}
                className="w-full bg-[#E64833] hover:bg-[#cc3d29] text-white text-center py-2.5 rounded-xl font-bold text-xs transition-colors shadow-accent min-h-[38px] flex items-center justify-center"
              >
                {calcPlan === 'enterprise' ? 'Contact Sales' : 'Get Started Free'}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Complete Feature Comparison Table */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-[#244855] dark:text-white">
            Compare Plan <span className="text-[#E64833]">Features</span>
          </h2>
          <p className="text-sm text-[#90AEAD] mt-2">
            Detailed matrix of features to guide you to the perfect package.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#90AEAD]/20 shadow-sm">
          <table className="w-full text-left border-collapse bg-white dark:bg-[#1a2d38]">
            <thead>
              <tr className="bg-[#244855]/5 border-b border-[#90AEAD]/20 text-[#244855] dark:text-white font-bold text-xs uppercase tracking-wider">
                <th className="p-4 sm:p-5 w-1/3">Feature Category & Name</th>
                <th className="p-4 sm:p-5 text-center">Starter</th>
                <th className="p-4 sm:p-5 text-center">Professional</th>
                <th className="p-4 sm:p-5 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90AEAD]/10 text-xs sm:text-sm">
              {COMPARISON_FEATURES.map((item, idx) => {
                const prev = idx > 0 ? COMPARISON_FEATURES[idx - 1] : null;
                const isNewCategory = !prev || prev.category !== item.category;

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-4 sm:p-5">
                      {isNewCategory && (
                        <span className="block text-[10px] font-bold text-[#E64833] uppercase tracking-wider mb-1">
                          {item.category}
                        </span>
                      )}
                      <span className="font-semibold text-[#244855] dark:text-white">{item.name}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center text-slate-500 dark:text-[#90AEAD] font-mono">
                      {item.starter === 'Yes' ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : item.starter === 'No' ? (
                        <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      ) : (
                        item.starter
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center text-slate-700 dark:text-slate-300 font-semibold font-mono">
                      {item.professional === 'Yes' ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : item.professional === 'No' ? (
                        <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      ) : (
                        item.professional
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center text-[#E64833] font-bold font-mono">
                      {item.enterprise === 'Yes' ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : item.enterprise === 'No' ? (
                        <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                      ) : (
                        item.enterprise
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Pricing FAQ Accordion */}
      <section className="py-20 bg-slate-50 dark:bg-[#152731]/50 border-t border-[#90AEAD]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-[#244855] dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-[#E64833]" /> Pricing & Billing <span className="text-[#E64833]">FAQs</span>
            </h2>
            <p className="text-sm text-[#90AEAD] mt-2">
              Common questions and answers regarding licenses, refunds, and trials.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#1a2d38] border border-[#90AEAD]/20 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#244855] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors focus:outline-none min-h-[44px]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#90AEAD] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#90AEAD] leading-relaxed border-t border-[#90AEAD]/10 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="py-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl my-16 bg-[#244855] text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#244855] via-transparent to-[#E64833]/25" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
            Ready to Optimize Your <span className="text-[#E64833]">Operations?</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm text-[#90AEAD] leading-relaxed">
            Get 14-days full access to features immediately. Register today without entering payment credentials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/register" className="btn-accent px-8 py-3.5 rounded-xl font-bold">
              Start Free Trial
            </Link>
            <Link to="/contact" className="px-8 py-3.5 border-2 border-white/30 hover:border-white rounded-xl text-white font-bold transition-all min-h-[44px] flex items-center justify-center">
              Speak to Consultant
            </Link>
          </div>
        </div>
      </section>
      
    </main>
  );
}
