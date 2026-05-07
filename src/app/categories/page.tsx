import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'All Categories | Pakistan Market',
  description: 'Browse all categories on Pakistan Market — mobiles, cars, property, electronics and more.',
};

// Color palette for category cards — cycles by index
const CARD_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-cyan-600',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500',
  'bg-amber-500',
  'bg-lime-600',
  'bg-pink-500',
  'bg-violet-500',
  'bg-emerald-500',
];

// Simple emoji/icon map by keyword in the category name
function getCategoryEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('mobile') || n.includes('phone')) return '📱';
  if (n.includes('car') || n.includes('vehicle') || n.includes('auto')) return '🚗';
  if (n.includes('bike') || n.includes('motorbike')) return '🏍️';
  if (n.includes('property') || n.includes('house') || n.includes('real estate')) return '🏠';
  if (n.includes('electronic') || n.includes('tv') || n.includes('appliance')) return '📺';
  if (n.includes('furniture') || n.includes('sofa') || n.includes('home')) return '🛋️';
  if (n.includes('job') || n.includes('career')) return '💼';
  if (n.includes('service')) return '🔧';
  if (n.includes('animal') || n.includes('pet')) return '🐾';
  if (n.includes('book') || n.includes('sport')) return '📚';
  if (n.includes('fashion') || n.includes('cloth')) return '👗';
  if (n.includes('kid') || n.includes('baby') || n.includes('child')) return '🍼';
  if (n.includes('food') || n.includes('restaurant')) return '🍔';
  return '📦';
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          subCategories: true,
          ads: { where: { isApproved: true } },
        },
      },
    },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-pm to-pm-light text-white">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-4 border border-white/20">
                <span className="text-pm-accent text-sm font-medium">Browse All Categories</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Find What You&apos;re Looking For</h1>
              <p className="text-white/75 text-lg max-w-xl">
                Explore {categories.length} categories with thousands of ads across Pakistan. Buy, sell, and discover amazing deals.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, idx) => {
              const bgColor = CARD_COLORS[idx % CARD_COLORS.length];
              const emoji = getCategoryEmoji(category.name);
              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 hover:-translate-y-1">
                    {/* Colored icon area */}
                    <div className={`${bgColor} h-28 flex flex-col items-center justify-center gap-1 relative overflow-hidden`}>
                      {/* Subtle shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      <span className="text-5xl drop-shadow-sm">{emoji}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-pm transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{category.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          {category._count.ads > 0 && (
                            <span className="text-xs font-semibold text-pm">{category._count.ads.toLocaleString()} ads</span>
                          )}
                          <span className="text-xs text-gray-400">{category._count.subCategories} subcategories</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-pm group-hover:text-white transition-all flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-pm to-pm-light rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-3">Want to Sell Something?</h2>
            <p className="text-white/75 mb-8 text-lg max-w-lg mx-auto">
              Post your ad for free and reach millions of potential buyers across Pakistan.
            </p>
            <Link href="/post-ad">
              <span className="inline-flex items-center gap-2 bg-pm-yellow text-pm font-bold px-8 py-3 rounded-full hover:bg-pm-yellow/90 transition-colors shadow-lg shadow-pm-yellow/20">
                Post Free Ad <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
