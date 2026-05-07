import Link from 'next/link';
import { Shield, Users, Zap, Globe, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfoPageLayout from '@/components/layout/InfoPageLayout';

const stats = [
  { value: '10M+', label: 'Active Users' },
  { value: '50M+', label: 'Ads Posted' },
  { value: '100+', label: 'Cities Covered' },
  { value: '99%', label: 'Satisfaction Rate' },
];

const values = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'We prioritize user safety with verified profiles, secure transactions, and 24/7 support.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Built for Pakistan, by Pakistanis. We understand local needs and connect communities.',
  },
  {
    icon: Zap,
    title: 'Fast & Easy',
    description: 'Post an ad in under 60 seconds. Our streamlined process makes buying and selling effortless.',
  },
  {
    icon: Globe,
    title: 'Nationwide Reach',
    description: 'From Karachi to Khyber, connect with buyers and sellers across all of Pakistan.',
  },
];

const team = [
  { name: 'Ahmed Khan', role: 'CEO & Founder', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed' },
  { name: 'Sarah Ali', role: 'Chief Technology Officer', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { name: 'Hassan Raza', role: 'Head of Operations', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hassan' },
  { name: 'Fatima Zahra', role: 'Marketing Director', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima' },
];

export const metadata = {
  title: 'About Us | Pakistan Market',
  description: "Pakistan's most trusted classifieds marketplace — learn about our mission, team and story.",
};

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About Us"
      subtitle="Pakistan's most trusted classifieds marketplace, connecting millions of buyers and sellers since 2020."
      badge="Our Story"
    >
      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-pm mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Founded in 2020, our platform was born from a simple idea: make buying and selling in Pakistan easier, safer, and more accessible for everyone.</p>
                <p>What started as a small project in Karachi has grown into Pakistan&apos;s largest classifieds marketplace, serving millions of users across all provinces and major cities.</p>
                <p>We believe in the power of local communities and the potential of every Pakistani entrepreneur. Our platform empowers individuals and businesses to reach customers they never thought possible.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pm to-pm-light rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/80 leading-relaxed mb-6">To create a trusted digital marketplace that empowers Pakistanis to buy, sell, and connect with their communities, fostering economic growth and digital inclusion across the nation.</p>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/80 leading-relaxed">To be the most trusted and preferred marketplace in Pakistan, where every transaction creates value and every user feels secure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-16 h-16 bg-pm/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-8 h-8 text-pm" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The passionate people behind Pakistan&apos;s favorite marketplace</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pm to-pm-light rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Be part of Pakistan&apos;s largest marketplace. Start buying and selling today!</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/post-ad">
                <Button size="lg" className="bg-pm-yellow text-pm hover:bg-pm-yellow/90 font-semibold">Post Free Ad</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </InfoPageLayout>
  );
}
