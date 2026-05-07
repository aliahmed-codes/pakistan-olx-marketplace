import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, MapPin, Calendar, Eye, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import CategoryFilters from './CategoryFilters';

interface Props {
  params: { slug: string };
  searchParams?: { sub?: string };
}

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
  if (n.includes('kid') || n.includes('baby')) return '🍼';
  return '📦';
}

export async function generateMetadata({ params }: Props) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: 'Category Not Found | Pakistan Market' };
  return {
    title: `${category.name} | Pakistan Market`,
    description: category.description || `Browse ${category.name} ads on Pakistan Market.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const slug = params.slug;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      subCategories: { where: { isActive: true }, orderBy: { name: 'asc' } },
      _count: { select: { ads: { where: { isApproved: true } } } },
    },
  });

  if (!category) notFound();

  // Fetch ads — optionally filtered by sub-category
  const subSlug = searchParams?.sub;
  const subCategory = subSlug
    ? category.subCategories.find((s) => s.slug === subSlug)
    : null;

  const ads = await prisma.ad.findMany({
    where: {
      categoryId: category.id,
      isApproved: true,
      ...(subCategory ? { subCategoryId: subCategory.id } : {}),
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 48,
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  // Serialize Decimal
  const serializedAds = ads.map((ad) => ({
    ...ad,
    price: Number(ad.price),
    createdAt: ad.createdAt.toISOString(),
    updatedAt: ad.updatedAt.toISOString(),
  }));

  const emoji = getCategoryEmoji(category.name);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-pm to-pm-light text-white">
          <div className="container mx-auto px-4 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{category.name}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 text-4xl shrink-0">
                {emoji}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{category.name}</h1>
                {category.description && (
                  <p className="text-white/75 max-w-xl">{category.description}</p>
                )}
                <p className="text-pm-accent text-sm font-medium mt-2">
                  {category._count.ads.toLocaleString()} active ads
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-category filter tabs — client component */}
        {category.subCategories.length > 0 && (
          <div className="bg-white border-b sticky top-[106px] z-30 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <CategoryFilters subCategories={category.subCategories} categorySlug={slug} />
            </div>
          </div>
        )}

        {/* Ads Grid */}
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {subCategory ? subCategory.name : `All ${category.name}`}
              <span className="ml-2 text-base font-normal text-gray-500">
                ({serializedAds.length} results)
              </span>
            </h2>
            <Link
              href={`/post-ad?category=${category.id}`}
              className="inline-flex items-center gap-2 bg-pm text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-pm-light transition-colors"
            >
              Post Ad <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {serializedAds.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">{emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No ads yet in this category</h3>
              <p className="text-gray-500 mb-6">Be the first to post an ad here!</p>
              <Link
                href={`/post-ad?category=${category.id}`}
                className="inline-flex items-center gap-2 bg-pm text-white px-6 py-3 rounded-full font-semibold hover:bg-pm-light transition-colors"
              >
                Post an Ad <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {serializedAds.map((ad) => (
                <Link key={ad.id} href={`/ad/${ad.id}`}>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5">
                    {/* Image */}
                    <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                      {ad.images[0] ? (
                        <Image
                          src={ad.images[0]}
                          alt={ad.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                          {emoji}
                        </div>
                      )}
                      {ad.isFeatured && (
                        <span className="absolute top-2 left-2 bg-pm-yellow text-pm text-xs font-bold px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {ad.condition === 'NEW' ? 'New' : 'Used'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-pm transition-colors">
                        {ad.title}
                      </h3>
                      <p className="text-xl font-extrabold text-pm mb-3">
                        {formatPrice(ad.price)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {ad.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatRelativeTime(ad.createdAt)}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-1 text-xs text-gray-400">
                        <Eye className="h-3 w-3" /> {ad.views} views
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Browse All CTA */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-pm to-pm-light rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Have something to sell in {category.name}?
            </h2>
            <p className="text-white/75 mb-8 max-w-lg mx-auto">
              Post your ad for free and reach millions of buyers across Pakistan.
            </p>
            <Link href={`/post-ad?category=${category.id}`}>
              <span className="inline-flex items-center gap-2 bg-pm-yellow text-pm font-bold px-8 py-3 rounded-full hover:bg-pm-yellow/90 transition-colors shadow-lg shadow-black/20">
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
