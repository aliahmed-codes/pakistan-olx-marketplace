"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  CreditCard,
  MessageCircle,
} from "lucide-react";

const buyerTips = [
  {
    icon: MapPin,
    title: "Meet in Public Places",
    description:
      "Always meet sellers in well-lit, public areas like shopping malls, cafes, or police stations. Avoid meeting at private residences or isolated locations.",
  },
  {
    icon: CheckCircle,
    title: "Inspect Before Paying",
    description:
      "Thoroughly check the item's condition, functionality, and authenticity before making any payment. Don't rush the inspection process.",
  },
  {
    icon: XCircle,
    title: "Avoid Advance Payments",
    description:
      "Never pay in advance or send money before seeing the item. Scammers often ask for deposits or shipping fees for items that don't exist.",
  },
  {
    icon: Phone,
    title: "Verify Contact Information",
    description:
      "Verify the seller's phone number and identity. Be cautious of sellers who refuse to share contact details or communicate only through messaging apps.",
  },
  {
    icon: CreditCard,
    title: "Use Secure Payment Methods",
    description:
      "Prefer cash on delivery or secure payment methods. Avoid wire transfers, cryptocurrency, or gift cards as these are often used by scammers.",
  },
  {
    icon: MessageCircle,
    title: "Keep Communication on Platform",
    description:
      "Keep all communication within our platform's messaging system. This provides a record in case of disputes and helps us assist you better.",
  },
];

const sellerTips = [
  {
    icon: MapPin,
    title: "Choose Safe Meeting Locations",
    description:
      "Meet buyers in public places during daylight hours. Consider meeting at your local police station's safe exchange zone if available.",
  },
  {
    icon: CheckCircle,
    title: "Verify Buyer's Identity",
    description:
      "Ask for identification and verify the buyer's contact information. Be cautious of buyers who seem too eager or want to complete the deal unusually quickly.",
  },
  {
    icon: XCircle,
    title: "Beware of Overpayment Scams",
    description:
      "Watch out for buyers who offer to overpay and ask for a refund of the difference. This is a common scam tactic.",
  },
  {
    icon: CreditCard,
    title: "Accept Secure Payments Only",
    description:
      "Accept cash or verified payment methods. Wait for checks to clear before handing over the item. Be wary of fake payment confirmations.",
  },
  {
    icon: Shield,
    title: "Don't Share Personal Information",
    description:
      "Never share sensitive information like your home address, bank details, or CNIC number with potential buyers.",
  },
  {
    icon: MessageCircle,
    title: "Document Everything",
    description:
      "Keep records of all communications, receipts, and transaction details. Take photos of the item before selling as proof of condition.",
  },
];

const redFlags = [
  "Requests for advance payment or deposits",
  "Prices that seem too good to be true",
  "Sellers/Buyers who refuse to meet in person",
  "Pressure to complete the deal quickly",
  "Requests to communicate outside the platform",
  "Unwillingness to provide contact information",
  "Overpayment offers with refund requests",
  "Shipping requests from international buyers",
];

export default function SafetyTipsPage() {
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
              <span className="text-white text-sm font-medium">Safety</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Safety Tips
            </h1>
            <p className="text-lg text-white/80">
              Your safety is our priority. Follow these guidelines for secure
              transactions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Warning Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4"
          >
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">
                Important Safety Notice
              </h3>
              <p className="text-amber-700">
                While we work hard to keep our platform safe, it&apos;s important to
                stay vigilant. Always follow these safety guidelines when buying or
                selling.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Buyer Tips */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Safety Tips for Buyers
            </h2>
            <p className="text-gray-600">
              Protect yourself when purchasing items from sellers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <tip.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Tips */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Safety Tips for Sellers
            </h2>
            <p className="text-gray-600">
              Protect yourself when selling items to buyers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <tip.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-800">
                  Red Flags to Watch For
                </h2>
              </div>
              <p className="text-red-700 mb-6">
                Be alert for these warning signs that may indicate a potential scam:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {redFlags.map((flag, index) => (
                  <motion.div
                    key={flag}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">{flag}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#002f34] to-[#005f6b] rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Report Suspicious Activity
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              If you encounter any suspicious activity or believe you&apos;ve been
              targeted by a scam, please report it immediately.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:safety@example.com"
                className="bg-white text-[#002f34] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Report to Us
              </a>
              <a
                href="tel:15"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Call Police (15)
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
