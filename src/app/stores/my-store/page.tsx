"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  Package,
  Eye,
  MessageCircle,
  Edit,
  Settings,
  Plus,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - in production this would come from API
const storeData = {
  id: "1",
  name: "TechWorld Pakistan",
  slug: "techworld-pakistan",
  description: "Your one-stop shop for all electronics and gadgets",
  city: "Lahore",
  isVerified: true,
  logo: "https://api.dicebear.com/7.x/initials/svg?seed=TW&backgroundColor=002f34",
  createdAt: "2023-01-15",
  stats: {
    totalAds: 156,
    activeAds: 142,
    totalViews: 45678,
    totalInquiries: 892,
    viewsThisMonth: 5234,
    inquiriesThisMonth: 127,
  },
};

const recentAds = [
  {
    id: "1",
    title: "iPhone 14 Pro Max 256GB",
    price: 350000,
    views: 1234,
    inquiries: 23,
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    title: "MacBook Pro M2 14-inch",
    price: 450000,
    views: 892,
    inquiries: 15,
    status: "active",
    createdAt: "2025-01-14",
  },
  {
    id: "3",
    title: "Samsung Galaxy S23 Ultra",
    price: 280000,
    views: 567,
    inquiries: 8,
    status: "active",
    createdAt: "2025-01-12",
  },
];

export default function MyStorePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#002f34] to-[#005f6b] py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-white">
                <img
                  src={storeData.logo}
                  alt={storeData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {storeData.name}
                </h1>
                <p className="text-white/80">
                  {storeData.city} • {storeData.isVerified ? "Verified" : "Pending Verification"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/stores/${storeData.slug}`}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Eye className="w-4 h-4 mr-2" />
                  View Store
                </Button>
              </Link>
              <Link href="/stores/my-store/edit">
                <Button className="bg-white text-[#002f34] hover:bg-gray-100">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Store
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-500 text-sm">Total Ads</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {storeData.stats.totalAds}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-500 text-sm">Total Views</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {storeData.stats.totalViews.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-500 text-sm">Inquiries</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {storeData.stats.totalInquiries}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-500 text-sm">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {storeData.stats.viewsThisMonth.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">views</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Ads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Ads</h2>
                <Link href="/my-ads">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{ad.title}</h3>
                      <p className="text-[#002f34] font-semibold">
                        Rs. {ad.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {ad.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {ad.inquiries} inquiries
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/edit-ad/${ad.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link href="/post-ad">
                  <Button className="w-full bg-[#002f34] hover:bg-[#002f34]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Ad
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Performance Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Performance Overview
              </h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Performance chart coming soon</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/post-ad">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Ad
                  </Button>
                </Link>
                <Link href="/stores/my-store/edit">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Store Info
                  </Button>
                </Link>
                <Link href="/stores/my-store/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Store Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Store Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification</span>
                  <span className="text-blue-600 font-medium">Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">
                    {new Date(storeData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900">{storeData.city}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-[#002f34] to-[#005f6b] rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Pro Tips</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Post high-quality photos</li>
                <li>• Write detailed descriptions</li>
                <li>• Respond quickly to inquiries</li>
                <li>• Keep your prices competitive</li>
                <li>• Update your ads regularly</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
