'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShoppingBag,
  Bell,
  Smartphone,
  Car,
  Building2,
  Tv,
  Bike,
  Briefcase,
  Wrench,
  ChevronDown,
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

// Icon map for dynamic categories fetched from API
const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone, Car, Building2, Tv, Bike, Briefcase, Wrench,
};

// Fallback static list shown before API responds (prevents layout shift)
const FALLBACK_CATEGORIES = [
  { label: 'Mobiles',     slug: 'mobiles',     icon: Smartphone },
  { label: 'Cars',        slug: 'vehicles',    icon: Car },
  { label: 'Property',    slug: 'property-for-sale', icon: Building2 },
  { label: 'Electronics', slug: 'electronics-home-appliances', icon: Tv },
  { label: 'Bikes',       slug: 'bikes',       icon: Bike },
  { label: 'Jobs',        slug: 'jobs',        icon: Briefcase },
  { label: 'Services',    slug: 'services',    icon: Wrench },
];

// ---------------------------------------------------------------------------
// Reusable badge that shows a numeric count
// ---------------------------------------------------------------------------
function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface ApiCategory { id: string; name: string; slug: string; icon?: string; }

export default function Navbar() {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [navCategories, setNavCategories] = useState(FALLBACK_CATEGORIES);

  const user = session?.user;

  // Detect page scroll so we can add a subtle shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch categories dynamically from API
  useEffect(() => {
    fetch('/api/categories?limit=8')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setNavCategories(
            data.data.slice(0, 8).map((c: ApiCategory) => ({
              label: c.name,
              slug: c.slug,
              icon: ICON_MAP[c.icon || ''] || Smartphone,
            }))
          );
        }
      })
      .catch(() => {/* keep fallback */});
  }, []);

  // Poll for unread message count every 30 seconds
  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/chat/unread-count');
        const data = await response.json();
        if (data.success) setUnreadCount(data.data.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Sticky header wrapper                                               */}
      {/* ------------------------------------------------------------------ */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-shadow duration-200',
          scrolled && 'shadow-lg',
        )}
      >
        {/* ---- Announcement bar ----------------------------------------- */}
        <div className="bg-pm-yellow text-pm text-center text-xs font-semibold py-1.5 px-4 tracking-wide">
          🇵🇰 Pakistan&apos;s #1 Free Classified Marketplace — Post Ads for Free!
        </div>

        {/* ---- Main nav bar ---------------------------------------------- */}
        <div className="bg-pm text-white">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between gap-4">

              {/* Logo */}
              <Link href="/" className="flex shrink-0 items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pm-accent/20 ring-1 ring-pm-accent/40 transition-all group-hover:bg-pm-accent/30">
                  <ShoppingBag className="h-5 w-5 text-pm-accent" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Pakistan
                </span>
                <span className="text-xl font-extrabold tracking-tight text-pm-accent">
                  Market
                </span>
              </Link>

              {/* Search bar – desktop */}
              <div className="hidden flex-1 max-w-2xl md:block">
                <form action="/search" className="relative">
                  <input
                    type="text"
                    name="q"
                    placeholder="Search mobiles, cars, properties, electronics…"
                    className="w-full h-10 pl-10 pr-4 rounded-full border-2 border-transparent bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-pm-accent focus:bg-white/20 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                </form>
              </div>

              {/* Right-side actions */}
              <div className="flex items-center gap-1">

                {/* Mobile search toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/10"
                  onClick={() => setIsSearchOpen((v) => !v)}
                  aria-label="Toggle search"
                >
                  {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>

                {/* Post Ad – desktop */}
                <Link href="/post-ad" className="hidden sm:block ml-1">
                  <Button className="bg-pm-yellow text-pm font-semibold hover:bg-pm-yellow/90 gap-2 rounded-full px-5 shadow-sm">
                    <Plus className="h-4 w-4" />
                    Sell Now
                  </Button>
                </Link>

                {user ? (
                  <>
                    {/* Favorites */}
                    <Link href="/favorites" className="hidden sm:block">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 relative"
                        aria-label="Favourites"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </Link>

                    {/* Messages */}
                    <Link href="/chat" className="hidden sm:block">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 relative"
                        aria-label="Messages"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <CountBadge count={unreadCount} />
                      </Button>
                    </Link>

                    {/* Notifications */}
                    <Link href="/notifications" className="hidden sm:block">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 relative"
                        aria-label="Notifications"
                      >
                        <Bell className="h-5 w-5" />
                        <CountBadge count={unreadCount} />
                      </Button>
                    </Link>

                    {/* User dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="hidden sm:flex items-center gap-2 text-white hover:bg-white/10 rounded-full pl-1 pr-2"
                        >
                          <Avatar className="h-8 w-8 ring-2 ring-pm-accent/60">
                            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                            <AvatarFallback className="bg-pm-light text-pm-accent text-xs font-semibold">
                              {getInitials(user.name || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
                            {user.name?.split(' ')[0]}
                          </span>
                          <ChevronDown className="h-3.5 w-3.5 text-white/60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-pm to-pm-light rounded-t-md">
                          <Avatar className="h-10 w-10 ring-2 ring-pm-accent/60">
                            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                            <AvatarFallback className="bg-pm-light text-pm-accent text-sm font-semibold">
                              {getInitials(user.name || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-white/60 truncate">{user.email}</p>
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
                          className="cursor-pointer text-red-500 focus:text-red-500"
                          onClick={() => signOut({ callbackUrl: '/' })}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="text-white/90 hover:text-white hover:bg-white/10 font-medium border border-white/20 hover:border-white/40 transition-all"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-pm-yellow text-pm font-bold hover:bg-pm-yellow/90 rounded-full px-5 shadow-sm">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile hamburger – always visible */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10 lg:hidden ml-1"
                      aria-label="Open menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>

                  {/* ---- Mobile drawer ------------------------------------ */}
                  <SheetContent side="right" className="w-[300px] p-0 bg-white flex flex-col">

                    {/* Drawer header */}
                    {user ? (
                      <div className="flex items-center gap-3 p-5 bg-gradient-to-br from-pm to-pm-light">
                        <Avatar className="h-12 w-12 ring-2 ring-pm-accent/60 shrink-0">
                          <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                          <AvatarFallback className="bg-pm-light text-pm-accent font-semibold">
                            {getInitials(user.name || 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-base font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-white/60 truncate">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-5 bg-gradient-to-br from-pm to-pm-light">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-6 w-6 text-pm-accent" />
                          <span className="text-lg font-extrabold text-white">Pakistan</span>
                          <span className="text-lg font-extrabold text-pm-accent">Market</span>
                        </div>
                      </div>
                    )}

                    {/* Drawer nav links */}
                    <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">

                      {/* Post Ad highlight */}
                      <Link
                        href="/post-ad"
                        className="flex items-center gap-3 rounded-lg bg-pm-yellow text-pm font-semibold px-4 py-3 mb-2 hover:bg-pm-yellow/90 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                        Post an Ad — Free!
                      </Link>

                      {/* Categories */}
                      <p className="mt-2 mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Categories
                      </p>
                      {navCategories.map(({ label, slug, icon: Icon }) => (
                        <Link
                          key={slug}
                          href={`/search?category=${slug}`}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-pm/5 hover:text-pm transition-colors"
                        >
                          <Icon className="h-4 w-4 text-pm shrink-0" />
                          {label}
                        </Link>
                      ))}

                      <div className="my-3 border-t border-gray-100" />

                      {/* General links */}
                      <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Menu
                      </p>
                      <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        Home
                      </Link>
                      <Link href="/search" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        Browse Ads
                      </Link>

                      {user ? (
                        <>
                          <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <User className="h-4 w-4 text-pm shrink-0" />
                            Profile
                          </Link>
                          <Link href="/my-ads" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <LayoutDashboard className="h-4 w-4 text-pm shrink-0" />
                            My Ads
                          </Link>
                          <Link href="/stores/my-store" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <Store className="h-4 w-4 text-pm shrink-0" />
                            My Store
                          </Link>
                          <Link href="/favorites" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <Heart className="h-4 w-4 text-pm shrink-0" />
                            Favourites
                          </Link>
                          <Link href="/chat" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <MessageSquare className="h-4 w-4 text-pm shrink-0" />
                            Messages
                            {unreadCount > 0 && (
                              <Badge className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </Badge>
                            )}
                          </Link>
                          <Link href="/notifications" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <Bell className="h-4 w-4 text-pm shrink-0" />
                            Notifications
                          </Link>
                          {user.role === 'ADMIN' && (
                            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                              <LayoutDashboard className="h-4 w-4 text-pm shrink-0" />
                              Admin Dashboard
                            </Link>
                          )}
                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="h-4 w-4 shrink-0" />
                              Logout
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="mt-4 flex flex-col gap-2">
                          <Link href="/login">
                            <Button variant="outline" className="w-full border-pm text-pm font-semibold">
                              Login
                            </Button>
                          </Link>
                          <Link href="/register">
                            <Button className="w-full bg-pm-accent text-pm font-semibold hover:bg-pm-accent/90">
                              Register
                            </Button>
                          </Link>
                        </div>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Mobile search – slides in below the main bar */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden md:hidden"
                >
                  <div className="pb-4 pt-1">
                    <form action="/search" className="relative">
                      <input
                        type="text"
                        name="q"
                        autoFocus
                        placeholder="Search for anything…"
                        className="w-full h-10 pl-10 pr-4 rounded-full border-2 border-pm-accent/60 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-pm-accent transition-all"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---- Category shortcut bar ------------------------------------- */}
        <div className="bg-pm-light border-t border-white/10">
          <div className="container mx-auto px-4">
            {/* On mobile this scrolls horizontally; on desktop it's a row */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              {navCategories.map(({ label, slug, icon: Icon }) => (
                <Link
                  key={slug}
                  href={`/search?category=${slug}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-pm-accent/20 hover:text-pm-accent transition-all whitespace-nowrap"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
              <Link
                href="/categories"
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-pm-accent/80 hover:bg-pm-accent/20 hover:text-pm-accent transition-all whitespace-nowrap ml-auto"
              >
                All Categories →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile floating "Post Ad" button                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-6 right-5 z-40 sm:hidden">
        <Link href="/post-ad">
          <motion.button
            whileTap={{ scale: 0.93 }}
            className="flex items-center gap-2 rounded-full bg-pm-yellow text-pm font-bold px-5 py-3 shadow-xl ring-2 ring-pm-yellow/40"
          >
            <Plus className="h-5 w-5" />
            Post Ad
          </motion.button>
        </Link>
      </div>
    </>
  );
}
