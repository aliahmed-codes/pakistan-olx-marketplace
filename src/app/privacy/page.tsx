import { CheckCircle, Shield, Lock, Eye, Database, Share2 } from 'lucide-react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';

export const metadata = {
  title: 'Privacy Policy | Pakistan Market',
  description: 'Learn how Pakistan Market collects, uses, and protects your personal information.',
};

const sections = [
  { icon: Database, title: '1. Information We Collect', content: ['Personal information: name, email, phone number, and address.', 'Account information: username, password, and profile details.', 'Transaction information: ads posted, messages sent, and purchases made.', 'Device information: IP address, browser type, and operating system.', 'Usage data: pages visited, time spent, and interactions with our platform.'] },
  { icon: Eye, title: '2. How We Use Your Information', content: ['To provide and maintain our services.', 'To process transactions and send related information.', 'To communicate with you about updates, promotions, and support.', 'To improve our platform and develop new features.', 'To detect and prevent fraud and abuse.', 'To comply with legal obligations.'] },
  { icon: Share2, title: '3. Information Sharing', content: ['We do not sell your personal information to third parties.', 'We may share information with service providers who assist our operations.', 'We may disclose information if required by law or to protect our rights.', 'With your consent, we may share information with business partners.'] },
  { icon: Lock, title: '4. Data Security', content: ['We implement industry-standard security measures to protect your data.', 'All data is encrypted in transit and at rest.', 'We regularly review and update our security practices.', 'Despite our efforts, no security system is completely impenetrable.'] },
  { icon: Shield, title: '5. Your Rights', content: ['You have the right to access your personal information.', 'You can request correction of inaccurate information.', 'You may request deletion of your data (subject to legal requirements).', 'You can opt out of marketing communications at any time.', 'You have the right to data portability.'] },
];

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="Last updated: January 2025" badge="Legal">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <p className="text-gray-600 leading-relaxed text-lg">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using our platform, you consent to the practices described in this policy.
              </p>
            </div>
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-pm/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-pm" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-pm mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-gradient-to-br from-pm to-pm-light rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Contact Us About Privacy</h2>
              <p className="text-white/80 mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <ul className="space-y-1 text-white/80">
                <li>Email: privacy@pakistanmarket.pk</li>
                <li>Address: 123 Main Boulevard, Gulberg III, Lahore, Pakistan</li>
                <li>Phone: +92 300 1234567</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
