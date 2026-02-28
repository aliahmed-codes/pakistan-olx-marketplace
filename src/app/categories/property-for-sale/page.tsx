"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/categories";

export default function PropertyForSalePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const category = categories.find((c) => c.slug === "property-for-sale");
  const subCategories = category?.subCategories || [];

  const popularCities = [
    { name: "Karachi", count: "45,234" },
    { name: "Lahore", count: "38,901" },
    { name: "Islamabad", count: "15,678" },
    { name: "Rawalpindi", count: "12,234" },
    { name: "Faisalabad", count: "5,432" },
    { name: "Multan", count: "4,321" },
    { name: "Peshawar", count: "3,210" },
    { name: "Quetta", count: "2,109" },
  ];

  const priceRanges = [
    { label: "Under Rs. 1,000,000", min: 0, max: 1000000 },
    { label: "Rs. 1,000,000 - 5,000,000", min: 1000000, max: 5000000 },
    { label: "Rs. 5,000,000 - 10,000,000", min: 5000000, max: 10000000 },
    { label: "Rs. 10,000,000 - 20,000,000", min: 10000000, max: 20000000 },
    { label: "Rs. 20,000,000 - 50,000,000", min: 20000000, max: 50000000 },
    { label: "Above Rs. 50,000,000", min: 50000000, max: 999999999999 },
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
            <span className="text-gray-900 font-medium">Property for Sale</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                <Home className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">Property</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Property for Sale
              </h1>
              <p className="text-lg text-white/80 mb-6 max-w-xl">
                Find your dream property. From apartments to houses, plots to
                commercial spaces, discover the perfect investment.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/search?category=property-for-sale">
                  <Button
                    size="lg"
                    className="bg-white text-green-700 hover:bg-gray-100"
                  >
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/post-ad?category=property-for-sale">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Sell Property
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
                  <Home className="w-32 h-32 text-white" />
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
              Property Types
            </h2>
            <p className="text-gray-600">
              Browse by property type to find exactly what you need
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
                  href={`/search?category=property-for-sale&subcategory=${sub.slug}`}
                >
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-green-300">
                    <Home className="w-8 h-8 mx-auto mb-2 text-green-600" />
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

      {/* Popular Cities */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Popular Cities
            </h2>
            <p className="text-gray-600">
              Find properties in major cities across Pakistan
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularCities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/search?category=property-for-sale&city=${city.name}`}>
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-green-50 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-gray-900">{city.name}</h3>
                    <p className="text-sm text-gray-500">{city.count} ads</p>
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
            <p className="text-gray-600">Find properties within your budget</p>
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
                  href={`/search?category=property-for-sale&minPrice=${range.min}&maxPrice=${range.max}`}
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
            className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Sell Your Property
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Post your property for free and reach thousands of potential buyers
            </p>
            <Link href="/post-ad?category=property-for-sale">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 font-semibold"
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
