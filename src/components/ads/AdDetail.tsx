"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MapPin, Calendar, Eye, Heart, Share2, Flag, MessageCircle,
  ChevronLeft, ChevronRight, ShieldCheck, BadgeCheck, Star,
  Package, Tag, Clock, Edit, Zap, ChevronRight as Chevron,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice, formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import { AdCard } from "./AdCard";

interface AdDetailProps {
  ad: {
    id: string;
    title: string;
    description: string;
    price: number | { toString(): string; toNumber(): number };
    images: string[];
    city: string;
    area: string | null;
    condition: "NEW" | "USED";
    isApproved: boolean;
    isFeatured: boolean;
    status: string;
    views: number;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      profileImage: string | null;
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
  const [isContactLoading, setIsContactLoading] = useState(false);

  const price = typeof ad.price === "object" ? ad.price.toNumber() : ad.price;

  const handleFavorite = async () => {
    if (!session?.user) {
      toast({ title: "Login Required", description: "Please login to save listings.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      if (isFavorite) {
        const r = await fetch(`/api/favorites?adId=${ad.id}`, { method: "DELETE" });
        if (r.ok) { setIsFavorite(false); toast({ title: "Removed from Saved" }); }
      } else {
        const r = await fetch("/api/favorites", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adId: ad.id }),
        });
        if (r.ok) { setIsFavorite(true); toast({ title: "Listing Saved!" }); }
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleContact = async () => {
    if (!session?.user) {
      toast({ title: "Login Required", description: "Please login to contact the seller.", variant: "destructive" });
      return;
    }
    setIsContactLoading(true);
    try {
      const r = await fetch("/api/chat/conversations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: ad.user.id, adId: ad.id }),
      });
      if (r.ok) {
        const data = await r.json();
        router.push(`/chat?conversation=${data.data.id}`);
      }
    } catch {
      toast({ title: "Error", description: "Failed to start conversation.", variant: "destructive" });
    } finally { setIsContactLoading(false); }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: ad.title, text: `Check out this listing on Pakistan Market`, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied!", description: "Share it with anyone." });
    }
  };

  const nextImage = () => setCurrentImageIndex((p) => (p === ad.images.length - 1 ? 0 : p + 1));
  const prevImage = () => setCurrentImageIndex((p) => (p === 0 ? ad.images.length - 1 : p - 1));

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-pm transition-colors">Home</Link>
            <Chevron className="h-3 w-3 opacity-40" />
            <Link href={`/category/${ad.category.slug}`} className="hover:text-pm transition-colors">{ad.category.name}</Link>
            <Chevron className="h-3 w-3 opacity-40" />
            <span className="text-gray-800 font-medium truncate max-w-[240px]">{ad.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Gallery + Details ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Featured banner */}
              {ad.isFeatured && (
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 fill-white" /> Featured Listing — Higher Visibility
                </div>
              )}

