'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Ban, CheckCircle, User, Search, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { formatDate, getInitials } from '@/lib/utils';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: 'USER' | 'ADMIN';
  isBanned: boolean;
  createdAt: string;
  _count: {
    ads: number;
  };
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users?status=${activeTab}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBan = async (userId: string, isBanned: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isBanned }),
      });

      if (response.ok) {
        toast({
          title: isBanned ? 'User Banned' : 'User Unbanned',
          description: `The user has been ${isBanned ? 'banned' : 'unbanned'} successfully.`,
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-gray-500 mt-1">View and manage all users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="banned">
            Banned
            {users.filter((u) => u.isBanned).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {users.filter((u) => u.isBanned).length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Avatar & Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={user.profileImage || undefined} />
                          <AvatarFallback className="bg-olx text-white text-lg">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            {user.role === 'ADMIN' && (
                              <Badge variant="default" className="bg-purple-500">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {user.isBanned && (
                              <Badge variant="destructive">Banned</Badge>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span>{user.phone}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span>Joined {formatDate(user.createdAt)}</span>
                            <span>{user._count.ads} ads</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {user.role !== 'ADMIN' && (
                          <Button
                            variant={user.isBanned ? 'outline' : 'destructive'}
                            size="sm"
                            onClick={() => handleBan(user.id, !user.isBanned)}
                            className={user.isBanned ? 'text-green-600' : ''}
                          >
                            {user.isBanned ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Unban
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-1" />
                                Ban
                              </>
                            )}
                          </Button>
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
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No users found</h2>
                <p className="text-gray-500">
                  {searchQuery ? 'Try a different search term' : 'No users in this category'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
