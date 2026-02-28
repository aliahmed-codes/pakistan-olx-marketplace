'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  MapPin,
  Calendar,
  Eye,
  ChevronRight,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/categories';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

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

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  images: string[];
  city: string;
  area: string | null;
  views: number;
  createdAt: string;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const category = categories.find((c) => c.slug === slug);
  const CategoryIcon = category ? iconMap[category.icon] || Smartphone : Smartphone;

  useEffect(() => {
    if (category) {
      fetchAds();
    }
  }, [category, selectedSubCategory]);

  const fetchAds = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category.id);
      }
      if (selectedSubCategory) {
        params.append('subcategory', selectedSubCategory);
      }

      const response = await fetch(`/api/ads/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setAds(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch ads');
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
            <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
            <Link href="/categories">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-olx to-olx-light text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-2 text-white/80 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/categories" className="hover:text-white">Categories</Link>
              <ChevronRight className="h-4 w-4" />
              <span>{category.name}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                <CategoryIcon className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
                <p className="text-white/80">{category.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-categories */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-lg font-semibold mb-4">Browse by Sub-category</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSubCategory === ''
                    ? 'bg-olx text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {category.subCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubCategory === sub.id
                      ? 'bg-olx text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ads Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedSubCategory
                ? category.subCategories.find((s) => s.id === selectedSubCategory)?.name
                : `All ${category.name}`}
            </h2>
            <Link href={`/post-ad?category=${category.id}`}>
              <Button className="bg-olx hover:bg-olx-light">
                Post Ad in {category.name}
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg">
              <CategoryIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No ads found</h2>
              <p className="text-gray-600 mb-4">
                Be the first to post an ad in this category
              </p>
              <Link href={`/post-ad?category=${category.id}`}>
                <Button className="bg-olx hover:bg-olx-light">Post an Ad</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ads.map((ad) => (
                <Link key={ad.id} href={`/ad/${ad.id}`}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    {/* Image */}
                    <div className="aspect-[4/3] relative bg-gray-100">
                      {ad.images[0] ? (
                        <Image
                          src={ad.images[0]}
                          alt={ad.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {ad.isFeatured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 right-2"
                      >
                        {ad.condition === 'NEW' ? 'New' : 'Used'}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                        {ad.title}
                      </h3>
                      <p className="text-xl font-bold text-olx mb-2">
                        {formatPrice(ad.price)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ad.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatRelativeTime(ad.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {ad.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-olx to-olx-light rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">
                Have something to sell in {category.name}?
              </h2>
              <p className="text-white/80 mb-6">
                Post your ad for free and reach thousands of buyers
              </p>
              <Link href={`/post-ad?category=${category.id}`}>
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
