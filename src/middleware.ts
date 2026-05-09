import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Routes that admin users are NOT allowed to access (user-only features)
const ADMIN_BLOCKED_ROUTES = ['/post-ad', '/my-ads', '/favorites', '/chat', '/feature-ad'];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token }    = req.nextauth;

    // Protect admin routes — only ADMIN role allowed
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Block admins from user-only routes → redirect to their dashboard
    if (token?.role === 'ADMIN') {
      const isBlocked = ADMIN_BLOCKED_ROUTES.some((r) => pathname.startsWith(r));
      if (isBlocked) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const publicRoutes = ['/', '/login', '/register', '/search', '/ad/', '/category/', '/api/ads', '/api/categories'];
        const isPublic     = publicRoutes.some((r) => req.nextUrl.pathname.startsWith(r));
        if (isPublic) return true;
        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/profile/:path*',
    '/my-ads/:path*',
    '/favorites/:path*',
    '/chat/:path*',
    '/post-ad/:path*',
    '/edit-ad/:path*',
    '/feature-ad/:path*',
    '/notifications/:path*',
    '/api/ads/my-ads',
    '/api/favorites/:path*',
    '/api/chat/:path*',
    '/api/feature-request/:path*',
    '/api/reports/:path*',
  ],
};
