'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Eye, Star, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice, formatDate, formatRelativeTime } from '@/lib/utils';

interface FeatureRequest {
  id: string;
  screenshotImage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  amount: number;
  durationDays: number;
  notes: string | null;
  createdAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  ad: {
    id: string;
    title: string;
    images: string[];
    price: number;
    user: {
      id: string;
      name: string;
      email: string;
    };
    category: {
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export default function AdminFeatureRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestToReject, setRequestToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/feature-requests?status=${activeTab}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/admin/feature-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: `Request ${status.toLowerCase()}`,
          description: `The feature request has been ${status.toLowerCase()} successfully.`,
        });
        fetchRequests();
        setRequestToReject(null);
        setRejectionReason('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process request',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Feature Requests</h1>
        <p className="text-gray-500 mt-1">Review and process featured ad requests</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {requests.filter((r) => r.status === 'PENDING').length > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5">
                {requests.filter((r) => r.status === 'PENDING').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Ad Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={request.ad.images[0] || '/images/placeholder.jpg'}
                              alt={request.ad.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{request.ad.category.name}</Badge>
                              <span className="text-sm text-gray-500">
                                {formatRelativeTime(request.createdAt)}
                              </span>
                            </div>
                            <Link href={`/ad/${request.ad.id}`}>
                              <h3 className="font-semibold text-lg hover:text-olx">
                                {request.ad.title}
                              </h3>
                            </Link>
                            <p className="text-olx font-bold">
                              {formatPrice(request.ad.price)}
                            </p>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Seller:</span>{' '}
                                {request.user.name} ({request.user.email})
                              </p>
                              {request.user.phone && (
                                <p>
                                  <span className="font-medium">Phone:</span>{' '}
                                  {request.user.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-green-500" />
                              <div>
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="font-semibold">Rs {request.amount.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-semibold">{request.durationDays} days</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Screenshot & Actions */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Payment Screenshot</p>
                        <div
                          className="relative aspect-video cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(request.screenshotImage)}
                        >
                          <Image
                            src={request.screenshotImage}
                            alt="Payment proof"
                            fill
                            className="object-contain bg-gray-100 rounded-lg border"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                            <Eye className="h-8 w-8 text-white" />
                          </div>
                        </div>

                        {request.status === 'PENDING' && (
                          <div className="mt-4 space-y-2">
                            <Button
                              className="w-full bg-green-500 hover:bg-green-600 gap-2"
                              onClick={() => handleProcess(request.id, 'APPROVED')}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full text-red-500 hover:text-red-600 gap-2"
                              onClick={() => setRequestToReject(request.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {request.status === 'APPROVED' && (
                          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center">
                            <CheckCircle className="h-5 w-5 mx-auto mb-1" />
                            <p className="text-sm font-medium">Approved</p>
                            <p className="text-xs">
                              {request.reviewedAt && formatDate(request.reviewedAt)}
                            </p>
                          </div>
                        )}

                        {request.status === 'REJECTED' && (
                          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                            <XCircle className="h-5 w-5 mx-auto mb-1" />
                            <p className="text-sm font-medium text-center">Rejected</p>
                            {request.rejectionReason && (
                              <p className="text-xs mt-1">{request.rejectionReason}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No requests found</h2>
                <p className="text-gray-500">No feature requests in this category</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative aspect-video">
              <Image
                src={selectedImage}
                alt="Payment proof"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={!!requestToReject} onOpenChange={() => setRequestToReject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Feature Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestToReject(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => requestToReject && handleProcess(requestToReject, 'REJECTED')}
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
