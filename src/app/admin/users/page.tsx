'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Ban, CheckCircle, Search, Shield, Mail, Phone, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { formatDate, getInitials, formatRelativeTime } from '@/lib/utils';

interface UserData {
  id: string; name: string; email: string;
  phone: string | null; profileImage: string | null;
  role: 'USER' | 'ADMIN'; isBanned: boolean;
  createdAt: string; emailVerified: string | null;
  _count: { ads: number };
}

const TABS = [
  { label: 'All Users', value: 'all' },
  { label: 'Active',    value: 'active' },
  { label: 'Banned',    value: 'banned' },
  { label: 'Admins',    value: 'admin' },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users?status=${activeTab}`);
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [activeTab]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleBan = async (userId: string, isBanned: boolean) => {
    setProcessingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isBanned }),
      });
      if (res.ok) {
        toast({ title: isBanned ? 'User banned' : 'User unbanned ✅' });
        fetchUsers();
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setProcessingId(null); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.phone || '').includes(searchQuery)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name, email, phone…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-72 bg-white border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          const count = tab.value === 'banned' ? users.filter((u) => u.isBanned).length
            : tab.value === 'admin' ? users.filter((u) => u.role === 'ADMIN').length : null;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive ? 'bg-pm text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
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

      {/* User list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((user) => (
            <Card key={user.id} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Avatar className="h-12 w-12 shrink-0 ring-2 ring-white shadow">
                    <AvatarImage src={user.profileImage || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-pm to-pm-light text-white font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.role === 'ADMIN' && (
                        <Badge className="bg-purple-100 text-purple-700 gap-1 text-[10px] px-1.5 py-0">
                          <Shield className="h-3 w-3" /> Admin
                        </Badge>
                      )}
                      {user.emailVerified && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0">Verified</Badge>
                      )}
                      {user.isBanned && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Banned</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{user.email}</span>
                      {user.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{user.phone}</span>}
                      <span className="flex items-center gap-1"><Package className="h-3 w-3" />{user._count.ads} ads</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {formatRelativeTime(user.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {user.role !== 'ADMIN' && (
                    <Button
                      variant={user.isBanned ? 'outline' : 'destructive'}
                      size="sm"
                      disabled={processingId === user.id}
                      onClick={() => handleBan(user.id, !user.isBanned)}
                      className={`rounded-xl gap-1.5 text-xs shrink-0 ${user.isBanned ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' : ''}`}
                    >
                      {user.isBanned ? <><CheckCircle className="h-3.5 w-3.5" /> Unban</> : <><Ban className="h-3.5 w-3.5" /> Ban</>}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400">No users found</p>
        </div>
      )}
    </div>
  );
}
