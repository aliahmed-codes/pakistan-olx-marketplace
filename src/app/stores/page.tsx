"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  Search,
  MapPin,
  Star,
  ChevronRight,
  Plus,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cities } from "@/lib/cities-areas";

const featuredStores = [
  {
    id: "1",
    name: "TechWorld Pakistan",
    slug: "techworld-pakistan",
    description: "Your one-stop shop for all electronics and gadgets",
    city: "Lahore",
    isVerified: true,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TW&backgroundColor=002f34",
    adCount: 156,
  },
  {
    id: "2",
    name: "AutoHub Motors",
    slug: "autohub-motors",
    description: "Premium cars and automotive services",
    city: "Karachi",
    isVerified: true,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=AH&backgroundColor=dc2626",
    adCount: 89,
  },
  {
    id: "3",
    name: "Home Comfort Furniture",
    slug: "home-comfort-furniture",
    description: "Quality furniture for your home and office",
    city: "Islamabad",
    isVerified: false,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=HC&backgroundColor=16a34a",
    adCount: 234,
  },
  {
    id: "4",
    name: "Fashion Forward",
    slug: "fashion-forward",
    description: "Latest fashion trends at affordable prices",
    city: "Lahore",
    isVerified: true,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=FF&backgroundColor=9333ea",
    adCount: 312,
  },
];

export default function StoresPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

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
              <Store className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Stores</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Stores
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Find trusted sellers and businesses on our platform
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stores..."
                  className="pl-12 pr-4 py-6 bg-white border-0 text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 rounded-lg bg-white text-gray-900 border-0"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Create Store CTA */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Have a business?
              </h2>
              <p className="text-gray-600">
                Create your own store and reach thousands of customers
              </p>
            </div>
            <Link href="/stores/create">
              <Button className="bg-[#002f34] hover:bg-[#002f34]/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Store
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Featured Stores
            </h2>
            <p className="text-gray-600">
              Discover top-rated sellers on our platform
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/stores/${store.slug}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-[#002f34] to-[#005f6b]" />
                    <div className="px-6 pb-6">
                      <div className="relative -mt-12 mb-4">
                        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {store.name}
                        </h3>
                        {store.isVerified && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {store.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {store.city}
                        </div>
                        <div className="text-gray-500">
                          {store.adCount} ads
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse by City
            </h2>
            <p className="text-gray-600">Find stores in your area</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cities.slice(0, 12).map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/stores?city=${city.name}`}>
                  <div className="bg-gray-50 hover:bg-[#002f34] hover:text-white rounded-lg p-4 text-center transition-all cursor-pointer">
                    <MapPin className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{city.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Create a Store?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of businesses already selling on our platform
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Store,
                title: "Professional Profile",
                description:
                  "Create a branded store page with your logo and business information",
              },
              {
                icon: Star,
                title: "Build Trust",
                description:
                  "Verified stores get more views and higher conversion rates",
              },
              {
                icon: MapPin,
                title: "Local Visibility",
                description:
                  "Reach customers in your city looking for your products",
              },
              {
                icon: CheckCircle,
                title: "Easy Management",
                description:
                  "Manage all your ads from one centralized dashboard",
              },
            ].map((benefit, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
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
            className="bg-gradient-to-r from-[#002f34] to-[#005f6b] rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Selling Today
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Create your store and reach thousands of potential customers
            </p>
            <Link href="/stores/create">
              <Button
                size="lg"
                className="bg-white text-[#002f34] hover:bg-gray-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your Store
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
