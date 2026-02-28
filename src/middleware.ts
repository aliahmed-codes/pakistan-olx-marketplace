import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Protect admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow public routes
        const publicRoutes = ['/', '/login', '/register', '/search', '/ad/', '/category/', '/api/ads', '/api/categories'];
        const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));
        
        if (isPublicRoute) return true;
        
        // Require auth for protected routes
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
    '/api/ads/my-ads',
    '/api/favorites/:path*',
    '/api/chat/:path*',
    '/api/feature-request/:path*',
    '/api/reports/:path*',
  ],
};
