'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  Users,
  Star,
  Flag,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Ads', href: '/admin/ads', icon: Package },
  { label: 'Stores', href: '/admin/stores', icon: Store },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Feature Requests', href: '/admin/feature-requests', icon: Star },
  { label: 'Reports', href: '/admin/reports', icon: Flag },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-olx-light">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Admin</span>
          <span className="text-xl font-bold text-olx-accent">Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-olx-accent text-olx'
                      : 'text-gray-300 hover:bg-olx-light hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-olx-light">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-olx-light">
            Back to Site
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-olx-light mt-2"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-olx flex-col z-50">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-olx text-white hover:bg-olx-light"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-olx p-0 border-r-olx-light">
          <div className="flex flex-col h-full">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
