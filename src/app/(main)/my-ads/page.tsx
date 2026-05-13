'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Package, Plus, Edit2, Trash2, Star,
  MessageSquare, Eye, MapPin, Clock,
  AlertCircle, CheckCircle2, RefreshCw, Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import Image from 'next/image';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  condition: 'NEW' | 'USED';
  isApproved: boolean;
  isActiveAd: boolean;
  isFeatured: boolean;
  featuredUntil: string | null;
  expiresAt: string | null;
  views: number;
  createdAt: string;
  category: { name: string; slug: string };
  _count: { conversations: number; favorites: number };
}

// ── Tabs config ────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'all',      label: 'All Ads'  },
  { value: 'active',   label: 'Active'   },
  { value: 'pending',  label: 'Pending'  },
  { value: 'featured', label: 'Featured' },
  { value: 'expired',  label: 'Expired'  },
] as const;

// ── Component ──────────────────────────────────────────────────────────────────

export default function MyAdsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['value']>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/my-ads');
  }, [status, router]);

  useEffect(() => {
    if (session?.user) fetchAds();
  }, [session, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/ads/my-ads?status=${activeTab}&limit=50`);
      const data = await res.json();
      if (data.success) setAds(data.data);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/ads/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Ad deleted', description: 'Your ad has been deleted.' });
        setAds((prev) => prev.filter((a) => a.id !== deleteId));
      } else {
        toast({ title: 'Error', description: 'Failed to delete ad.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleReactivate = async (adId: string) => {
    try {
      const res  = await fetch(`/api/ads/${adId}/reactivate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Submitted for review', description: data.message });
        fetchAds();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    }
  };

  const isExpired = (ad: Ad) =>
    !!ad.expiresAt && new Date(ad.expiresAt) < new Date();


  // ── Loading ────────────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f5f6fa] py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f6fa]">
        {/* Hero header */}
        <div className="bg-gradient-to-br from-pm to-pm-light text-white py-10 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, rgba(35,229,219,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="container mx-auto px-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold mb-1">My Listings</h1>
                <p className="text-white/70">Manage and track your listings</p>
              </div>
              <Link href="/post-ad">
                <Button className="bg-pm-yellow text-pm hover:bg-pm-yellow/90 gap-2 font-bold rounded-full px-6 shadow-lg">
                  <Plus className="h-4 w-4" /> Post New Ad
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.value
                    ? 'bg-pm text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab.label}
                {!isLoading && activeTab === tab.value && ads.length > 0 && (
                  <span className="ml-1.5 text-xs opacity-75">({ads.length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {ad.images[0] ? (
                      <Image
                        src={ad.images[0]}
                        alt={ad.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">📦</div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {isExpired(ad) && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Timer className="h-2.5 w-2.5" /> Expired
                        </span>
                      )}
                      {!ad.isApproved && !isExpired(ad) && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5" /> Pending
                        </span>
                      )}
                      {ad.isApproved && !isExpired(ad) && !ad.isFeatured && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Active
                        </span>
                      )}
                      {ad.isFeatured && (
                        <span className="bg-pm-yellow text-pm text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 fill-pm" /> Featured
                        </span>
                      )}
                    </div>
                    {/* Condition */}
                    <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {ad.condition === 'NEW' ? 'New' : 'Used'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="text-lg font-extrabold text-pm">{formatPrice(ad.price)}</p>
                    <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm mb-2">{ad.title}</h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ad.city}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatRelativeTime(ad.createdAt)}</span>
                      {ad.expiresAt && !isExpired(ad) && (
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <Timer className="h-3 w-3" />
                          Expires {formatRelativeTime(ad.expiresAt)}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                      <span className="flex items-center gap-1 font-medium">
                        <Eye className="h-3.5 w-3.5 text-blue-400" /> {ad.views} views
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <MessageSquare className="h-3.5 w-3.5 text-green-400" /> {ad._count.conversations} chats
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-3.5 w-3.5 text-rose-400" /> {ad._count.favorites} saves
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {isExpired(ad) ? (
                        <Button
                          size="sm"
                          className="flex-1 gap-1 bg-pm text-white hover:bg-pm-light text-xs rounded-full font-bold"
                          onClick={() => handleReactivate(ad.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Reactivate
                        </Button>
                      ) : (
                        <>
                          <Link href={`/edit-ad/${ad.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-1 text-xs rounded-full">
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </Button>
                          </Link>
                          {!ad.isFeatured && ad.isApproved && (
                            <Link href={`/feature-ad/${ad.id}`} className="flex-1">
                              <Button size="sm" className="w-full gap-1 bg-pm-yellow text-pm hover:bg-pm-yellow/90 text-xs rounded-full font-bold">
                                <Star className="h-3.5 w-3.5" /> Feature
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 rounded-full px-3"
                            onClick={() => setDeleteId(ad.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Ad</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete &quot;{ad.title}&quot;? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No ads found</h2>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all'
                  ? "You haven't posted any ads yet."
                  : `No ${activeTab} ads at the moment.`}
              </p>
              <Link href="/post-ad">
                <Button className="bg-pm hover:bg-pm-light gap-2 rounded-full px-8">
                  <Plus className="h-4 w-4" /> Post Your First Ad
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
