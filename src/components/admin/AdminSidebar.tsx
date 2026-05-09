'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Users, Star, Flag,
  Settings, LogOut, Menu, X, Tag, ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard',        href: '/admin',                  icon: LayoutDashboard },
  { label: 'Manage Ads',       href: '/admin/ads',              icon: Package         },
  { label: 'Users',            href: '/admin/users',            icon: Users           },
  { label: 'Feature Requests', href: '/admin/feature-requests', icon: Star            },
  { label: 'Reports',          href: '/admin/reports',          icon: Flag            },
  { label: 'Categories',       href: '/admin/categories',       icon: Tag             },
  { label: 'Settings',         href: '/admin/settings',         icon: Settings        },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full bg-pm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-pm-yellow flex items-center justify-center shadow">
            <span className="font-black text-pm text-sm">PM</span>
          </div>
          <div>
            <span className="font-extrabold text-white text-base leading-none block">Pakistan</span>
            <span className="text-pm-accent text-[10px] font-semibold tracking-widest uppercase">Admin Panel</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-pm-accent text-pm shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-pm' : 'text-white/50 group-hover:text-white')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-pm/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin profile */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {session?.user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={session.user.image || undefined} />
              <AvatarFallback className="bg-pm-yellow text-pm text-xs font-bold">
                {getInitials(session.user.name || 'A')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{session.user.name}</p>
              <p className="text-white/40 text-[10px] truncate">Administrator</p>
            </div>
          </div>
        )}
        <Link href="/" className="block">
          <Button variant="ghost" size="sm" className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 gap-2 text-xs">
            <Home className="h-3.5 w-3.5" /> Back to Site
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-white/10 gap-2 text-xs"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-3.5 w-3.5" /> Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 z-50 flex-col shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile burger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-pm text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 shadow-2xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
