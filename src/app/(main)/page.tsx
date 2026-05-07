import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AdCard } from '@/components/ads/AdCard';
import { CategoryCard } from '@/components/ads/CategoryCard';
import {
  Search,
  Plus,
  Shield,
  MessageCircle,
  Tag,
  MapPin,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

// ─── Data Fetchers ────────────────────────────────────────────────────────────

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

async function getFeaturedAds() {
  const ads = await prisma.ad.findMany({
    where: {
      isApproved: true,
      isFeatured: true,
      featuredUntil: { gt: new Date() },
    },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { featuredUntil: 'desc' },
    take: 8,
  });
  // Serialize Decimal → number so it can be passed to Client Components
  return ads.map((ad) => ({
    ...ad,
    price: Number(ad.price),
    commissionAmount: ad.commissionAmount ? Number(ad.commissionAmount) : null,
  }));
}

async function getLatestAds() {
  const ads = await prisma.ad.findMany({
    where: { isApproved: true },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  // Serialize Decimal → number so it can be passed to Client Components
  return ads.map((ad) => ({
    ...ad,
    price: Number(ad.price),
    commissionAmount: ad.commissionAmount ? Number(ad.commissionAmount) : null,
  }));
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

const quickCategories = [
  { label: 'Mobiles', slug: 'mobiles' },
  { label: 'Cars', slug: 'cars' },
  { label: 'Property', slug: 'property' },
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Bikes', slug: 'bikes' },
  { label: 'Jobs', slug: 'jobs' },
  { label: 'Furniture', slug: 'furniture' },
  { label: 'Fashion', slug: 'fashion' },
];

function HeroSection() {
  return (
    <section className="relative bg-olx overflow-hidden py-20 md:py-28">
      {/* Animated grid background via inline style + CSS */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(35,229,219,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(35,229,219,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow top-right */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-olx-accent/10 blur-3xl" />
      {/* Radial glow bottom-left */}
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[360px] w-[360px] rounded-full bg-olx-yellow/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Pill badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-olx-accent/30 bg-olx-accent/10 px-4 py-1.5 text-sm text-olx-accent animate-fade-in">
            <Star className="h-3.5 w-3.5 fill-olx-accent" />
            Pakistan&apos;s #1 Classified Marketplace
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight animate-slide-in">
            Buy &amp; Sell
            <span className="text-olx-accent"> Anything </span>
            in Pakistan
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl mx-auto animate-fade-in">
            Millions of ads. Trusted sellers. Zero listing fees. Find great
            deals on mobiles, cars, property, electronics &amp; more.
          </p>

          {/* Search Bar with city dropdown */}
          <form
            action="/search"
            className="relative mb-6 flex items-center overflow-hidden rounded-full bg-white shadow-2xl shadow-black/30 animate-slide-in"
          >
            {/* City selector */}
            <div className="flex shrink-0 items-center border-r border-gray-200">
              <select
                name="city"
                defaultValue=""
                className="h-14 appearance-none bg-transparent pl-4 pr-8 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="">All Cities</option>
                <option>Karachi</option>
                <option>Lahore</option>
                <option>Islamabad</option>
                <option>Rawalpindi</option>
                <option>Faisalabad</option>
                <option>Peshawar</option>
                <option>Quetta</option>
                <option>Multan</option>
                <option>Hyderabad</option>
                <option>Sialkot</option>
                <option>Gujranwala</option>
                <option>Sargodha</option>
              </select>
            </div>

            {/* Search input */}
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="What are you looking for?"
                className="h-14 w-full pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="m-1.5 shrink-0 rounded-full bg-olx-accent px-6 py-2.5 text-sm font-semibold text-olx transition-all hover:brightness-110 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in">
            {quickCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/search?category=${cat.slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm transition-all hover:bg-olx-accent hover:text-olx hover:border-olx-accent font-medium"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Post Ad CTA */}
          <Link href="/post-ad">
            <Button
              size="lg"
              className="bg-olx-yellow text-olx hover:bg-olx-yellow/90 gap-2 rounded-full px-8 font-bold shadow-lg shadow-olx-yellow/20 transition-all hover:scale-105 active:scale-100"
            >
              <Plus className="h-5 w-5" />
              Post Your Ad Free
            </Button>
          </Link>

          {/* Trust Stats inside hero */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-10">
            {[
              { icon: TrendingUp, value: '10M+', label: 'Ads Posted' },
              { icon: Users, value: '5M+', label: 'Happy Users' },
              { icon: MapPin, value: '500+', label: 'Cities Covered' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-olx-accent/15">
                  <Icon className="h-5 w-5 text-olx-accent" />
                </div>
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

// ─── Browse by City ───────────────────────────────────────────────────────────

const majorCities = [
  { name: 'Karachi', emoji: '🌊', desc: 'City of Lights' },
  { name: 'Lahore', emoji: '🏰', desc: 'Heart of Pakistan' },
  { name: 'Islamabad', emoji: '🌿', desc: 'Capital City' },
  { name: 'Rawalpindi', emoji: '🏙️', desc: 'Twin City' },
  { name: 'Faisalabad', emoji: '🏭', desc: 'Manchester of Pakistan' },
  { name: 'Peshawar', emoji: '🕌', desc: 'City of Flowers' },
  { name: 'Quetta', emoji: '🏔️', desc: 'Fruit Garden of Pakistan' },
  { name: 'Multan', emoji: '☀️', desc: 'City of Saints' },
];

function BrowseByCitySection() {
  return (
    <section className="py-14 bg-gray-50/60">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-olx-accent mb-1">
              Explore Locally
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Browse by City</h2>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1 text-sm font-medium text-olx hover:text-olx-accent transition-colors"
          >
            All Cities <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {majorCities.map((city) => (
            <Link
              key={city.name}
              href={`/search?city=${city.name}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:border-olx-accent/50 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-3xl">{city.emoji}</span>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-olx">
                {city.name}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">
                {city.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why PakistanMarket? ──────────────────────────────────────────────────────

function WhyUsSection() {
  const features = [
    {
      icon: Tag,
      title: 'Free to Post',
      desc: 'List unlimited ads at zero cost. No hidden charges, no subscriptions.',
      color: 'bg-olx-accent/10',
      iconColor: 'text-olx-accent',
      borderColor: 'border-olx-accent/20',
    },
    {
      icon: Shield,
      title: 'Verified Sellers',
      desc: 'Every seller goes through our verification process so you can buy with confidence.',
      color: 'bg-olx-yellow/10',
      iconColor: 'text-olx-yellow',
      borderColor: 'border-olx-yellow/20',
    },
    {
      icon: MessageCircle,
      title: 'Secure Chat',
      desc: 'Chat directly with buyers and sellers inside our encrypted messaging system.',
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-100',
    },
  ];

  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-olx-accent mb-1">
            Our Promise
          </p>
          <h2 className="text-2xl font-bold text-gray-900">Why PakistanMarket?</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, color, iconColor, borderColor }) => (
            <div
              key={title}
              className={`rounded-2xl border ${borderColor} ${color} p-8 flex flex-col items-center text-center gap-4 transition-shadow hover:shadow-lg`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm`}>
                <Icon className={`h-7 w-7 ${iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Categories Section ───────────────────────────────────────────────────────

async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-olx-accent mb-1">
              What are you looking for?
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          </div>
        </div>
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

// ─── Featured Ads Section ─────────────────────────────────────────────────────

async function FeaturedAdsSection() {
  const ads = await getFeaturedAds();
  if (ads.length === 0) return null;

  return (
    <section className="py-14 bg-gradient-to-b from-olx-yellow/8 via-olx-yellow/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-olx-yellow mb-1">
              Promoted Listings
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Featured Ads</h2>
          </div>
          <Link
            href="/search?featured=true"
            className="flex items-center gap-1 text-sm font-medium text-olx hover:text-olx-accent transition-colors"
          >
            View All <ChevronRight className="h-4 w-4" />
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

// ─── Latest Ads Section ───────────────────────────────────────────────────────

async function LatestAdsSection() {
  const ads = await getLatestAds();

  return (
    <section className="py-14 bg-gray-50/60">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-olx-accent mb-1">
              Just Added
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Latest Ads</h2>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1 text-sm font-medium text-olx hover:text-olx-accent transition-colors"
          >
            View All <ChevronRight className="h-4 w-4" />
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

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SectionSkeleton() {
  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Download App Section ─────────────────────────────────────────────────────

function DownloadAppSection() {
  return (
    <section className="py-16 bg-olx-light overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 rounded-3xl bg-olx p-10 md:p-14 overflow-hidden">
          {/* Grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(35,229,219,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(35,229,219,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-olx-accent/10 blur-3xl" />

          {/* Text */}
          <div className="relative z-10 flex-1 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-olx-accent mb-2">
              Available Now
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Get the PakistanMarket<br className="hidden md:block" /> App
            </h2>
            <p className="text-gray-300 mb-8 max-w-sm mx-auto md:mx-0">
              Buy, sell, and chat on the go. Download our app and never miss a
              great deal — available for iOS &amp; Android.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase">Download on the</p>
                  <p className="text-sm font-bold text-white">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <span className="text-2xl">▶️</span>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase">Get it on</p>
                  <p className="text-sm font-bold text-white">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-olx-accent/20 blur-2xl scale-110" />
              <div className="relative flex flex-col items-center justify-center h-[280px] w-[140px] rounded-[2.5rem] border-4 border-white/20 bg-olx-light shadow-2xl overflow-hidden">
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-black/30 flex items-center justify-center">
                  <div className="h-1.5 w-16 rounded-full bg-white/20" />
                </div>
                <span className="text-6xl">📱</span>
                <p className="mt-3 text-xs font-bold text-olx-accent">PakistanMarket</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Ready to Sell CTA ────────────────────────────────────────────────────────

function ReadyToSellSection() {
  return (
    <section className="relative py-20 bg-olx overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(35,229,219,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glows */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-olx-accent/10 blur-3xl" />

      <div className="container relative mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-olx-yellow/30 bg-olx-yellow/10 px-4 py-1.5 text-sm text-olx-yellow mb-6">
          <Star className="h-3.5 w-3.5 fill-olx-yellow" />
          Start Selling Today — It&apos;s Free!
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          Ready to Sell Something?
        </h2>
        <p className="text-gray-300 mb-10 max-w-lg mx-auto text-base">
          Post your ad for free and reach millions of potential buyers across
          every city in Pakistan. No fees. No fuss.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/post-ad">
            <Button
              size="lg"
              className="bg-olx-yellow text-olx hover:bg-olx-yellow/90 gap-2 rounded-full px-10 font-bold shadow-xl shadow-olx-yellow/20 transition-all hover:scale-105 active:scale-100"
            >
              <Plus className="h-5 w-5" />
              Post Your Ad Now
            </Button>
          </Link>
          <Link href="/search">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 text-white hover:bg-white/10 px-8 gap-2"
            >
              <Search className="h-4 w-4" />
              Browse Ads
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />

        <BrowseByCitySection />

        <Suspense fallback={<SectionSkeleton />}>
          <CategoriesSection />
        </Suspense>

        <WhyUsSection />

        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedAdsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <LatestAdsSection />
        </Suspense>

        <DownloadAppSection />

        <ReadyToSellSection />
      </main>
      <Footer />
    </>
  );
}
