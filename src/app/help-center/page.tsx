import Link from 'next/link';
import { ChevronRight, Search as SearchIcon } from 'lucide-react';
import { HelpCircle, User, Package, MessageCircle, Shield, CreditCard } from 'lucide-react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import HelpSearch from './HelpSearch';

export const metadata = {
  title: 'Help Center | Pakistan Market',
  description: 'Find answers to your questions and get the help you need.',
};

const helpCategories = [
  {
    icon: User,
    title: 'Account & Profile',
    articles: ['How to create an account', 'How to verify your phone number', 'How to change your password', 'How to update your profile', 'How to delete your account'],
  },
  {
    icon: Package,
    title: 'Posting Ads',
    articles: ['How to post an ad', 'How to edit your ad', 'How to delete your ad', 'How to boost your ad', 'Posting rules and guidelines'],
  },
  {
    icon: SearchIcon,
    title: 'Searching & Buying',
    articles: ['How to search for items', 'How to filter search results', 'How to contact a seller', 'How to save favorite ads', 'Safety tips for buyers'],
  },
  {
    icon: MessageCircle,
    title: 'Messaging',
    articles: ['How to send messages', 'How to block a user', 'How to report a message', 'Message notifications'],
  },
  {
    icon: CreditCard,
    title: 'Payments & Billing',
    articles: ['How to feature your ad', 'Payment methods', 'Refund policy', 'Transaction fees'],
  },
  {
    icon: Shield,
    title: 'Safety & Security',
    articles: ['Safety tips for sellers', 'How to report a scam', 'How to block a user', 'Account security tips'],
  },
];

const popularArticles = [
  'How to post an ad',
  'How to contact a seller',
  'Safety tips for buyers',
  'How to verify your phone number',
  'Posting rules and guidelines',
];

export default function HelpCenterPage() {
  return (
    <InfoPageLayout
      title="Help Center"
      subtitle="Find answers to your questions and get the help you need"
      badge="Support"
    >
      {/* Search */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4 max-w-2xl">
          <HelpSearch />
        </div>
      </div>

      {/* Popular Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Articles</h2>
          <p className="text-gray-600 mb-6">Quick answers to common questions</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article) => (
              <Link key={article} href="#">
                <div className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                  <span className="text-gray-800 font-medium">{article}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Topic</h2>
          <p className="text-gray-600 mb-6">Find help organized by category</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((cat) => (
              <div key={cat.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pm/10 rounded-full flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-pm" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{cat.title}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.articles.map((article) => (
                    <li key={article}>
                      <Link href="#" className="text-gray-600 hover:text-pm text-sm flex items-center gap-2 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pm to-pm-light rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Can&apos;t find what you&apos;re looking for? Our support team is here to help.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <div className="bg-pm-yellow text-pm px-6 py-3 rounded-lg font-semibold hover:bg-pm-yellow/90 transition-colors cursor-pointer">
                  Contact Support
                </div>
              </Link>
              <a href="mailto:support@pakistanmarket.pk" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
