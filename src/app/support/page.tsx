"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    action: "Start Chat",
    href: "#",
    available: "9AM - 6PM",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours",
    action: "Send Email",
    href: "mailto:support@example.com",
    available: "24/7",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us for immediate assistance",
    action: "Call Now",
    href: "tel:+923001234567",
    available: "9AM - 6PM",
  },
];

const quickLinks = [
  {
    icon: FileText,
    title: "Help Center",
    description: "Browse our knowledge base",
    href: "/help-center",
  },
  {
    icon: Shield,
    title: "Safety Tips",
    description: "Learn how to stay safe",
    href: "/safety-tips",
  },
  {
    icon: FileText,
    title: "Posting Rules",
    description: "Guidelines for posting ads",
    href: "/posting-rules",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Frequently asked questions",
    href: "/help-center",
  },
];

const commonIssues = [
  "How to post an ad",
  "How to edit my ad",
  "How to delete my ad",
  "How to reset my password",
  "How to contact a seller",
  "How to report a problem",
];

export default function SupportPage() {
  const [mounted, setMounted] = useState(false);

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
              How Can We Help?
            </h1>
            <p className="text-lg text-white/80">
              Get the support you need, when you need it
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Support
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the support option that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 text-center"
              >
                <div className="w-14 h-14 bg-[#002f34]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-7 h-7 text-[#002f34]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Available: {option.available}
                </p>
                <a href={option.href}>
                  <Button className="w-full bg-[#002f34] hover:bg-[#002f34]/90">
                    {option.action}
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Links
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers quickly with these resources
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={link.href}>
                  <div className="bg-gray-50 rounded-xl p-6 hover:bg-[#002f34] hover:text-white transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-white group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <link.icon className="w-6 h-6 text-[#002f34] group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{link.title}</h3>
                    <p className="text-gray-600 group-hover:text-white/80 text-sm">
                      {link.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Common Issues
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {commonIssues.map((issue, index) => (
                  <motion.div
                    key={issue}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href="/help-center">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-gray-800">{issue}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
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
              Our support team is always here to assist you. Don&apos;t hesitate to
              reach out!
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-[#002f34] hover:bg-gray-100"
              >
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
