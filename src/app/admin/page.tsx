'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Package,
  Clock,
  Star,
  Flag,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate, getInitials } from '@/lib/utils';

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
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Ads',
      value: stats?.totalAds || 0,
      icon: Package,
      href: '/admin/ads',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Ads',
      value: stats?.pendingAds || 0,
      icon: Clock,
      href: '/admin/ads?status=pending',
      color: 'bg-yellow-500',
    },
    {
      title: 'Featured Ads',
      value: stats?.featuredAds || 0,
      icon: Star,
      href: '/admin/ads?status=featured',
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingFeatureRequests || 0,
      icon: TrendingUp,
      href: '/admin/feature-requests',
      color: 'bg-pink-500',
    },
    {
      title: 'Pending Reports',
      value: stats?.totalReports || 0,
      icon: Flag,
      href: '/admin/reports',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{card.title}</p>
                          <p className="text-3xl font-bold mt-1">{card.value}</p>
                        </div>
                        <div className={`${card.color} p-3 rounded-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : stats?.recentUsers?.length ? (
              <div className="space-y-4">
                {stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={user.profileImage || undefined} />
                      <AvatarFallback className="bg-olx text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent users</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Ads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Ads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : stats?.recentAds?.length ? (
              <div className="space-y-4">
                {stats.recentAds.map((ad) => (
                  <Link key={ad.id} href={`/ad/${ad.id}`}>
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        {ad.images[0] && (
                          <img
                            src={ad.images[0]}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{ad.title}</p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(ad.price)} • {ad.category.name}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          ad.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {ad.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent ads</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
