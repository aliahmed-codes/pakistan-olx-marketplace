import Link from 'next/link';
import { HelpCircle, MessageCircle, Mail, Phone, FileText, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfoPageLayout from '@/components/layout/InfoPageLayout';

export const metadata = {
  title: 'Support | Pakistan Market',
  description: 'Get support from the Pakistan Market team. We are here to help you.',
};

const supportOptions = [
  { icon: MessageCircle, title: 'Live Chat', description: 'Chat with our support team in real-time', action: 'Start Chat', href: '#', available: '9AM - 6PM', color: 'bg-purple-100 text-purple-600' },
  { icon: Mail, title: 'Email Support', description: "Send us an email and we'll respond within 24 hours", action: 'Send Email', href: 'mailto:support@pakistanmarket.pk', available: '24/7', color: 'bg-blue-100 text-blue-600' },
  { icon: Phone, title: 'Phone Support', description: 'Call us for immediate assistance', action: 'Call Now', href: 'tel:+923001234567', available: '9AM - 6PM', color: 'bg-green-100 text-green-600' },
];

const quickLinks = [
  { icon: FileText, title: 'Help Center', description: 'Browse our knowledge base', href: '/help-center' },
  { icon: Shield, title: 'Safety Tips', description: 'Learn how to stay safe', href: '/safety-tips' },
  { icon: FileText, title: 'Posting Rules', description: 'Guidelines for posting ads', href: '/posting-rules' },
  { icon: HelpCircle, title: 'FAQs', description: 'Frequently asked questions', href: '/help-center' },
];

const commonIssues = [
  'How to post an ad', 'How to edit my ad', 'How to delete my ad',
  'How to reset my password', 'How to contact a seller', 'How to report a problem',
];

export default function SupportPage() {
  return (
    <InfoPageLayout title="How Can We Help?" subtitle="Get the support you need, when you need it" badge="Support">
      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose the support option that works best for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportOptions.map((opt) => (
              <div key={opt.title} className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${opt.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <opt.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.title}</h3>
                <p className="text-gray-600 mb-2">{opt.description}</p>
                <p className="text-sm text-gray-500 mb-4">Available: {opt.available}</p>
                <a href={opt.href}>
                  <Button className="w-full bg-pm hover:bg-pm-light">{opt.action}</Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find answers quickly with these resources</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <div className="bg-gray-50 rounded-xl p-6 hover:bg-pm hover:text-white transition-all cursor-pointer group border border-gray-100">
                  <div className="w-12 h-12 bg-white group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <link.icon className="w-6 h-6 text-pm group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{link.title}</h3>
                  <p className="text-gray-600 group-hover:text-white/80 text-sm">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Common Issues</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="grid sm:grid-cols-2 gap-4">
                {commonIssues.map((issue) => (
                  <Link key={issue} href="/help-center">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-800">{issue}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pm to-pm-light rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Our support team is always here to assist you. Don&apos;t hesitate to reach out!</p>
            <Link href="/contact">
              <Button size="lg" className="bg-pm-yellow text-pm hover:bg-pm-yellow/90 font-semibold">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
