"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bike, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/categories";

export default function BikesCategoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const category = categories.find((c) => c.slug === "bikes");
  const subCategories = category?.subCategories || [];

  const popularBrands = [
    { name: "Honda", count: "15,234" },
    { name: "Yamaha", count: "8,901" },
    { name: "Suzuki", count: "7,654" },
    { name: "United", count: "5,432" },
    { name: "Super Power", count: "4,321" },
    { name: "Road Prince", count: "3,210" },
    { name: "Unique", count: "2,876" },
    { name: "Benelli", count: "1,543" },
  ];

  const priceRanges = [
    { label: "Under Rs. 30,000", min: 0, max: 30000 },
    { label: "Rs. 30,000 - 60,000", min: 30000, max: 60000 },
    { label: "Rs. 60,000 - 100,000", min: 60000, max: 100000 },
    { label: "Rs. 100,000 - 200,000", min: 100000, max: 200000 },
    { label: "Rs. 200,000 - 400,000", min: 200000, max: 400000 },
    { label: "Above Rs. 400,000", min: 400000, max: 999999999 },
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
            <span className="text-gray-900 font-medium">Bikes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                <Bike className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">Bikes</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Buy & Sell Bikes
              </h1>
              <p className="text-lg text-white/80 mb-6 max-w-xl">
                Find motorcycles, scooters, and bicycles. From daily commuters to
                sports bikes, discover your perfect ride.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/search?category=bikes">
                  <Button
                    size="lg"
                    className="bg-white text-orange-700 hover:bg-gray-100"
                  >
                    Browse All Bikes
                  </Button>
                </Link>
                <Link href="/post-ad?category=bikes">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Sell Your Bike
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
                  <Bike className="w-32 h-32 text-white" />
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
              Bike Types
            </h2>
            <p className="text-gray-600">
              Browse by bike type to find exactly what you need
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
                  href={`/search?category=bikes&subcategory=${sub.slug}`}
                >
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-orange-300">
                    <Bike className="w-8 h-8 mx-auto mb-2 text-orange-600" />
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

      {/* Popular Brands */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Popular Brands
            </h2>
            <p className="text-gray-600">
              Find bikes from your favorite manufacturers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/search?category=bikes&q=${brand.name}`}>
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-orange-50 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                    <p className="text-sm text-gray-500">{brand.count} ads</p>
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
            <p className="text-gray-600">Find bikes within your budget</p>
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
                  href={`/search?category=bikes&minPrice=${range.min}&maxPrice=${range.max}`}
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
            className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Sell Your Bike
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Post your ad for free and reach thousands of potential buyers
            </p>
            <Link href="/post-ad?category=bikes">
              <Button
                size="lg"
                className="bg-white text-orange-700 hover:bg-gray-100 font-semibold"
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
