'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Eye, Flag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface Report {
  id: string;
  reason: string;
  description: string | null;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  resolvedAt: string | null;
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
  reporter: {
    id: string;
    name: string;
    email: string;
  };
}

const reportReasons: Record<string, string> = {
  SPAM: 'Spam',
  FRAUD: 'Fraud',
  INAPPROPRIATE: 'Inappropriate Content',
  DUPLICATE: 'Duplicate Ad',
  OTHER: 'Other',
};

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reports?status=${activeTab}`);
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (reportId: string, status: 'RESOLVED' | 'DISMISSED') => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      });

      if (response.ok) {
        toast({
          title: `Report ${status.toLowerCase()}`,
          description: `The report has been ${status.toLowerCase()} successfully.`,
        });
        fetchReports();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process report',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500 mt-1">Review and manage user reports</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {reports.filter((r) => r.status === 'PENDING').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {reports.filter((r) => r.status === 'PENDING').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Report Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={report.ad.images[0] || '/images/placeholder.jpg'}
                              alt={report.ad.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="destructive" className="gap-1">
                                <Flag className="h-3 w-3" />
                                {reportReasons[report.reason] || report.reason}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatRelativeTime(report.createdAt)}
                              </span>
                            </div>
                            <Link href={`/ad/${report.ad.id}`}>
                              <h3 className="font-semibold text-lg hover:text-olx">
                                {report.ad.title}
                              </h3>
                            </Link>
                            <p className="text-olx font-bold">
                              {formatPrice(report.ad.price)}
                            </p>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Seller:</span>{' '}
                                {report.ad.user.name} ({report.ad.user.email})
                              </p>
                              <p>
                                <span className="font-medium">Reported by:</span>{' '}
                                {report.reporter.name} ({report.reporter.email})
                              </p>
                            </div>
                            {report.description && (
                              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-red-700">
                                  <span className="font-medium">Description:</span>{' '}
                                  {report.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col justify-center">
                        {report.status === 'PENDING' && (
                          <div className="space-y-2">
                            <Link href={`/ad/${report.ad.id}`} className="block">
                              <Button variant="outline" className="w-full gap-2">
                                <Eye className="h-4 w-4" />
                                View Ad
                              </Button>
                            </Link>
                            <Button
                              className="w-full bg-green-500 hover:bg-green-600 gap-2"
                              onClick={() => handleProcess(report.id, 'RESOLVED')}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Resolve
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full text-gray-500 gap-2"
                              onClick={() => handleProcess(report.id, 'DISMISSED')}
                            >
                              <XCircle className="h-4 w-4" />
                              Dismiss
                            </Button>
                          </div>
                        )}

                        {report.status === 'RESOLVED' && (
                          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center">
                            <CheckCircle className="h-5 w-5 mx-auto mb-1" />
                            <p className="text-sm font-medium">Resolved</p>
                            {report.resolvedAt && (
                              <p className="text-xs">
                                {new Date(report.resolvedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {report.status === 'DISMISSED' && (
                          <div className="p-3 bg-gray-100 text-gray-600 rounded-lg text-center">
                            <XCircle className="h-5 w-5 mx-auto mb-1" />
                            <p className="text-sm font-medium">Dismissed</p>
                            {report.resolvedAt && (
                              <p className="text-xs">
                                {new Date(report.resolvedAt).toLocaleDateString()}
                              </p>
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
                <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No reports found</h2>
                <p className="text-gray-500">No reports in this category</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
