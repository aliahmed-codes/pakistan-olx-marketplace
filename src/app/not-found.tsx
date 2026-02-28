'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="text-9xl font-bold text-olx/10">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-6 rounded-full shadow-lg">
                  <Search className="h-16 w-16 text-olx" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Quick Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Link href="/">
              <Button className="bg-olx hover:bg-olx-light gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Popular Links */}
          <div className="mt-12">
            <p className="text-gray-500 mb-4">Popular Pages</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/search">
                <Button variant="outline" size="sm">
                  Browse Ads
                </Button>
              </Link>
              <Link href="/post-ad">
                <Button variant="outline" size="sm">
                  Post an Ad
                </Button>
              </Link>
              <Link href="/category/mobiles">
                <Button variant="outline" size="sm">
                  Mobiles
                </Button>
              </Link>
              <Link href="/category/cars">
                <Button variant="outline" size="sm">
                  Cars
                </Button>
              </Link>
              <Link href="/category/property">
                <Button variant="outline" size="sm">
                  Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
