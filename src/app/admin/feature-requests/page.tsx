'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle, XCircle, Eye, Star, Clock,
  DollarSign, Phone, User, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface FeatureRequest {
  id: string; screenshotImage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  amount: number; durationDays: number;
  notes: string | null; createdAt: string;
  reviewedAt: string | null; rejectionReason: string | null;
  ad: {
    id: string; title: string; images: string[];
    price: number;
    user: { id: string; name: string; email: string };
    category: { name: string };
  };
  user: { id: string; name: string; email: string; phone: string | null };
}

const TABS = [
  { label: 'Pending',  value: 'pending',  color: 'amber' },
  { label: 'Approved', value: 'approved', color: 'emerald' },
  { label: 'Rejected', value: 'rejected', color: 'red' },
];

export default function AdminFeatureRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestToReject, setRequestToReject] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/feature-requests?status=${activeTab}`);
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [activeTab]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleProcess = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(requestId);
    try {
      const res = await fetch('/api/admin/feature-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, rejectionReason: status === 'REJECTED' ? rejectionReason : undefined }),
      });
      if (res.ok) {
        toast({ title: status === 'APPROVED' ? '✅ Request approved — ad is now featured!' : 'Request rejected' });
        fetchRequests();
        setRequestToReject(null);
        setRejectionReason('');
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setProcessingId(null); }
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Feature Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review payment proofs and approve featured ads</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive ? 'bg-pm text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
              {tab.value === 'pending' && pendingCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Request cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                  {/* Ad Info — 2/3 */}
                  <div className="lg:col-span-2 p-5">
                    <div className="flex items-start gap-4">
                      {/* Ad thumbnail */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={req.ad.images[0] || '/images/placeholder.jpg'}
                          alt={req.ad.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{req.ad.category.name}</Badge>
                          <span className="text-xs text-gray-400">{formatRelativeTime(req.createdAt)}</span>
                        </div>
                        <Link href={`/ad/${req.ad.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-pm text-sm line-clamp-2 transition-colors">
                            {req.ad.title}
                          </h3>
                        </Link>
                        <p className="text-pm font-extrabold text-base mt-0.5">{formatPrice(req.ad.price)}</p>
                      </div>
                    </div>

                    {/* Seller details */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Seller</p>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700 truncate">{req.user.name}</p>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{req.user.email}</p>
                        {req.user.phone && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{req.user.phone}</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-gradient-to-br from-pm to-pm-light rounded-xl p-3 text-white">
                        <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Payment</p>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" />
                          <p className="text-base font-extrabold">Rs {req.amount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-white/70" />
                          <p className="text-xs text-white/80">{req.durationDays} days featured</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Screenshot + Actions — 1/3 */}
                  <div className="p-5 flex flex-col gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-2">Payment Screenshot</p>
                      <div
                        className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-pointer group border border-gray-200"
                        onClick={() => setSelectedImage(req.screenshotImage)}
                      >
                        <Image src={req.screenshotImage} alt="Payment proof" fill className="object-contain" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl"
                          disabled={processingId === req.id}
                          onClick={() => handleProcess(req.id, 'APPROVED')}
                        >
                          <CheckCircle className="h-4 w-4" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-red-500 hover:bg-red-50 border-red-100 gap-2 rounded-xl"
                          onClick={() => setRequestToReject(req.id)}
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}

                    {req.status === 'APPROVED' && (
                      <div className="flex flex-col items-center justify-center flex-1 gap-1 bg-emerald-50 rounded-xl p-4 text-emerald-700">
                        <CheckCircle className="h-8 w-8" />
                        <p className="font-semibold text-sm">Approved</p>
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <Star className="h-3 w-3 fill-emerald-500" /> Ad is now featured
                        </div>
                      </div>
                    )}

                    {req.status === 'REJECTED' && (
                      <div className="flex flex-col items-center justify-center flex-1 gap-1 bg-red-50 rounded-xl p-4 text-red-700">
                        <XCircle className="h-8 w-8" />
                        <p className="font-semibold text-sm">Rejected</p>
                        {req.rejectionReason && <p className="text-xs text-red-500 text-center">{req.rejectionReason}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Star className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {activeTab} requests</p>
        </div>
      )}

      {/* Screenshot lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader><DialogTitle>Payment Screenshot</DialogTitle></DialogHeader>
          {selectedImage && (
            <div className="relative aspect-video">
              <Image src={selectedImage} alt="Payment proof" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection dialog */}
      <Dialog open={!!requestToReject} onOpenChange={() => { setRequestToReject(null); setRejectionReason(''); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reject Feature Request</DialogTitle>
            <DialogDescription>Provide a reason that will be shown to the user.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Payment amount incorrect, unclear screenshot…"
            rows={3}
            className="rounded-xl"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setRequestToReject(null); setRejectionReason(''); }}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || !!processingId}
              onClick={() => requestToReject && handleProcess(requestToReject, 'REJECTED')}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
