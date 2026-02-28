'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  User,
  LogOut,
  Heart,
  MessageSquare,
  Menu,
  X,
  LayoutDashboard,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getInitials } from '@/lib/utils';

export default function Navbar() {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = session?.user;

  // Fetch unread message count
  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/chat/unread-count');
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.data.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-olx">Pakistan</span>
            <span className="text-2xl font-bold text-olx-accent">Market</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-xl md:block">
            <form action="/search" className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search for anything..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-olx-accent focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Post Ad Button */}
            <Link href="/post-ad" className="hidden sm:block">
              <Button className="bg-olx hover:bg-olx-light gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Sell</span>
              </Button>
            </Link>

            {user ? (
              <>
                {/* Favorites */}
                <Link href="/favorites">
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Messages */}
                <Link href="/chat">
                  <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                    <MessageSquare className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                        <AvatarFallback className="bg-olx text-white">
                          {getInitials(user.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                        <AvatarFallback className="bg-olx text-white text-xs">
                          {getInitials(user.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-ads" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Ads
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/stores/my-store" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        My Store
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="cursor-pointer sm:hidden">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/chat" className="cursor-pointer sm:hidden">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'ADMIN' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-olx-accent text-olx hover:bg-olx-accent/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                  <Link href="/search" className="text-lg font-medium">
                    Browse Ads
                  </Link>
                  <Link href="/post-ad" className="text-lg font-medium">
                    Post an Ad
                  </Link>
                  {!user && (
                    <>
                      <Link href="/login" className="text-lg font-medium">
                        Login
                      </Link>
                      <Link href="/register" className="text-lg font-medium">
                        Register
                      </Link>
                    </>
                  )}
                  {user && (
                    <>
                      <Link href="/profile" className="text-lg font-medium">
                        Profile
                      </Link>
                      <Link href="/my-ads" className="text-lg font-medium">
                        My Ads
                      </Link>
                      <Link href="/favorites" className="text-lg font-medium">
                        Favorites
                      </Link>
                      <Link href="/chat" className="text-lg font-medium">
                        Messages
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" className="text-lg font-medium">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-lg font-medium text-red-600 text-left"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="pb-4 md:hidden">
            <form action="/search" className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search for anything..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-olx-accent focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
