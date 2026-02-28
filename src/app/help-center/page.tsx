"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageCircle,
  Shield,
  FileText,
  CreditCard,
  User,
  Package,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  {
    icon: User,
    title: "Account & Profile",
    articles: [
      "How to create an account",
      "How to verify your phone number",
      "How to change your password",
      "How to update your profile",
      "How to delete your account",
    ],
  },
  {
    icon: Package,
    title: "Posting Ads",
    articles: [
      "How to post an ad",
      "How to edit your ad",
      "How to delete your ad",
      "How to boost your ad",
      "Posting rules and guidelines",
    ],
  },
  {
    icon: Search,
    title: "Searching & Buying",
    articles: [
      "How to search for items",
      "How to filter search results",
      "How to contact a seller",
      "How to save favorite ads",
      "Safety tips for buyers",
    ],
  },
  {
    icon: MessageCircle,
    title: "Messaging",
    articles: [
      "How to send messages",
      "How to block a user",
      "How to report a message",
      "Message notifications",
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    articles: [
      "How to feature your ad",
      "Payment methods",
      "Refund policy",
      "Transaction fees",
    ],
  },
  {
    icon: Shield,
    title: "Safety & Security",
    articles: [
      "Safety tips for sellers",
      "How to report a scam",
      "How to block a user",
      "Account security tips",
    ],
  },
];

const popularArticles = [
  "How to post an ad",
  "How to contact a seller",
  "Safety tips for buyers",
  "How to verify your phone number",
  "Posting rules and guidelines",
];

export default function HelpCenterPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002f34] to-[#005f6b] py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
              <HelpCircle className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Support</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Help Center
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Find answers to your questions and get the help you need
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help..."
                className="pl-12 pr-4 py-6 bg-white border-0 text-gray-900 placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Popular Articles
            </h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href="#">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                    <span className="text-gray-800 font-medium">{article}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-gray-600">
              Find help organized by topic
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#002f34]/10 rounded-full flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-[#002f34]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-gray-600 hover:text-[#002f34] text-sm flex items-center gap-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#002f34] to-[#005f6b] rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <div className="bg-white text-[#002f34] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer">
                  Contact Support
                </div>
              </Link>
              <a
                href="mailto:support@example.com"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
