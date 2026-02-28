'use client';

import Link from 'next/link';
import {
  Smartphone,
  Car,
  Bike,
  Home,
  Monitor,
  Sofa,
  Briefcase,
  Wrench,
  Heart,
  Dog,
  BookOpen,
  Shirt,
  Baby,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Car,
  Bike,
  Home,
  Monitor,
  Sofa,
  Briefcase,
  Wrench,
  Heart,
  Dog,
  BookOpen,
  Shirt,
  Baby,
};

const categoryColors: Record<string, string> = {
  mobiles: 'bg-blue-500',
  vehicles: 'bg-green-500',
  bikes: 'bg-orange-500',
  property: 'bg-purple-500',
  electronics: 'bg-cyan-500',
  'home-living': 'bg-pink-500',
  'business-industrial': 'bg-indigo-500',
  services: 'bg-teal-500',
  jobs: 'bg-red-500',
  animals: 'bg-amber-500',
  'books-sports': 'bg-lime-500',
  fashion: 'bg-rose-500',
  'kids-baby': 'bg-violet-500',
};

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-olx to-olx-light text-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
            <p className="text-white/80 max-w-2xl">
              Explore thousands of ads across various categories. Find exactly what
              you're looking for or post your own ad for free.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Smartphone;
              const bgColor = categoryColors[category.slug] || 'bg-gray-500';

              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100">
                    <div className={`${bgColor} h-24 flex items-center justify-center`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-olx transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {category.subCategories.length} subcategories
                        </span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-olx group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-olx to-olx-light rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Want to Sell Something?</h2>
              <p className="text-white/80 mb-6">
                Post your ad for free and reach thousands of potential buyers
              </p>
              <Link href="/post-ad">
                <Button className="bg-white text-olx hover:bg-gray-100">
                  Post Free Ad
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
