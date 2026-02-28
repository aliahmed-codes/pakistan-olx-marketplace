"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tv, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/categories";

export default function ElectronicsCategoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const category = categories.find((c) => c.slug === "electronics-home-appliances");
  const subCategories = category?.subCategories || [];

  const popularItems = [
    { name: "LED TVs", count: "8,234" },
    { name: "Laptops", count: "12,456" },
    { name: "Refrigerators", count: "6,789" },
    { name: "Washing Machines", count: "5,432" },
    { name: "ACs", count: "7,123" },
    { name: "Cameras", count: "3,210" },
    { name: "Gaming Consoles", count: "4,567" },
    { name: "Kitchen Appliances", count: "9,876" },
  ];

  const priceRanges = [
    { label: "Under Rs. 5,000", min: 0, max: 5000 },
    { label: "Rs. 5,000 - 15,000", min: 5000, max: 15000 },
    { label: "Rs. 15,000 - 40,000", min: 15000, max: 40000 },
    { label: "Rs. 40,000 - 80,000", min: 40000, max: 80000 },
    { label: "Rs. 80,000 - 150,000", min: 80000, max: 150000 },
    { label: "Above Rs. 150,000", min: 150000, max: 999999999 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#002f34]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-[#002f34]">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Electronics</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                <Tv className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">Electronics</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Electronics & Appliances
              </h1>
              <p className="text-lg text-white/80 mb-6 max-w-xl">
                Find the latest electronics and home appliances. From TVs to
                laptops, refrigerators to washing machines.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/search?category=electronics-home-appliances">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-gray-100"
                  >
                    Browse Electronics
                  </Button>
                </Link>
                <Link href="/post-ad?category=electronics-home-appliances">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Sell Electronics
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center">
                  <Tv className="w-32 h-32 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Electronics Categories
            </h2>
            <p className="text-gray-600">
              Browse by category to find exactly what you need
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subCategories.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/search?category=electronics-home-appliances&subcategory=${sub.slug}`}
                >
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-purple-300">
                    <Tv className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <span className="text-sm font-medium text-gray-800">
                      {sub.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Popular Items
            </h2>
            <p className="text-gray-600">
              Discover the most popular electronics and appliances
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/search?category=electronics-home-appliances&q=${item.name}`}>
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-purple-50 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.count} ads</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Ranges */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse by Price
            </h2>
            <p className="text-gray-600">Find items within your budget</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceRanges.map((range, index) => (
              <motion.div
                key={range.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/search?category=electronics-home-appliances&minPrice=${range.min}&maxPrice=${range.max}`}
                >
                  <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100">
                    <span className="font-medium text-gray-800">
                      {range.label}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Sell Your Electronics
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Post your ad for free and reach thousands of potential buyers
            </p>
            <Link href="/post-ad?category=electronics-home-appliances">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100 font-semibold"
              >
                Post Free Ad
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
