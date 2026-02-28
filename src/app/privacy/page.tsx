"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Lock, Eye, Database, Share2 } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: [
      "Personal information: name, email, phone number, and address.",
      "Account information: username, password, and profile details.",
      "Transaction information: ads posted, messages sent, and purchases made.",
      "Device information: IP address, browser type, and operating system.",
      "Usage data: pages visited, time spent, and interactions with our platform.",
    ],
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      "To provide and maintain our services.",
      "To process transactions and send related information.",
      "To communicate with you about updates, promotions, and support.",
      "To improve our platform and develop new features.",
      "To detect and prevent fraud and abuse.",
      "To comply with legal obligations.",
    ],
  },
  {
    icon: Share2,
    title: "3. Information Sharing",
    content: [
      "We do not sell your personal information to third parties.",
      "We may share information with service providers who assist our operations.",
      "We may disclose information if required by law or to protect our rights.",
      "With your consent, we may share information with business partners.",
    ],
  },
  {
    icon: Lock,
    title: "4. Data Security",
    content: [
      "We implement industry-standard security measures to protect your data.",
      "All data is encrypted in transit and at rest.",
      "We regularly review and update our security practices.",
      "Despite our efforts, no security system is completely impenetrable.",
    ],
  },
  {
    icon: Shield,
    title: "5. Your Rights",
    content: [
      "You have the right to access your personal information.",
      "You can request correction of inaccurate information.",
      "You may request deletion of your data (subject to legal requirements).",
      "You can opt out of marketing communications at any time.",
      "You have the right to data portability.",
    ],
  },
];

export default function PrivacyPage() {
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
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/80">
              Last updated: January 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-8 mb-8"
            >
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when you
                use our platform. Please read this privacy policy carefully. By
                using our platform, you consent to the practices described in this
                policy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#002f34]/10 rounded-full flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-[#002f34]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#002f34] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#002f34] to-[#005f6b] rounded-xl p-8 text-white"
            >
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-white/80 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <ul className="space-y-2 text-white/80">
                <li>Email: privacy@example.com</li>
                <li>Address: 123 Main Boulevard, Gulberg III, Lahore, Pakistan</li>
                <li>Phone: +92 300 1234567</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
