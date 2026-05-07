import { CheckCircle, FileText } from 'lucide-react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';

export const metadata = {
  title: 'Terms of Use | Pakistan Market',
  description: 'Read the Terms of Use for Pakistan Market.',
};

const sections = [
  { title: '1. Acceptance of Terms', content: ['By accessing or using our platform, you agree to be bound by these Terms of Use.', 'If you do not agree to these terms, please do not use our services.', 'We reserve the right to modify these terms at any time without prior notice.'] },
  { title: '2. User Accounts', content: ['You must be at least 18 years old to create an account.', 'You are responsible for maintaining the confidentiality of your account credentials.', 'You agree to provide accurate and complete information when creating an account.', 'You are solely responsible for all activities that occur under your account.'] },
  { title: '3. Posting Ads', content: ['All ads must comply with our Posting Rules and Community Guidelines.', 'You may only post ads for items that you legally own or have the right to sell.', 'Prohibited items include illegal goods, counterfeit products, and hazardous materials.', 'We reserve the right to remove any ad that violates our policies.'] },
  { title: '4. Prohibited Activities', content: ['Spamming, phishing, or any fraudulent activities are strictly prohibited.', 'Harassment, hate speech, or discriminatory content will not be tolerated.', 'Attempting to circumvent our security measures is a violation of these terms.', 'Using automated systems to access our platform without permission is prohibited.'] },
  { title: '5. Transactions', content: ['We are not a party to any transaction between buyers and sellers.', 'Users are responsible for verifying the authenticity of items and sellers.', 'We recommend meeting in public places for local transactions.', 'Any disputes should be resolved directly between the parties involved.'] },
  { title: '6. Intellectual Property', content: ['All content on our platform is protected by copyright and other intellectual property laws.', 'You may not copy, modify, or distribute our content without permission.', 'By posting content, you grant us a license to use, modify, and display that content.', 'You retain ownership of any content you submit to our platform.'] },
  { title: '7. Limitation of Liability', content: ["We provide our services 'as is' without any warranties.", 'We are not liable for any damages arising from the use of our platform.', 'Our liability is limited to the amount paid for our services, if any.', 'We do not guarantee the accuracy or completeness of any user-generated content.'] },
  { title: '8. Termination', content: ['We may terminate or suspend your account at any time for violations of these terms.', 'You may terminate your account by contacting our support team.', 'Upon termination, your right to use our services immediately ceases.', 'Certain provisions of these terms survive termination.'] },
  { title: '9. Governing Law', content: ['These terms are governed by the laws of Pakistan.', 'Any disputes will be resolved in the courts of Lahore, Pakistan.', 'If any provision is found invalid, the remaining provisions remain in effect.'] },
  { title: '10. Contact Information', content: ['For questions about these terms, please contact us at legal@pakistanmarket.pk.', 'Our mailing address is: 123 Main Boulevard, Gulberg III, Lahore, Pakistan.'] },
];

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terms of Use" subtitle="Last updated: January 2025" badge="Legal">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Welcome to Pakistan Market. These Terms of Use govern your access to and use of our website and services. Please read these terms carefully before using our platform.
            </p>
            {sections.map((section) => (
              <div key={section.title} className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pm flex-shrink-0" />
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-pm mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-12 pt-8 border-t">
              <p className="text-gray-600">By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.</p>
            </div>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
