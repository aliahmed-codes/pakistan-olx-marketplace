'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Eye,
  Heart,
  X,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];

  useEffect(() => {
    fetchCategories();
    fetchAds();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAds = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedCity) params.append('city', selectedCity);
      if (condition) params.append('condition', condition);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('sort', sortBy);
      params.append('page', pageNum.toString());

      const response = await fetch(`/api/ads/search?${params}`);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setAds(data.data);
        } else {
          setAds((prev) => [...prev, ...data.data]);
        }
        setTotalResults(data.pagination.total);
        setHasMore(data.pagination.hasMore);
        setPage(pageNum);
      }
    } catch (error) {
      toast.error('Failed to fetch ads');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedCity) params.append('city', selectedCity);
    if (condition) params.append('condition', condition);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sort', sortBy);

    router.push(`/search?${params}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    router.push('/search');
  };

  const hasActiveFilters =
    selectedCategory || selectedCity || condition || minPrice || maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Location Filter */}
      <div>
        <h3 className="font-semibold mb-3">Location</h3>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
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

      <Separator />

      {/* Condition Filter */}
      <div>
        <h3 className="font-semibold mb-3">Condition</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={condition === 'NEW'}
              onCheckedChange={() => setCondition(condition === 'NEW' ? '' : 'NEW')}
            />
            <span>New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={condition === 'USED'}
              onCheckedChange={() => setCondition(condition === 'USED' ? '' : 'USED')}
            />
            <span>Used</span>
          </label>
        </div>
      </div>

      <Separator />

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* Apply/Clear Buttons */}
      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full bg-olx hover:bg-olx-light">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Search for anything..."
                  className="pl-10"
                />
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value) => { setSortBy(value); applyFilters(); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="most_viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Button - Mobile */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        Active
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => { setSelectedCategory(''); applyFilters(); }}
                    />
                  </Badge>
                )}
                {selectedCity && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCity}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => { setSelectedCity(''); applyFilters(); }}
                    />
                  </Badge>
                )}
                {condition && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {condition === 'NEW' ? 'New' : 'Used'}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => { setCondition(''); applyFilters(); }}
                    />
                  </Badge>
                )}
                {(minPrice || maxPrice) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Rs. {minPrice || '0'} - {maxPrice || '∞'}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => { setMinPrice(''); setMaxPrice(''); applyFilters(); }}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-36">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <SlidersHorizontal className="h-5 w-5 text-gray-400" />
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Ads Grid */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  {isLoading ? 'Loading...' : `${totalResults} results found`}
                </p>
              </div>

              {isLoading && ads.length === 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
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
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                              <span className="text-sm text-gray-500">
                                {ad.category.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <Button
                        onClick={() => fetchAds(page + 1)}
                        variant="outline"
                        isLoading={isLoading}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
        </main>
        <Footer />
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