              {/* Main image */}
              <div className="relative bg-gray-50" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={ad.images[currentImageIndex] || "/images/placeholder.jpg"}
                  alt={ad.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                {ad.images.length > 1 && (
                  <>
                    <button onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border border-gray-100 p-2 rounded-full transition-all hover:scale-110">
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border border-gray-100 p-2 rounded-full transition-all hover:scale-110">
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {currentImageIndex + 1} / {ad.images.length || 1}
                </div>
              </div>

              {/* Thumbnail strip */}
              {ad.images.length > 1 && (
                <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none border-t border-gray-50">
                  {ad.images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImageIndex(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === currentImageIndex ? "border-pm shadow-md scale-105" : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}>
                      <Image src={img} alt={`Photo ${i + 1}`} width={64} height={64} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing title + meta */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* Condition + category */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  ad.condition === "NEW"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <Package className="h-3 w-3" />
                  {ad.condition === "NEW" ? "Brand New" : "Pre-Owned"}
                </span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-pm font-medium flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {ad.category.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3">{ad.title}</h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-pm" />
                  {ad.city}{ad.area && `, ${ad.area}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  Listed {formatRelativeTime(ad.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-gray-400" />
                  {ad.views.toLocaleString()} views
                </span>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                <button onClick={handleFavorite} disabled={isLoading}
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all ${
                    isFavorite
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"
                  }`}>
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  {isFavorite ? "Saved" : "Save"}
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 transition-all">
                  <Share2 className="h-4 w-4" /> Share
                </button>
                {!isOwner && (
                  <button onClick={() => router.push(`/report?adId=${ad.id}`)}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400 transition-all ml-auto">
                    <Flag className="h-4 w-4" /> Report
                  </button>
                )}
              </div>
            </div>

            {/* Item specifics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4">Item Details</h2>
              <div className="grid grid-cols-2 gap-0 text-sm border border-gray-100 rounded-xl overflow-hidden">
                {[
                  { label: "Condition",  value: ad.condition === "NEW" ? "Brand New" : "Pre-Owned" },
                  { label: "Category",   value: ad.category.name },
                  { label: "Location",   value: ad.area ? `${ad.area}, ${ad.city}` : ad.city },
                  { label: "Listed",     value: formatDate(ad.createdAt) },
                  { label: "Listing ID", value: `#${ad.id.slice(-8).toUpperCase()}` },
                  { label: "Status",     value: ad.isApproved ? "Active" : "Pending Review" },
                ].map((row, i) => (
                  <div key={row.label} className={`flex flex-col px-4 py-3 ${
                    i % 2 === 0 ? "bg-gray-50/60" : "bg-white"
                  }`}>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{row.label}</span>
                    <span className="font-medium text-gray-800">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{ad.description}</p>
            </div>
          </div>

          {/* ── RIGHT: Price + Seller ───────────────────────────────── */}
          <div className="space-y-4">

            {/* Price card — sticky on desktop */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-4">
              {/* Price */}
              <p className="text-4xl font-extrabold text-pm mb-1">{formatPrice(price)}</p>
              <p className="text-xs text-gray-400 mb-5">Negotiable · Contact seller for offers</p>

              {/* CTAs */}
              {!isOwner ? (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-pm hover:bg-pm-light text-white gap-2 h-12 text-base font-bold rounded-xl shadow-md shadow-pm/20 transition-all hover:shadow-lg hover:shadow-pm/30"
                    onClick={handleContact}
                    disabled={isContactLoading}
                  >
                    <MessageCircle className="h-5 w-5" />
                    {isContactLoading ? "Opening Chat…" : "Chat with Seller"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Link href={`/edit-ad/${ad.id}`}>
                    <Button variant="outline" className="w-full gap-2 h-11 rounded-xl">
                      <Edit className="h-4 w-4" /> Edit Listing
                    </Button>
                  </Link>
                  {!ad.isFeatured && (
                    <Link href={`/feature-ad/${ad.id}`}>
                      <Button className="w-full bg-amber-400 hover:bg-amber-500 text-white gap-2 h-11 rounded-xl font-bold">
                        <Zap className="h-4 w-4" /> Boost This Listing
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Seller card */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Seller</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={ad.user.profileImage || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-pm to-pm-light text-white font-bold">
                      {getInitials(ad.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{ad.user.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3 text-pm" />
                      Member since {formatDate(ad.user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, label: "Verified Platform" },
                  { icon: MessageCircle, label: "Chat Protected" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-2">
                    <Icon className="h-3.5 w-3.5 text-pm shrink-0" />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Buyer Safety Tips
              </h3>
              <ul className="space-y-2">
                {[
                  "Meet in a busy public place",
                  "Inspect item before payment",
                  "Never pay before receiving",
                  "Report suspicious listings",
                ].map((tip) => (
                  <li key={tip} className="text-xs text-amber-700 flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Similar Listings ─────────────────────────────────────── */}
        {relatedAds.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-gray-900">Similar Listings</h2>
              <Link href={`/category/${ad.category.slug}`}
                className="text-sm text-pm hover:underline font-medium flex items-center gap-1">
                View all <Chevron className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedAds.map((rel) => (
                <AdCard key={rel.id} ad={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
