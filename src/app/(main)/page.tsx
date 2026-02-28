import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AdCard } from '@/components/ads/AdCard';
import { CategoryCard } from '@/components/ads/CategoryCard';
import { Search, Plus } from 'lucide-react';

// Get categories with ad count
async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { ads: { where: { isApproved: true } } },
      },
    },
  });
  return categories;
}

// Get featured ads
async function getFeaturedAds() {
  const ads = await prisma.ad.findMany({
    where: {
      isApproved: true,
      isFeatured: true,
      featuredUntil: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      featuredUntil: 'desc',
    },
    take: 8,
  });
  return ads;
}

// Get latest ads
async function getLatestAds() {
  const ads = await prisma.ad.findMany({
    where: {
      isApproved: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 12,
  });
  return ads;
}

// Categories Section
async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              adCount={category._count.ads}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Ads Section
async function FeaturedAdsSection() {
  const ads = await getFeaturedAds();

  if (ads.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-olx-yellow/10 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Ads</h2>
          <Link href="/search?featured=true">
            <Button variant="link">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Latest Ads Section
async function LatestAdsSection() {
  const ads = await getLatestAds();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Ads</h2>
          <Link href="/search">
            <Button variant="link">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Loading Skeleton
function SectionSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-olx py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Buy & Sell in Pakistan
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Pakistan&apos;s #1 classified marketplace. Find great deals on mobiles, cars,
            property, electronics, and more.
          </p>

          {/* Search Bar */}
          <form action="/search" className="relative max-w-xl mx-auto mb-8">
            <input
              type="text"
              name="search"
              placeholder="What are you looking for?"
              className="w-full h-14 pl-12 pr-4 rounded-full border-0 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-olx-accent/50"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-olx-accent text-olx px-6 py-2 rounded-full font-medium hover:bg-olx-accent/90 transition-colors"
            >
              Search
            </button>
          </form>

          {/* CTA Button */}
          <Link href="/post-ad">
            <Button
              size="lg"
              className="bg-olx-accent text-olx hover:bg-olx-accent/90 gap-2"
            >
              <Plus className="h-5 w-5" />
              Post Your Ad
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

// Main Page
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />

        <Suspense fallback={<SectionSkeleton />}>
          <CategoriesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedAdsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <LatestAdsSection />
        </Suspense>

        {/* CTA Section */}
        <section className="py-16 bg-olx">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Sell Something?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Post your ad for free and reach thousands of potential buyers across
              Pakistan.
            </p>
            <Link href="/post-ad">
              <Button
                size="lg"
                className="bg-olx-accent text-olx hover:bg-olx-accent/90 gap-2"
              >
                <Plus className="h-5 w-5" />
                Post Your Ad Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
