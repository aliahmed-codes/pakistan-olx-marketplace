'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, Package, Clock, Star, Flag, TrendingUp, Eye,
  ArrowUpRight, ChevronRight, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate, formatRelativeTime, getInitials } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  totalAds: number;
  pendingAds: number;
  featuredAds: number;
  pendingFeatureRequests: number;
  totalReports: number;
  recentUsers: any[];
  recentAds: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    { title: 'Total Users',       value: stats?.totalUsers ?? 0,              icon: Users,      gradient: 'from-blue-500 to-indigo-600',    href: '/admin/users' },
    { title: 'Total Ads',         value: stats?.totalAds ?? 0,                icon: Package,    gradient: 'from-emerald-500 to-teal-600',   href: '/admin/ads' },
    { title: 'Pending Approval',  value: stats?.pendingAds ?? 0,              icon: Clock,      gradient: 'from-amber-500 to-orange-600',   href: '/admin/ads?status=pending' },
    { title: 'Featured Ads',      value: stats?.featuredAds ?? 0,             icon: Star,       gradient: 'from-purple-500 to-violet-600',  href: '/admin/ads?status=featured' },
    { title: 'Feature Requests',  value: stats?.pendingFeatureRequests ?? 0,  icon: TrendingUp, gradient: 'from-pink-500 to-rose-600',      href: '/admin/feature-requests' },
    { title: 'Open Reports',      value: stats?.totalReports ?? 0,            icon: Flag,       gradient: 'from-red-500 to-rose-700',       href: '/admin/reports' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back — here&apos;s what&apos;s happening today</p>
      </div>

      {/* Alerts */}
      {(stats?.pendingAds ?? 0) > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <strong>{stats?.pendingAds}</strong> ad{(stats?.pendingAds ?? 0) > 1 ? 's' : ''} waiting for your approval.
          </p>
          <Link href="/admin/ads?status=pending">
            <Badge className="bg-amber-500 hover:bg-amber-600 gap-1 cursor-pointer">
              Review <ArrowUpRight className="h-3 w-3" />
            </Badge>
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const hasAlert = card.value > 0 && (card.title.includes('Pending') || card.title.includes('Report'));
          return (
            <Link key={card.title} href={card.href}>
              <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden`}>
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="flex items-center justify-between relative">
                  <div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{card.title}</p>
                    <p className="text-3xl font-extrabold mt-1">{card.value.toLocaleString()}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                {hasAlert && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-gray-50/50 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">Recent Users</CardTitle>
            <Link href="/admin/users">
              <span className="text-xs text-pm font-medium flex items-center gap-1 hover:underline">
                View All <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats?.recentUsers?.length ? (
              <div className="divide-y divide-gray-50">
                {stats.recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profileImage || undefined} />
                      <AvatarFallback className="bg-pm text-white text-xs font-bold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {user.role === 'ADMIN' && (
                        <Badge className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0">Admin</Badge>
                      )}
                      <p className="text-[10px] text-gray-400 mt-0.5">{formatRelativeTime(user.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-10">No recent users</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Ads */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-gray-50/50 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">Recent Ads</CardTitle>
            <Link href="/admin/ads">
              <span className="text-xs text-pm font-medium flex items-center gap-1 hover:underline">
                View All <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats?.recentAds?.length ? (
              <div className="divide-y divide-gray-50">
                {stats.recentAds.map((ad: any) => (
                  <Link key={ad.id} href={`/ad/${ad.id}`}>
                    <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-11 h-11 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {ad.images?.[0] && (
                          <img src={ad.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{ad.title}</p>
                        <p className="text-xs text-gray-400">
                          {formatPrice(ad.price)} · {ad.category?.name}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {ad.isApproved ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Pending</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-10">No recent ads</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
