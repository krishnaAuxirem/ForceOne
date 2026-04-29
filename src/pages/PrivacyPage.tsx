import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const sections = [
    { title: '1. Information We Collect', content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.\n\n**Account Information:** Name, email address, phone number, company name, and password when you register.\n\n**Field Data:** Location data, task completion records, attendance check-ins, and expense submissions collected during normal platform use.\n\n**Usage Data:** Information about how you interact with our platform, including pages visited, features used, and time spent.\n\n**Device Information:** Device type, operating system, browser type, and IP address.` },
    { title: '2. How We Use Your Information', content: `We use the information we collect to:\n\n- Provide, maintain, and improve our field force management services\n- Process transactions and send related information\n- Send technical notices, updates, and security alerts\n- Respond to your comments, questions, and customer service requests\n- Monitor and analyze usage patterns to improve platform performance\n- Detect, investigate, and prevent fraudulent transactions and abuse` },
    { title: '3. Data Sharing and Disclosure', content: `We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as described below:\n\n**Within Your Organization:** Field data is shared with managers and administrators within your organization as configured by your account settings.\n\n**Service Providers:** We may share information with third-party vendors who provide services on our behalf, such as hosting, analytics, and customer support.\n\n**Legal Compliance:** We may disclose information when required by law or in response to valid requests by public authorities.` },
    { title: '4. Data Security', content: `We implement industry-standard security measures to protect your personal information:\n\n- AES-256 encryption for data at rest and TLS 1.3 for data in transit\n- Regular security audits and penetration testing\n- Role-based access controls and multi-factor authentication\n- Automated threat detection and incident response procedures\n- SOC 2 Type II certified infrastructure\n\nDespite these measures, no method of transmission over the Internet is 100% secure.` },
    { title: '5. Data Retention', content: `We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting our support team.\n\nField activity logs are retained for 12 months by default for compliance purposes. Expense records may be retained for up to 7 years to comply with financial record-keeping requirements.` },
    { title: '6. Your Rights', content: `Depending on your location, you may have the following rights regarding your personal data:\n\n- **Access:** Request a copy of the personal information we hold about you\n- **Correction:** Request correction of inaccurate or incomplete information\n- **Deletion:** Request deletion of your personal information\n- **Portability:** Receive your data in a structured, machine-readable format\n- **Objection:** Object to processing of your personal information\n\nTo exercise these rights, contact us at privacy@force1.in` },
    { title: '7. Contact Us', content: `If you have questions about this Privacy Policy or our privacy practices, please contact us:\n\nForce1 Privacy Team\nEmail: privacy@force1.in\nPhone: +91 800 123 4567\nAddress: Bandra Kurla Complex, Mumbai, Maharashtra 400051` },
  ];

  return (
    <main className="pt-16">
      <section className="py-16 gradient-teal">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold font-display text-white mb-4">Privacy <span className="text-[#E64833]">Policy</span></h1>
          <p className="text-[#90AEAD]">Last updated: April 29, 2026 · Effective: May 1, 2026</p>
        </div>
      </section>
      <section className="py-16 bg-white dark:bg-[#0d1f28]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#90AEAD] leading-relaxed mb-10">
              At Force1, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our field force management platform.
            </p>
            {sections.map(section => (
              <div key={section.title} className="mb-10">
                <h2 className="text-xl font-bold text-[#244855] dark:text-white font-display mb-4">{section.title}</h2>
                {section.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[#244855]/80 dark:text-[#90AEAD] leading-relaxed mb-3">{para.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-[#FBE9D0]/50 dark:bg-[#244855]/20 rounded-2xl border border-[#E64833]/20">
            <p className="text-sm text-[#244855] dark:text-white">Have privacy concerns? <Link to="/contact" className="text-[#E64833] font-semibold hover:underline">Contact our Privacy Team →</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
