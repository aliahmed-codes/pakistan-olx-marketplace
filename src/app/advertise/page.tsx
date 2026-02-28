"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  Star,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10M+", label: "Monthly Active Users" },
  { value: "50M+", label: "Monthly Page Views" },
  { value: "100+", label: "Cities Covered" },
  { value: "15%", label: "Average Conversion Rate" },
];

const advertisingOptions = [
  {
    icon: Star,
    title: "Featured Ads",
    description:
      "Get your ads highlighted at the top of search results for maximum visibility.",
    price: "Starting from Rs. 2,000",
    features: [
      "Top placement in search results",
      "Highlighted with special badge",
      "7-day featured duration",
      "Increased views and responses",
    ],
  },
  {
    icon: Zap,
    title: "Homepage Banners",
    description:
      "Display your brand or products on our homepage with premium banner placements.",
    price: "Starting from Rs. 50,000",
    features: [
      "Prime homepage visibility",
      "High-impact visual placement",
      "Targeted audience reach",
      "Detailed analytics",
    ],
  },
  {
    icon: Target,
    title: "Category Sponsorship",
    description:
      "Sponsor entire categories and dominate your market segment.",
    price: "Starting from Rs. 100,000",
    features: [
      "Exclusive category branding",
      "Premium ad placements",
      "Custom campaign design",
      "Dedicated account manager",
    ],
  },
  {
    icon: Globe,
    title: "City-wide Campaigns",
    description:
      "Target specific cities or regions with localized advertising campaigns.",
    price: "Starting from Rs. 30,000",
    features: [
      "Geo-targeted advertising",
      "Local market penetration",
      "Custom audience targeting",
      "Performance tracking",
    ],
  },
];

const benefits = [
  {
    icon: Users,
    title: "Massive Reach",
    description:
      "Connect with millions of active buyers and sellers across Pakistan.",
  },
  {
    icon: Target,
    title: "Targeted Advertising",
    description:
      "Reach your ideal customers with precise targeting by location, category, and demographics.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Track your campaign performance with comprehensive analytics and insights.",
  },
  {
    icon: TrendingUp,
    title: "High ROI",
    description:
      "Get the best return on investment with our cost-effective advertising solutions.",
  },
];

export default function AdvertisePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002f34] to-[#005f6b] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Advertising</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Advertise With Us
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Reach millions of potential customers across Pakistan&apos;s largest
              marketplace
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-[#002f34] hover:bg-gray-100"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#002f34] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertising Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advertising Options
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect advertising solution for your business needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {advertisingOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                <div className="w-14 h-14 bg-[#002f34]/10 rounded-full flex items-center justify-center mb-4">
                  <option.icon className="w-7 h-7 text-[#002f34]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-[#002f34] font-semibold mb-4">
                  {option.price}
                </p>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Advertise With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the benefits of partnering with Pakistan&apos;s leading
              marketplace
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#002f34]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[#002f34]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#002f34] to-[#005f6b] rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Contact our advertising team today and start reaching millions of
              potential customers
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-[#002f34] hover:bg-gray-100"
                >
                  Contact Sales Team
                </Button>
              </Link>
              <a
                href="mailto:advertising@example.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                advertising@example.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
