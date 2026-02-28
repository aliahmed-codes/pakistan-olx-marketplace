import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AdDetail } from '@/components/ads/AdDetail';

interface AdPageProps {
  params: { id: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AdPageProps): Promise<Metadata> {
  const ad = await prisma.ad.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!ad || !ad.isApproved) {
    return {
      title: 'Ad Not Found - Pakistan Marketplace',
    };
  }

  const price = typeof ad.price === 'object' ? ad.price.toNumber() : ad.price;

  return {
    title: `${ad.title} - Rs ${price.toLocaleString()} - Pakistan Marketplace`,
    description: ad.description.slice(0, 160),
    openGraph: {
      title: ad.title,
      description: ad.description.slice(0, 160),
      images: ad.images.length > 0 ? [ad.images[0]] : undefined,
      type: 'article',
    },
  };
}

// Get ad details
async function getAd(id: string) {
  const session = await getServerSession(authOptions);

  const ad = await prisma.ad.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          phone: true,
          createdAt: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!ad) return null;

  // Check if user can view this ad
  const isOwner = session?.user?.id === ad.userId;
  const isAdmin = session?.user?.role === 'ADMIN';

  if (!ad.isApproved && !isOwner && !isAdmin) {
    return null;
  }

  // Get related ads
  const relatedAds = await prisma.ad.findMany({
    where: {
      categoryId: ad.categoryId,
      isApproved: true,
      id: { not: id },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  // Check if in favorites
  let isFavorite = false;
  if (session?.user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_adId: {
          userId: session.user.id,
          adId: id,
        },
      },
    });
    isFavorite = !!favorite;
  }

  return { ad, relatedAds, isFavorite, isOwner };
}

export default async function AdPage({ params }: AdPageProps) {
  const data = await getAd(params.id);

  if (!data) {
    notFound();
  }

  const { ad, relatedAds, isFavorite, isOwner } = data;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AdDetail
          ad={ad}
          relatedAds={relatedAds}
          isFavorite={isFavorite}
          isOwner={isOwner}
        />
      </main>
      <Footer />
    </>
  );
}
