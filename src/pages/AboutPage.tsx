import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import fieldAgentImg from '@/assets/field-agent.jpg';
import managerDashboardImg from '@/assets/manager-dashboard.jpg';

const TEAM = [
  { name: 'Arjun Singh', role: 'CEO & Co-Founder', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', desc: 'Ex-McKinsey, IIT Bombay' },
  { name: 'Priya Patel', role: 'CTO & Co-Founder', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', desc: 'Ex-Google, IIT Delhi' },
  { name: 'Rahul Verma', role: 'Head of Product', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', desc: 'Ex-Flipkart, NIT Trichy' },
  { name: 'Anita Kapoor', role: 'VP Sales', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', desc: 'Ex-Salesforce, ISB' },
];

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-20 gradient-teal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FBE9D0] text-sm font-semibold mb-6">
            Our Story
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
            Built for the <span className="text-[#E64833]">Field,</span><br />Designed for Scale
          </h1>
          <p className="text-xl text-[#90AEAD] leading-relaxed max-w-3xl mx-auto">
            Force1 was founded in 2021 by a team of entrepreneurs who experienced firsthand the chaos of managing large distributed field teams without the right tools. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white dark:bg-[#0d1f28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold font-display text-[#244855] dark:text-white mb-5">Our Mission</h2>
              <p className="text-lg text-[#90AEAD] leading-relaxed mb-6">
                To empower every field organization — from 10-agent startups to 10,000-agent enterprises — with the technology to manage, track, and optimize their on-ground operations in real time.
              </p>
              <p className="text-[#90AEAD] leading-relaxed mb-8">
                We believe field agents are the backbone of business. They deserve tools that make their work easier, not harder. Force1 puts powerful technology in their hands while giving managers the visibility they need to lead effectively.
              </p>
              <div className="space-y-3">
                {['Transparency in operations', 'Empowerment for field agents', 'Data-driven decision making', 'Continuous innovation'].map(v => (
                  <div key={v} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#E64833] flex-shrink-0" />
                    <span className="text-[#244855] dark:text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={fieldAgentImg} alt="Field agent" className="rounded-3xl shadow-force-lg w-full" />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-[#1a2d38] rounded-2xl shadow-card-hover p-5 border border-[#90AEAD]/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E64833]/10 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#E64833]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#244855] dark:text-white">#1 Field Force Platform</p>
                    <p className="text-xs text-[#90AEAD]">India 2024 & 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#FBE9D0]/30 dark:bg-[#152c35]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2021', label: 'Founded' },
              { value: '500+', label: 'Clients' },
              { value: '50K+', label: 'Users' },
              { value: '₹50Cr+', label: 'ARR' },
            ].map(s => (
              <div key={s.label} className="card-base p-6 text-center">
                <p className="text-3xl font-bold font-display text-[#E64833]">{s.value}</p>
                <p className="text-sm text-[#90AEAD] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-[#0d1f28]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-display text-[#244855] dark:text-white mb-4">Meet the Team</h2>
          <p className="text-lg text-[#90AEAD] mb-12">World-class builders who have been in the field themselves.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="card-base p-6 text-center group hover:-translate-y-1">
                <div className="w-20 h-20 rounded-2xl bg-[#244855] text-[#FBE9D0] font-bold text-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="font-bold text-[#244855] dark:text-white font-display">{member.name}</h4>
                <p className="text-sm text-[#E64833] font-medium mt-1">{member.role}</p>
                <p className="text-xs text-[#90AEAD] mt-1">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-teal text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white font-display mb-4">Join the Force1 Family</h2>
          <p className="text-[#90AEAD] mb-8">Start your free trial and see why 500+ companies trust Force1.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#E64833] hover:bg-[#cc3d29] rounded-2xl text-white font-bold text-lg shadow-accent transition-all">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
