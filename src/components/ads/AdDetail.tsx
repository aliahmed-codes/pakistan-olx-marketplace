'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  Flag,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice, formatDate, formatRelativeTime, getInitials } from '@/lib/utils';
import { AdCard } from './AdCard';

interface AdDetailProps {
  ad: {
    id: string;
    title: string;
    description: string;
    price: number | { toString(): string; toNumber(): number };
    images: string[];
    city: string;
    area: string | null;
    phone: string | null;
    condition: 'NEW' | 'USED';
    isApproved: boolean;
    isFeatured: boolean;
    status: string;
    views: number;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      profileImage: string | null;
      phone: string | null;
      createdAt: Date;
    };
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  relatedAds: any[];
  isFavorite: boolean;
  isOwner: boolean;
}

export function AdDetail({ ad, relatedAds, isFavorite: initialIsFavorite, isOwner }: AdDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const price = typeof ad.price === 'object' ? ad.price.toNumber() : ad.price;

  const handleFavorite = async () => {
    if (!session?.user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to favorites.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites?adId=${ad.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsFavorite(false);
          toast({
            title: 'Removed from Favorites',
            description: 'The ad has been removed from your favorites.',
          });
        }
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adId: ad.id }),
        });

        if (response.ok) {
          setIsFavorite(true);
          toast({
            title: 'Added to Favorites',
            description: 'The ad has been added to your favorites.',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = async () => {
    if (!session?.user) {
      toast({
        title: 'Login Required',
        description: 'Please login to contact the seller.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/chat?conversation=${data.data.id}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: ad.title,
        text: `Check out this ${ad.title} on Pakistan Marketplace`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'The link has been copied to your clipboard.',
      });
    }
  };

  const handleReport = async () => {
    if (!session?.user) {
      toast({
        title: 'Login Required',
        description: 'Please login to report this ad.',
        variant: 'destructive',
      });
      return;
    }

    router.push(`/report?adId=${ad.id}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === ad.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? ad.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-olx">
          Home
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <Link href={`/category/${ad.category.slug}`} className="hover:text-olx">
          {ad.category.name}
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-gray-900 truncate max-w-[200px]">{ad.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-[4/3] relative">
              <Image
                src={ad.images[currentImageIndex] || '/images/placeholder.jpg'}
                alt={ad.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>

            {/* Image Navigation */}
            {ad.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {ad.images.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {ad.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {ad.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex
                      ? 'border-olx-accent'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${ad.title} - ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Ad Details */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {ad.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {ad.city}
                      {ad.area && `, ${ad.area}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatRelativeTime(ad.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {ad.views} views
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavorite}
                    disabled={isLoading}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleReport}>
                    <Flag className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-olx mb-6">
                {formatPrice(price)}
              </p>

              {/* Badges */}
              <div className="flex gap-2 mb-6">
                <Badge variant={ad.condition === 'NEW' ? 'success' : 'secondary'}>
                  {ad.condition === 'NEW' ? 'New' : 'Used'}
                </Badge>
                {ad.isFeatured && <Badge variant="featured">Featured</Badge>}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Seller Info & Actions */}
        <div className="space-y-6">
          {/* Price Card (Mobile) */}
          <Card className="lg:hidden">
            <CardContent className="p-6">
              <p className="text-3xl font-bold text-olx">
                {formatPrice(price)}
              </p>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={ad.user.profileImage || undefined} />
                  <AvatarFallback className="bg-olx text-white text-xl">
                    {getInitials(ad.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{ad.user.name}</p>
                  <p className="text-sm text-gray-500">
                    Member since {formatDate(ad.user.createdAt)}
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}
              {!isOwner && (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-olx hover:bg-olx-light gap-2"
                    onClick={handleContact}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat with Seller
                  </Button>

                  {(ad.phone || ad.user.phone) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full gap-2">
                          <Phone className="h-5 w-5" />
                          Show Phone Number
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Seller&apos;s Phone Number</DialogTitle>
                          <DialogDescription>
                            Please mention Pakistan Marketplace when calling
                          </DialogDescription>
                        </DialogHeader>
                        <div className="text-center py-4">
                          <p className="text-2xl font-bold text-olx">
                            {ad.phone || ad.user.phone}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="space-y-3">
                  <Link href={`/edit-ad/${ad.id}`}>
                    <Button variant="outline" className="w-full">
                      Edit Ad
                    </Button>
                  </Link>
                  {!ad.isFeatured && (
                    <Link href={`/feature-ad/${ad.id}`}>
                      <Button className="w-full bg-olx-yellow text-olx hover:bg-olx-yellow/90">
                        Feature This Ad
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Safety Tips
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Meet in a safe public place
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Check the item before paying
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Never pay in advance
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Beware of unrealistic offers
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Ads */}
      {relatedAds.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Ads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
