'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatRelativeTime, truncateText } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    price: number | { toString(): string; toNumber(): number };
    images: string[];
    city: string;
    condition: 'NEW' | 'USED';
    isFeatured: boolean;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      profileImage: string | null;
    };
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  showFavorite?: boolean;
}

export function AdCard({ ad, showFavorite = true }: AdCardProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const price = typeof ad.price === 'object' ? ad.price.toNumber() : ad.price;

  return (
    <Link href={`/ad/${ad.id}`}>
      <div className="ad-card group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={ad.images[0] || '/images/placeholder.jpg'}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Featured Badge */}
          {ad.isFeatured && (
            <Badge
              variant="featured"
              className="absolute top-2 left-2 z-10"
            >
              Featured
            </Badge>
          )}

          {/* Condition Badge */}
          <Badge
            variant={ad.condition === 'NEW' ? 'success' : 'secondary'}
            className="absolute top-2 right-2 z-10"
          >
            {ad.condition === 'NEW' ? 'New' : 'Used'}
          </Badge>

          {/* Favorite Button */}
          {showFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleFavorite}
              disabled={isLoading}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <p className="text-xl font-bold text-olx mb-1">
            {formatPrice(price)}
          </p>

          {/* Title */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {truncateText(ad.title, 50)}
          </h3>

          {/* Location & Time */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{ad.city}</span>
            </div>
            <span>{formatRelativeTime(ad.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
