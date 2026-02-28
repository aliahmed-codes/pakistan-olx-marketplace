'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Eye, Trash2, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  city: string;
  condition: 'NEW' | 'USED';
  isApproved: boolean;
  isFeatured: boolean;
  status: string;
  views: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    favorites: number;
    conversations: number;
    reports: number;
  };
}

export default function AdminAdsPage() {
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, [activeTab]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/ads?status=${activeTab}`);
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

  const handleApprove = async (adId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, status }),
      });

      if (response.ok) {
        toast({
          title: `Ad ${status.toLowerCase()}`,
          description: `The ad has been ${status.toLowerCase()} successfully.`,
        });
        fetchAds();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ad status',
        variant: 'destructive',
      });
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
          description: 'The ad has been deleted successfully.',
        });
        fetchAds();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete ad',
        variant: 'destructive',
      });
    } finally {
      setAdToDelete(null);
    }
  };

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Ads</h1>
          <p className="text-gray-500 mt-1">Review and manage all ads</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Ads</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {ads.filter((a) => !a.isApproved && a.status === 'PENDING').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {ads.filter((a) => !a.isApproved && a.status === 'PENDING').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredAds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad) => (
                <Card key={ad.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={ad.images[0] || '/images/placeholder.jpg'}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {!ad.isApproved && ad.status === 'PENDING' && (
                        <Badge variant="warning">Pending</Badge>
                      )}
                      {ad.status === 'REJECTED' && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                      {ad.isFeatured && <Badge variant="featured">Featured</Badge>}
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

                    <p className="text-sm text-gray-500 mb-2">
                      {ad.city} • {formatRelativeTime(ad.createdAt)}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                        {ad.user.profileImage && (
                          <Image
                            src={ad.user.profileImage}
                            alt={ad.user.name}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{ad.user.name}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>{ad.views} views</span>
                      <span>{ad._count.favorites} favorites</span>
                      {ad._count.reports > 0 && (
                        <span className="text-red-500">{ad._count.reports} reports</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/ad/${ad.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>

                      {!ad.isApproved && ad.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 gap-1"
                            onClick={() => handleApprove(ad.id, 'APPROVED')}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleApprove(ad.id, 'REJECTED')}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </>
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
                            <Button variant="outline" onClick={() => setAdToDelete(null)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handleDelete(ad.id)}>
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
                <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No ads found</h2>
                <p className="text-gray-500">
                  {searchQuery ? 'Try a different search term' : 'No ads in this category'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
