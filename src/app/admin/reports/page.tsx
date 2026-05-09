'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Eye, Flag, AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface Report {
  id: string; reason: string; description: string | null;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string; resolvedAt: string | null;
  ad: { id: string; title: string; images: string[]; price: number; user: { name: string; email: string }; category: { name: string } };
  reporter: { id: string; name: string; email: string };
}

const REASON_LABELS: Record<string, string> = {
  SPAM: 'Spam', FRAUD: 'Fraud', INAPPROPRIATE: 'Inappropriate',
  DUPLICATE: 'Duplicate', OTHER: 'Other',
};

const REASON_COLORS: Record<string, string> = {
  SPAM: 'bg-orange-100 text-orange-700',
  FRAUD: 'bg-red-100 text-red-700',
  INAPPROPRIATE: 'bg-pink-100 text-pink-700',
  DUPLICATE: 'bg-blue-100 text-blue-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

const TABS = [
  { label: 'Pending',   value: 'pending' },
  { label: 'Resolved',  value: 'resolved' },
  { label: 'Dismissed', value: 'dismissed' },
];

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?status=${activeTab}`);
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [activeTab]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleProcess = async (reportId: string, status: 'RESOLVED' | 'DISMISSED') => {
    setProcessingId(reportId);
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      });
      if (res.ok) {
        toast({ title: status === 'RESOLVED' ? 'Report resolved ✅' : 'Report dismissed' });
        fetchReports();
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setProcessingId(null); }
  };

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review flagged content and take action</p>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                  {/* Main — 3/4 */}
                  <div className="lg:col-span-3 p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={report.ad.images[0] || '/images/placeholder.jpg'}
                          alt={report.ad.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${REASON_COLORS[report.reason] || 'bg-gray-100 text-gray-700'}`}>
                            ⚑ {REASON_LABELS[report.reason] || report.reason}
                          </span>
                          <span className="text-xs text-gray-400">{formatRelativeTime(report.createdAt)}</span>
                        </div>
                        <Link href={`/ad/${report.ad.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-pm transition-colors text-sm line-clamp-1">{report.ad.title}</h3>
                        </Link>
                        <p className="text-pm font-bold text-sm mt-0.5">{formatPrice(report.ad.price)}</p>

                        {/* Parties */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="bg-gray-50 rounded-lg p-2.5">
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Ad owner</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <User className="h-3 w-3 text-gray-400" />
                              <p className="text-xs font-medium text-gray-700 truncate">{report.ad.user.name}</p>
                            </div>
                            <p className="text-[10px] text-gray-400 truncate">{report.ad.user.email}</p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-2.5">
                            <p className="text-[9px] text-red-400 uppercase tracking-wider">Reported by</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Flag className="h-3 w-3 text-red-400" />
                              <p className="text-xs font-medium text-red-700 truncate">{report.reporter.name}</p>
                            </div>
                            <p className="text-[10px] text-red-400 truncate">{report.reporter.email}</p>
                          </div>
                        </div>

                        {report.description && (
                          <div className="mt-3 bg-orange-50 border border-orange-100 rounded-lg p-3">
                            <p className="text-xs text-orange-700 leading-relaxed">
                              <strong>Note:</strong> {report.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions — 1/4 */}
                  <div className="p-5 flex flex-col justify-center gap-3">
                    <Link href={`/ad/${report.ad.id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full gap-2 rounded-xl text-xs">
                        <Eye className="h-3.5 w-3.5" /> View Ad
                      </Button>
                    </Link>

                    {report.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl text-xs"
                          disabled={processingId === report.id}
                          onClick={() => handleProcess(report.id, 'RESOLVED')}
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Resolve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-gray-500 gap-2 rounded-xl text-xs"
                          disabled={processingId === report.id}
                          onClick={() => handleProcess(report.id, 'DISMISSED')}
                        >
                          <XCircle className="h-3.5 w-3.5" /> Dismiss
                        </Button>
                      </>
                    )}

                    {report.status === 'RESOLVED' && (
                      <div className="text-center bg-emerald-50 rounded-xl p-3 text-emerald-700">
                        <CheckCircle className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs font-semibold">Resolved</p>
                        {report.resolvedAt && <p className="text-[10px] text-emerald-500 mt-0.5">{formatRelativeTime(report.resolvedAt)}</p>}
                      </div>
                    )}

                    {report.status === 'DISMISSED' && (
                      <div className="text-center bg-gray-100 rounded-xl p-3 text-gray-500">
                        <XCircle className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs font-semibold">Dismissed</p>
                        {report.resolvedAt && <p className="text-[10px] text-gray-400 mt-0.5">{formatRelativeTime(report.resolvedAt)}</p>}
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
          <AlertTriangle className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {activeTab} reports</p>
          <p className="text-sm text-gray-400">This section is clear</p>
        </div>
      )}
    </div>
  );
}
