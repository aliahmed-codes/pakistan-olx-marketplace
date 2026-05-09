'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Bell, MessageSquare, CheckCheck, CheckCircle, Package, Star, Flag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatRelativeTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string; type: string; title: string; body: string;
  link: string | null; isRead: boolean; createdAt: string;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  message:          MessageSquare,
  ad_approved:      CheckCircle,
  ad_rejected:      Package,
  feature_approved: Star,
  feature_rejected: Star,
  report:           Flag,
};

const TYPE_COLOR: Record<string, string> = {
  message:          'bg-blue-100 text-blue-600',
  ad_approved:      'bg-emerald-100 text-emerald-600',
  ad_rejected:      'bg-red-100 text-red-600',
  feature_approved: 'bg-amber-100 text-amber-600',
  feature_rejected: 'bg-red-100 text-red-600',
  report:           'bg-orange-100 text-orange-600',
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [isLoading, setIsLoading]         = useState(true);

  const { on } = useSocket(session?.user?.id);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/notifications');
  }, [status, router]);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res  = await fetch('/api/notifications?limit=50');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    if (session?.user) fetchNotifications();
  }, [session, fetchNotifications]);

  // Real-time: new notifications
  useEffect(() => {
    const off = on<{ notification: Notification }>('new-notification', ({ notification }) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    });
    return off;
  }, [on]);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markRead = async (n: Notification) => {
    if (!n.isRead) {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [n.id] }),
      });
      setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, isRead: true } : x));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (n.link) router.push(n.link);
  };

  if (status === 'loading') return <><Navbar /><main className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-pm" /></main><Footer /></>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f6fa]">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pm to-pm-light flex items-center justify-center shadow">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs" onClick={markAllRead}>
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </Button>
            )}
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="space-y-0 divide-y divide-gray-50">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2 mt-1">
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Bell className="h-14 w-14 text-gray-200 mb-4" />
                <p className="font-semibold text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">We&apos;ll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => {
                  const Icon     = TYPE_ICON[n.type] || Bell;
                  const colorCls = TYPE_COLOR[n.type] || 'bg-gray-100 text-gray-500';
                  return (
                    <button
                      key={n.id}
                      onClick={() => markRead(n)}
                      className={`w-full flex gap-4 p-4 text-left hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-pm/[0.03]' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold text-gray-900 leading-tight ${!n.isRead ? 'font-bold' : ''}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-gray-400 shrink-0">{formatRelativeTime(n.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                      </div>
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-pm shrink-0 mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
