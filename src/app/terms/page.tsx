"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using our platform, you agree to be bound by these Terms of Use.",
      "If you do not agree to these terms, please do not use our services.",
      "We reserve the right to modify these terms at any time without prior notice.",
    ],
  },
  {
    title: "2. User Accounts",
    content: [
      "You must be at least 18 years old to create an account.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate and complete information when creating an account.",
      "You are solely responsible for all activities that occur under your account.",
    ],
  },
  {
    title: "3. Posting Ads",
    content: [
      "All ads must comply with our Posting Rules and Community Guidelines.",
      "You may only post ads for items that you legally own or have the right to sell.",
      "Prohibited items include illegal goods, counterfeit products, and hazardous materials.",
      "We reserve the right to remove any ad that violates our policies.",
    ],
  },
  {
    title: "4. Prohibited Activities",
    content: [
      "Spamming, phishing, or any fraudulent activities are strictly prohibited.",
      "Harassment, hate speech, or discriminatory content will not be tolerated.",
      "Attempting to circumvent our security measures is a violation of these terms.",
      "Using automated systems to access our platform without permission is prohibited.",
    ],
  },
  {
    title: "5. Transactions",
    content: [
      "We are not a party to any transaction between buyers and sellers.",
      "Users are responsible for verifying the authenticity of items and sellers.",
      "We recommend meeting in public places for local transactions.",
      "Any disputes should be resolved directly between the parties involved.",
    ],
  },
  {
    title: "6. Intellectual Property",
    content: [
      "All content on our platform is protected by copyright and other intellectual property laws.",
      "You may not copy, modify, or distribute our content without permission.",
      "By posting content, you grant us a license to use, modify, and display that content.",
      "You retain ownership of any content you submit to our platform.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    content: [
      "We provide our services 'as is' without any warranties.",
      "We are not liable for any damages arising from the use of our platform.",
      "Our liability is limited to the amount paid for our services, if any.",
      "We do not guarantee the accuracy or completeness of any user-generated content.",
    ],
  },
  {
    title: "8. Termination",
    content: [
      "We may terminate or suspend your account at any time for violations of these terms.",
      "You may terminate your account by contacting our support team.",
      "Upon termination, your right to use our services immediately ceases.",
      "Certain provisions of these terms survive termination.",
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      "These terms are governed by the laws of Pakistan.",
      "Any disputes will be resolved in the courts of Lahore, Pakistan.",
      "If any provision is found invalid, the remaining provisions remain in effect.",
    ],
  },
  {
    title: "10. Contact Information",
    content: [
      "For questions about these terms, please contact us at legal@example.com.",
      "Our mailing address is: 123 Main Boulevard, Gulberg III, Lahore, Pakistan.",
    ],
  },
];

export default function TermsPage() {
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
              <FileText className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Use
            </h1>
            <p className="text-lg text-white/80">
              Last updated: January 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-8 md:p-12"
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-8">
                  Welcome to our platform. These Terms of Use govern your access
                  to and use of our website and services. Please read these terms
                  carefully before using our platform.
                </p>

                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#002f34] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}

                <div className="mt-12 pt-8 border-t">
                  <p className="text-gray-600">
                    By using our platform, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms of Use.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
