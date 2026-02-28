'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AdCard } from '@/components/ads/AdCard';
import { cities } from '@/lib/utils';

interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  condition: 'NEW' | 'USED';
  isFeatured: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ads, setAds] = useState<Ad[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      });
  }, []);

  // Fetch ads
  const fetchAds = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    try {
      const response = await fetch(`/api/ads?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAds(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    });
    router.push('/search');
  };

  const hasActiveFilters =
    filters.category ||
    filters.city ||
    filters.condition ||
    filters.minPrice ||
    filters.maxPrice;

  // Filter Sidebar Content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select
          value={filters.category}
          onValueChange={(value) => updateFilters({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      <div>
        <h3 className="font-semibold mb-3">City</h3>
        <Select
          value={filters.city}
          onValueChange={(value) => updateFilters({ city: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition Filter */}
      <div>
        <h3 className="font-semibold mb-3">Condition</h3>
        <Select
          value={filters.condition}
          onValueChange={(value) => updateFilters({ condition: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Condition</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="USED">Used</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">
              {filters.search ? `Results for "${filters.search}"` : 'Browse Ads'}
            </h1>

            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchAds();
              }}
              className="relative max-w-2xl"
            >
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search for anything..."
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-olx-accent focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h2>
                </div>
                <FilterContent />
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Sort & Mobile Filter */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  {pagination?.total || 0} results found
                </p>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilters({ sortBy: value })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px]">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.category && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => updateFilters({ category: '' })}
                    >
                      {categories.find((c) => c.slug === filters.category)?.name}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {filters.city && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => updateFilters({ city: '' })}
                    >
                      {filters.city}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {filters.condition && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => updateFilters({ condition: '' })}
                    >
                      {filters.condition === 'NEW' ? 'New' : 'Used'}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
              )}

              {/* Results Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-lg" />
                  ))}
                </div>
              ) : ads.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ads.map((ad) => (
                      <AdCard key={ad.id} ad={ad} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        disabled={pagination.page === 1}
                        onClick={() =>
                          updateFilters({})
                        }
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={!pagination.hasMore}
                        onClick={() =>
                          updateFilters({})
                        }
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">
                    No ads found
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Badge component for active filters
function Badge({
  children,
  variant,
  className,
  onClick,
}: {
  children: React.ReactNode;
  variant?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer ${className}`}
    >
      {children}
    </span>
  );
}
