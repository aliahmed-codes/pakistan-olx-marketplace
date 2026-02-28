'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AdCard } from '@/components/ads/AdCard';

interface Favorite {
  id: string;
  ad: {
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
  };
  createdAt: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/favorites');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      if (data.success) {
        setFavorites(data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (adId: string) => {
    try {
      const response = await fetch(`/api/favorites?adId=${adId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.ad.id !== adId));
        toast({
          title: 'Removed from Favorites',
          description: 'The ad has been removed from your favorites.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Favorites</h1>
              <p className="text-gray-500 mt-1">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          {/* Favorites Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="relative group">
                  <AdCard ad={favorite.ad} showFavorite={false} />
                  <button
                    onClick={() => removeFavorite(favorite.ad.id)}
                    className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Start exploring and save ads you&apos;re interested in. They&apos;ll appear here for easy access.
                </p>
                <Button
                  onClick={() => router.push('/search')}
                  className="bg-olx hover:bg-olx-light gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Browse Ads
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
