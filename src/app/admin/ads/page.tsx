'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle, XCircle, Eye, Trash2, Search,
  Star, Clock, Package, Filter, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface Ad {
  id: string; title: string; price: number; images: string[];
  city: string; condition: 'NEW' | 'USED'; isApproved: boolean;
  isFeatured: boolean; status: string; views: number; createdAt: string;
  user: { id: string; name: string; email: string; profileImage: string | null };
  category: { id: string; name: string; slug: string };
  _count: { favorites: number; conversations: number; reports: number };
}

const TABS = [
  { label: 'All',      value: 'all',      icon: Package },
  { label: 'Pending',  value: 'pending',  icon: Clock },
  { label: 'Approved', value: 'approved', icon: CheckCircle },
  { label: 'Featured', value: 'featured', icon: Star },
  { label: 'Rejected', value: 'rejected', icon: XCircle },
];

export default function AdminAdsPage() {
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/ads?status=${activeTab}`);
      const data = await res.json();
      if (data.success) setAds(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [activeTab]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const handleApprove = async (adId: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(adId);
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, status }),
      });
      if (res.ok) {
        toast({ title: `Ad ${status === 'APPROVED' ? 'approved ✅' : 'rejected'}` });
        fetchAds();
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setProcessingId(null); }
  };

  const handleDelete = async (adId: string) => {
    try {
      const res = await fetch(`/api/ads/${adId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Ad deleted' });
        fetchAds();
      }
    } catch { toast({ title: 'Failed to delete', variant: 'destructive' }); }
    finally { setAdToDelete(null); }
  };

  const filtered = ads.filter((ad) =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Ads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ads.length} total ads</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, user, city…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-72 bg-white border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          const count = tab.value === 'pending'
            ? ads.filter((a) => !a.isApproved && a.status === 'PENDING').length
            : tab.value === 'featured'
            ? ads.filter((a) => a.isFeatured).length
            : null;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-pm text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {count !== null && count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ad) => (
            <Card key={ad.id} className="overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={ad.images[0] || '/images/placeholder.jpg'}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {!ad.isApproved && ad.status === 'PENDING' && (
                    <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending</span>
                  )}
                  {ad.status === 'REJECTED' && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Rejected</span>
                  )}
                  {ad.isFeatured && (
                    <span className="bg-pm-yellow text-pm text-[10px] font-bold px-2 py-0.5 rounded-full">★ Featured</span>
                  )}
                  {ad.isApproved && !ad.isFeatured && ad.status !== 'REJECTED' && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
                  )}
                </div>
                {ad._count.reports > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ⚑ {ad._count.reports}
                  </span>
                )}
              </div>

              <CardContent className="p-4">
                <p className="text-pm font-extrabold text-base">{formatPrice(ad.price)}</p>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mt-0.5">{ad.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{ad.city} · {ad.category.name} · {formatRelativeTime(ad.createdAt)}</p>

                {/* Seller */}
                <div className="flex items-center gap-2 mt-2 py-2 border-t border-gray-50">
                  <div className="w-5 h-5 rounded-full bg-pm/10 overflow-hidden shrink-0">
                    {ad.user.profileImage && (
                      <Image src={ad.user.profileImage} alt={ad.user.name} width={20} height={20} className="object-cover" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 truncate">{ad.user.name}</span>
                  <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
                    <span>{ad.views} 👁</span>
                    <span>{ad._count.favorites} ♡</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <Link href={`/ad/${ad.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1 text-xs rounded-lg">
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </Link>

                  {!ad.isApproved && ad.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-xs rounded-lg px-2"
                        disabled={processingId === ad.id}
                        onClick={() => handleApprove(ad.id, 'APPROVED')}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs rounded-lg px-2"
                        disabled={processingId === ad.id}
                        onClick={() => handleApprove(ad.id, 'REJECTED')}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-600 hover:border-red-200 rounded-lg px-2"
                        onClick={() => setAdToDelete(ad.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Delete this ad?</DialogTitle>
                        <DialogDescription>This cannot be undone.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setAdToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDelete(ad.id)}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Filter className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No ads found</p>
          <p className="text-sm text-gray-400">{searchQuery ? 'Try a different search' : 'Nothing in this category'}</p>
        </div>
      )}
    </div>
  );
}
