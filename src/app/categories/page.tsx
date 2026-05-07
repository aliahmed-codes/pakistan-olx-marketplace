import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, Tag, Layers } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'All Categories | Pakistan Market',
  description: 'Browse all categories on Pakistan Market — mobiles, cars, property, electronics and more.',
};

// ── Category visual config ─────────────────────────────────────────────────────
// Each entry maps to a curated gradient + icon + accent color used on the card
interface CategoryTheme {
  gradient: string;       // Tailwind gradient classes for card background
  iconBg: string;         // Icon container background
  accent: string;         // Accent color for text badge
  badgeBg: string;        // Pill badge background
  icon: string;           // SVG path (single path element)
}

const THEMES: CategoryTheme[] = [
  { gradient: 'from-blue-600 to-blue-800',    iconBg: 'bg-white/20', accent: 'text-blue-100',  badgeBg: 'bg-white/15', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { gradient: 'from-emerald-500 to-teal-700', iconBg: 'bg-white/20', accent: 'text-emerald-100', badgeBg: 'bg-white/15', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l3-1 2 2 2-2 3 1zM8 6v2M6 9h4M6 12h4' },
  { gradient: 'from-orange-500 to-red-600',   iconBg: 'bg-white/20', accent: 'text-orange-100', badgeBg: 'bg-white/15', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { gradient: 'from-purple-600 to-violet-800', iconBg: 'bg-white/20', accent: 'text-purple-100', badgeBg: 'bg-white/15', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { gradient: 'from-cyan-500 to-sky-700',     iconBg: 'bg-white/20', accent: 'text-cyan-100',   badgeBg: 'bg-white/15', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2' },
  { gradient: 'from-rose-500 to-pink-700',    iconBg: 'bg-white/20', accent: 'text-rose-100',   badgeBg: 'bg-white/15', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { gradient: 'from-indigo-500 to-blue-700',  iconBg: 'bg-white/20', accent: 'text-indigo-100', badgeBg: 'bg-white/15', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { gradient: 'from-amber-500 to-yellow-700', iconBg: 'bg-white/20', accent: 'text-amber-100',  badgeBg: 'bg-white/15', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { gradient: 'from-teal-500 to-emerald-700', iconBg: 'bg-white/20', accent: 'text-teal-100',   badgeBg: 'bg-white/15', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { gradient: 'from-red-500 to-rose-700',     iconBg: 'bg-white/20', accent: 'text-red-100',    badgeBg: 'bg-white/15', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { gradient: 'from-lime-500 to-green-700',   iconBg: 'bg-white/20', accent: 'text-lime-100',   badgeBg: 'bg-white/15', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
  { gradient: 'from-pink-500 to-fuchsia-700', iconBg: 'bg-white/20', accent: 'text-pink-100',   badgeBg: 'bg-white/15', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { gradient: 'from-violet-500 to-purple-700', iconBg: 'bg-white/20', accent: 'text-violet-100', badgeBg: 'bg-white/15', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { gradient: 'from-sky-500 to-blue-700',     iconBg: 'bg-white/20', accent: 'text-sky-100',    badgeBg: 'bg-white/15', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

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
      <main className="min-h-screen bg-[#f5f6fa]">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-pm via-pm to-pm-light text-white relative overflow-hidden">
          {/* Decorative grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(35,229,219,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(35,229,219,0.8) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pm-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-pm-yellow/10 blur-3xl" />

          <div className="container relative mx-auto px-4 py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-6">
              <Layers className="h-4 w-4 text-pm-accent" />
              <span className="text-sm font-medium text-pm-accent">All Categories</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight max-w-2xl">
              Find What You&apos;re<br />
              <span className="text-pm-accent">Looking For</span>
            </h1>
            <p className="text-white/70 text-lg max-w-lg">
              {categories.length} categories · thousands of ads · all across Pakistan
            </p>
          </div>
        </div>

        {/* ── Category Grid ─────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((category, idx) => {
              const theme = THEMES[idx % THEMES.length];
              const hasAds = category._count.ads > 0;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/60">

                    {/* ── Gradient header ──────────────────────────── */}
                    <div className={`bg-gradient-to-br ${theme.gradient} px-6 pt-7 pb-5 relative overflow-hidden`}>
                      {/* Decorative circles */}
                      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                      <div className="absolute -right-2 top-8 h-12 w-12 rounded-full bg-white/10" />

                      {/* Icon box */}
                      <div className={`${theme.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-white/20 shadow-inner`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={theme.icon} />
                        </svg>
                      </div>

                      {/* Category name */}
                      <h3 className="text-lg font-bold text-white leading-snug pr-8">
                        {category.name}
                      </h3>

                      {/* Ad count pill */}
                      {hasAds && (
                        <div className={`${theme.badgeBg} border border-white/20 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full mt-2`}>
                          <Tag className={`h-3 w-3 ${theme.accent}`} />
                          <span className={`text-xs font-semibold ${theme.accent}`}>
                            {category._count.ads.toLocaleString()} ads
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── White body ───────────────────────────────── */}
                    <div className="bg-white px-6 py-4">
                      {category.description ? (
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3">
                          {category.description}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm mb-3">
                          Browse {category._count.subCategories} subcategories
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <Layers className="h-3 w-3" />
                            {category._count.subCategories} subcategories
                          </span>
                        </div>
                        <div className={`bg-gradient-to-br ${theme.gradient} w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-md`}>
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 pb-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-pm via-pm to-pm-light rounded-3xl p-10 md:p-16 text-center">
            {/* Pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(35,229,219,1) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-pm-accent/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-pm-yellow/20 border border-pm-yellow/30 px-4 py-1.5 mb-6">
                <span className="text-pm-yellow text-sm font-semibold">100% Free to List</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                Have Something to Sell?
              </h2>
              <p className="text-white/70 mb-8 text-lg max-w-md mx-auto">
                Post your ad in minutes and reach millions of buyers across Pakistan — at zero cost.
              </p>
              <Link href="/post-ad">
                <span className="inline-flex items-center gap-2 bg-pm-yellow text-pm font-bold px-10 py-4 rounded-full hover:bg-pm-yellow/90 transition-all shadow-xl shadow-black/20 text-base hover:scale-105 active:scale-100">
                  Post Free Ad <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
