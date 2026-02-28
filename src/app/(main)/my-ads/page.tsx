'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Edit2, Trash2, Star, MessageSquare, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import Image from 'next/image';

interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  condition: 'NEW' | 'USED';
  isApproved: boolean;
  isFeatured: boolean;
  featuredUntil: string | null;
  status: string;
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
  _count: {
    conversations: number;
    favorites: number;
  };
}

export default function MyAdsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/my-ads');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAds();
    }
  }, [session, activeTab]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ads/my-ads?status=${activeTab}`);
      const data = await response.json();
      if (data.success) {
        setAds(data.data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Ad Deleted',
          description: 'Your ad has been deleted successfully.',
        });
        fetchAds();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete ad. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAdToDelete(null);
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
              <h1 className="text-3xl font-bold">My Ads</h1>
              <p className="text-gray-500 mt-1">Manage your listings</p>
            </div>
            <Link href="/post-ad">
              <Button className="bg-olx hover:bg-olx-light gap-2">
                <Plus className="h-4 w-4" />
                Post New Ad
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Ads</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              ) : ads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={ad.images[0] || '/images/placeholder.jpg'}
                          alt={ad.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-2">
                          {!ad.isApproved && (
                            <Badge variant="warning">Pending</Badge>
                          )}
                          {ad.isFeatured && (
                            <Badge variant="featured">Featured</Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-lg text-olx">
                              {formatPrice(ad.price)}
                            </p>
                            <h3 className="font-medium line-clamp-1">{ad.title}</h3>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-3">
                          {ad.city} • {formatRelativeTime(ad.createdAt)}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {ad._count.favorites}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {ad._count.conversations}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/edit-ad/${ad.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-1">
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          {!ad.isFeatured && ad.isApproved && (
                            <Link href={`/feature-ad/${ad.id}`} className="flex-1">
                              <Button size="sm" className="w-full gap-1 bg-olx-yellow text-olx hover:bg-olx-yellow/90">
                                <Star className="h-4 w-4" />
                                Feature
                              </Button>
                            </Link>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => setAdToDelete(ad.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Ad</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this ad? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setAdToDelete(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(ad.id)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-16">
                  <CardContent>
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No ads found</h2>
                    <p className="text-gray-500 mb-6">
                      You haven&apos;t posted any ads yet
                    </p>
                    <Link href="/post-ad">
                      <Button className="bg-olx hover:bg-olx-light gap-2">
                        <Plus className="h-4 w-4" />
                        Post Your First Ad
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
