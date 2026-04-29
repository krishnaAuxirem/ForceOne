import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    toast.success('Message sent! We will respond within 24 hours.');
  };

  const CONTACT_INFO = [
    { icon: Mail, title: 'Email Us', value: 'support@force1.in', sub: 'We respond within 24 hours', href: 'mailto:support@force1.in' },
    { icon: Phone, title: 'Call Us', value: '+91 800 123 4567', sub: 'Mon-Fri, 9am–6pm IST', href: 'tel:+918001234567' },
    { icon: MapPin, title: 'Visit Us', value: 'Bandra Kurla Complex, Mumbai', sub: 'Maharashtra 400051', href: '#' },
    { icon: Clock, title: 'Support Hours', value: 'Mon–Fri: 9am–6pm', sub: 'Sat: 10am–2pm IST', href: '#' },
  ];

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-20 gradient-teal">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold font-display text-white mb-4">Get in <span className="text-[#E64833]">Touch</span></h1>
          <p className="text-xl text-[#90AEAD]">Have a question or want a demo? We are here to help.</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#0d1f28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: contact info */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-2xl font-bold font-display text-[#244855] dark:text-white">Contact Information</h2>
              <p className="text-[#90AEAD]">Choose the best way to reach us. Our team is always ready to help.</p>
              {CONTACT_INFO.map(({ icon: Icon, title, value, sub, href }) => (
                <a key={title} href={href} className="flex items-start gap-4 p-4 rounded-2xl border border-[#90AEAD]/20 hover:border-[#244855]/40 transition-all group block">
                  <div className="w-11 h-11 bg-[#244855] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#E64833] transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#244855] dark:text-white text-sm">{title}</p>
                    <p className="text-sm text-[#244855] dark:text-[#90AEAD] mt-0.5">{value}</p>
                    <p className="text-xs text-[#90AEAD] mt-0.5">{sub}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-[#244855] dark:text-white mb-3">Message Sent!</h3>
                  <p className="text-[#90AEAD] mb-6">Thanks for reaching out. We will respond within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-primary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-2xl font-bold font-display text-[#244855] dark:text-white mb-2">Send a Message</h2>

                  {/* Inquiry type */}
                  <div>
                    <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-2">Inquiry Type</label>
                    <div className="flex flex-wrap gap-2">
                      {[['general', 'General'], ['demo', 'Request Demo'], ['support', 'Technical Support'], ['sales', 'Sales']].map(([v, l]) => (
                        <button key={v} type="button" onClick={() => setForm(f => ({ ...f, type: v }))}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[40px] ${form.type === v ? 'bg-[#244855] text-white' : 'border border-[#90AEAD]/30 text-[#244855] dark:text-[#90AEAD] hover:border-[#244855]'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-1.5">Name *</label>
                      <input className="input-field" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-1.5">Email *</label>
                      <input type="email" className="input-field" placeholder="rahul@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-1.5">Subject</label>
                    <input className="input-field" placeholder="How can we help?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#244855] dark:text-white mb-1.5">Message *</label>
                    <textarea className="input-field resize-none" rows={5} placeholder="Tell us about your requirements..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-[#E64833] hover:bg-[#cc3d29] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-60 min-h-[48px] shadow-accent">
                    {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
