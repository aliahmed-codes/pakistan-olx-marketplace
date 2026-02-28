import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pakistan Marketplace - Buy & Sell in Pakistan',
  description:
    'Pakistan\'s #1 classified marketplace. Buy, sell, and find anything you need. Mobiles, cars, property, electronics, jobs, and more.',
  keywords: [
    'Pakistan',
    'classifieds',
    'buy',
    'sell',
    'marketplace',
    'mobiles',
    'cars',
    'property',
    'electronics',
    'jobs',
  ],
  authors: [{ name: 'Pakistan Marketplace' }],
  openGraph: {
    title: 'Pakistan Marketplace - Buy & Sell in Pakistan',
    description:
      'Pakistan\'s #1 classified marketplace. Buy, sell, and find anything you need.',
    type: 'website',
    locale: 'en_PK',
    siteName: 'Pakistan Marketplace',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pakistan Marketplace - Buy & Sell in Pakistan',
    description:
      'Pakistan\'s #1 classified marketplace. Buy, sell, and find anything you need.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
