'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Heart, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
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
    createdAt: Date | string;
    user: { id: string; name: string; profileImage: string | null };
    category: { id: string; name: string; slug: string };
  };
  createdAt: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/favorites');
  }, [status, router]);

  useEffect(() => {
    if (session?.user) fetchFavorites();
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      if (data.success) setFavorites(data.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (adId: string) => {
    setRemovingId(adId);
    try {
      const res = await fetch(`/api/favorites?adId=${adId}`, { method: 'DELETE' });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.ad.id !== adId));
        toast({ title: 'Removed from Favorites', description: 'Ad has been removed from your saved list.' });
      } else {
        toast({ title: 'Error', description: 'Failed to remove from favorites.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setRemovingId(null);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f5f6fa] py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f6fa]">
        {/* ── Branded hero ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-pm to-pm-light text-white py-10 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(35,229,219,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="container mx-auto px-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                <Heart className="h-5 w-5 text-rose-300 fill-rose-300" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">My Favorites</h1>
                <p className="text-white/70 text-sm">
                  {isLoading ? 'Loading...' : `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} saved`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
          ) : favorites.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-5">
                Hover over a card and click the <span className="text-red-500 font-medium">remove</span> button to unsave an ad.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {favorites.map((fav) => (
                  <div key={fav.id} className="relative group">
                    <AdCard ad={fav.ad} showFavorite={false} />
                    {/* Remove button */}
                    <button
                      onClick={() => removeFavorite(fav.ad.id)}
                      disabled={removingId === fav.ad.id}
                      className="absolute top-2 right-2 z-10 bg-white/95 hover:bg-red-50 text-red-500 hover:text-red-600 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all border border-red-100 disabled:cursor-wait"
                      title="Remove from favorites"
                    >
                      {removingId === fav.ad.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />
                      }
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-rose-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No saved ads yet</h2>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Tap the heart icon on any ad to save it here for easy access later.
              </p>
              <Button
                onClick={() => router.push('/search')}
                className="bg-pm hover:bg-pm-light gap-2 rounded-full px-8"
              >
                <ShoppingBag className="h-4 w-4" /> Browse Ads
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
