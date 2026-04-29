import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using Force1 ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to all the terms, you may not access or use the Platform. These terms apply to all users, including field agents, managers, and administrators.' },
    { title: '2. Description of Service', content: 'Force1 provides a cloud-based field force management platform that includes GPS tracking, task management, attendance monitoring, expense management, and analytics capabilities. We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice.' },
    { title: '3. User Accounts and Registration', content: 'You must provide accurate, complete, and current information when creating an account. You are responsible for maintaining the confidentiality of your login credentials. You must immediately notify Force1 of any unauthorized use of your account. Accounts may not be transferred to another party without prior written consent.' },
    { title: '4. Acceptable Use', content: 'You agree not to:\n\n- Use the Platform for any unlawful purpose or in violation of applicable laws\n- Attempt to gain unauthorized access to any part of the Platform\n- Transmit any harmful, offensive, or disruptive content\n- Interfere with or disrupt the integrity or performance of the Platform\n- Reverse engineer, decompile, or disassemble any portion of the Platform\n- Use automated tools to scrape or extract data from the Platform' },
    { title: '5. Data and Privacy', content: 'Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Platform, you consent to the collection and use of information as described in our Privacy Policy. You retain ownership of all data you input into the Platform.' },
    { title: '6. Intellectual Property', content: 'The Platform and its original content, features, and functionality are owned by Force1 and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not use our trademarks without prior written permission.' },
    { title: '7. Limitation of Liability', content: 'To the maximum extent permitted by applicable law, Force1 shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability to you for any claim arising from these Terms or your use of the Platform shall not exceed the amount paid by you in the 12 months preceding the claim.' },
    { title: '8. Termination', content: 'We may terminate or suspend your access to the Platform immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Platform will cease immediately.' },
    { title: '9. Governing Law', content: 'These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.' },
    { title: '10. Contact', content: 'For questions about these Terms, contact us at legal@force1.in or at our registered address: Force1 Technologies Pvt. Ltd., Bandra Kurla Complex, Mumbai, Maharashtra 400051, India.' },
  ];

  return (
    <main className="pt-16">
      <section className="py-16 gradient-teal">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold font-display text-white mb-4">Terms & <span className="text-[#E64833]">Conditions</span></h1>
          <p className="text-[#90AEAD]">Last updated: April 29, 2026 · Please read carefully before using Force1.</p>
        </div>
      </section>
      <section className="py-16 bg-white dark:bg-[#0d1f28]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none">
            {sections.map(section => (
              <div key={section.title} className="mb-10">
                <h2 className="text-xl font-bold text-[#244855] dark:text-white font-display mb-4">{section.title}</h2>
                {section.content.split('\n\n').map((para, i) => {
                  const items = para.split('\n').filter(l => l.startsWith('- '));
                  if (items.length > 0) return (
                    <ul key={i} className="space-y-2 mb-3">
                      {items.map((item, j) => <li key={j} className="flex items-start gap-2 text-[#244855]/80 dark:text-[#90AEAD]"><span className="text-[#E64833] mt-1.5">•</span>{item.slice(2)}</li>)}
                    </ul>
                  );
                  return <p key={i} className="text-[#244855]/80 dark:text-[#90AEAD] leading-relaxed mb-3">{para}</p>;
                })}
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-[#FBE9D0]/50 dark:bg-[#244855]/20 rounded-2xl border border-[#E64833]/20">
            <p className="text-sm text-[#244855] dark:text-white">Questions about these Terms? <Link to="/contact" className="text-[#E64833] font-semibold hover:underline">Contact our Legal Team →</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
