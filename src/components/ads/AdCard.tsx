'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, Star, Clock, Zap } from 'lucide-react';
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
    createdAt: Date | string;
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

  const price = typeof ad.price === 'object' ? ad.price.toNumber() : ad.price;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast({ title: 'Login Required', description: 'Please login to save listings.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        const r = await fetch(`/api/favorites?adId=${ad.id}`, { method: 'DELETE' });
        if (r.ok) { setIsFavorite(false); toast({ title: 'Removed from Saved' }); }
      } else {
        const r = await fetch('/api/favorites', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adId: ad.id }),
        });
        if (r.ok) { setIsFavorite(true); toast({ title: 'Listing Saved!' }); }
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally { setIsLoading(false); }
  };

  return (
    <Link href={`/ad/${ad.id}`} className="block group">
      <div className={`relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
        ad.isFeatured
          ? 'border-amber-200 shadow-md shadow-amber-100/60'
          : 'border-gray-100 shadow-sm'
      }`}>

        {/* Featured glow strip */}
        {ad.isFeatured && (
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
        )}

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
          <Image
            src={ad.images[0] || '/images/placeholder.jpg'}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Featured badge */}
          {ad.isFeatured && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Star className="h-2.5 w-2.5 fill-white" /> Featured
            </div>
          )}

          {/* Condition badge */}
          <div className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            ad.condition === 'NEW'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-800/70 text-white backdrop-blur-sm'
          }`}>
            {ad.condition === 'NEW' ? 'New' : 'Used'}
          </div>

          {/* Save button */}
          {showFavorite && (
            <button
              onClick={handleFavorite}
              disabled={isLoading}
              className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 ${
                isFavorite ? 'bg-red-50' : 'bg-white/90 hover:bg-white'
              }`}
            >
              <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Price */}
          <p className="text-lg font-extrabold text-pm leading-tight mb-1">
            {formatPrice(price)}
          </p>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2.5">
            {truncateText(ad.title, 55)}
          </h3>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{ad.city}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 ml-2">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(ad.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
