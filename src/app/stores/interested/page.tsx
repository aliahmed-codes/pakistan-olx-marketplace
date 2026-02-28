'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Store,
  MapPin,
  Package,
  Heart,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  city: string;
  isVerified: boolean;
  _count: {
    ads: number;
  };
}

export default function InterestedStoresPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/stores/interested');
      return;
    }

    if (session?.user) {
      fetchInterestedStores();
    }
  }, [session, status, router]);

  const fetchInterestedStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stores/interested');
      const data = await response.json();

      if (data.success) {
        setStores(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch stores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (storeId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/follow`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Store removed from interests');
        fetchInterestedStores();
      }
    } catch (error) {
      toast.error('Failed to unfollow store');
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase())
  );

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Stores You Follow
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with your favorite stores
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/stores">
                <Button variant="outline">Browse All Stores</Button>
              </Link>
              <Link href="/stores/create">
                <Button className="bg-olx hover:bg-olx-light">
                  <Store className="h-4 w-4 mr-2" />
                  Create Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search your stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {stores.length === 0
                ? "You haven't followed any stores yet"
                : 'No stores match your search'}
            </h2>
            <p className="text-gray-600 mb-6">
              {stores.length === 0
                ? 'Follow stores to see their latest ads and updates'
                : 'Try a different search term'}
            </p>
            {stores.length === 0 && (
              <Link href="/stores">
                <Button className="bg-olx hover:bg-olx-light">
                  Discover Stores
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Store Header */}
                <div className="h-24 bg-gradient-to-r from-olx to-olx-light" />

                {/* Store Info */}
                <div className="px-6 pb-6">
                  <div className="relative -mt-12 mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                      {store.logo ? (
                        <img
                          src={store.logo}
                          alt={store.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Store className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {store.name}
                  </h3>

                  {store.isVerified && (
                    <span className="inline-flex items-center text-green-600 text-sm mb-2">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {store.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {store.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {store._count.ads} ads
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/stores/${store.slug}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Store
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnfollow(store.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
