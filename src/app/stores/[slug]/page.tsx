"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Calendar,
  Package,
  ChevronRight,
  MessageCircle,
  Heart,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  phone: string;
  email: string;
  website: string | null;
  address: string | null;
  city: string;
  area: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    joinDate: string;
  };
  _count: {
    ads: number;
    storeFollowers: number;
  };
}

interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  condition: string;
  createdAt: string;
  views: number;
}

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;

  const [store, setStore] = useState<StoreData | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  useEffect(() => {
    fetchStore();
  }, [slug]);

  useEffect(() => {
    if (session?.user && store) {
      checkFollowStatus();
    }
  }, [session, store]);

  const fetchStore = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/stores/${slug}`);
      const data = await response.json();

      if (data.success) {
        setStore(data.data.store);
        setAds(data.data.store.ads || []);
      } else {
        toast.error("Store not found");
        router.push("/stores");
      }
    } catch (error) {
      toast.error("Failed to load store");
    } finally {
      setIsLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!store) return;
    try {
      const response = await fetch(`/api/stores/${store.id}/follow`);
      const data = await response.json();
      if (data.success) {
        setIsFollowing(data.data.isFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    if (!session?.user) {
      toast.error("Please login to follow stores");
      router.push("/login?callbackUrl=/stores/" + slug);
      return;
    }

    if (!store) return;

    setIsLoadingFollow(true);
    try {
      const response = await fetch(`/api/stores/${store.id}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? "Unfollowed store" : "Now following store");
        // Refresh store data to update follower count
        fetchStore();
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleChat = async () => {
    if (!session?.user) {
      toast.error("Please login to chat");
      router.push("/login?callbackUrl=/stores/" + slug);
      return;
    }

    if (!store) return;

    try {
      // Create or get conversation with store owner
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: store.owner.id }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/chat?conversation=${data.data.id}`);
      }
    } catch (error) {
      toast.error("Failed to start chat");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store?.name || "Store",
          text: store?.description || "",
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
        </main>
        <Footer />
      </>
    );
  }

  if (!store) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
            <p className="text-gray-600 mb-4">The store you're looking for doesn't exist.</p>
            <Link href="/stores">
              <Button>Browse All Stores</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        <div 
          className="h-48 md:h-64 bg-gradient-to-r from-olx to-olx-light relative"
          style={store.coverImage ? { backgroundImage: `url(${store.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />

        {/* Store Info */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg flex-shrink-0">
                  {store.logo ? (
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Store className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {store.name}
                    </h1>
                    {store.isVerified && (
                      <Badge className="bg-blue-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 max-w-2xl">
                    {store.description || "No description available"}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {store.city}{store.area ? `, ${store.area}` : ""}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {store._count.ads} ads
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {store._count.storeFollowers} followers
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(store.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button 
                    className="bg-olx hover:bg-olx-light"
                    onClick={handleChat}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Store
                  </Button>
                  <Button 
                    variant={isFollowing ? "outline" : "secondary"}
                    onClick={handleFollow}
                    disabled={isLoadingFollow}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                    {isFollowing ? "Following" : "Follow Store"}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    {store.phone && (
                      <a href={`tel:${store.phone}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 pb-12">
            {/* Main Content - Ads */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Store Ads ({store._count.ads})
                </h2>
                <Link
                  href={`/search?store=${store.slug}`}
                  className="text-olx hover:underline flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {ads.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No ads yet</h3>
                  <p className="text-gray-600">This store hasn't posted any ads yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {ads.map((ad) => (
                    <Link key={ad.id} href={`/ad/${ad.id}`}>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="aspect-[4/3] bg-gray-100 relative">
                          {ad.images[0] ? (
                            <Image
                              src={ad.images[0]}
                              alt={ad.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute bottom-2 right-2"
                          >
                            {ad.condition === "NEW" ? "New" : "Used"}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {ad.title}
                          </h3>
                          <p className="text-olx font-bold mb-2">
                            {formatPrice(ad.price)}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{ad.city}</span>
                            <span>{formatRelativeTime(ad.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {store.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600 text-sm">{store.address}</p>
                        {store.area && (
                          <p className="text-gray-600 text-sm">{store.area}, {store.city}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a
                        href={`tel:${store.phone}`}
                        className="text-olx hover:underline text-sm"
                      >
                        {store.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a
                        href={`mailto:${store.email}`}
                        className="text-olx hover:underline text-sm"
                      >
                        {store.email}
                      </a>
                    </div>
                  </div>
                  {store.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a
                          href={`https://${store.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-olx hover:underline text-sm"
                        >
                          {store.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Store Owner */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Store Owner
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">
                      {store.owner.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {store.owner.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Member since {store.owner.joinDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2">
                  Safety Tips
                </h3>
                <ul className="space-y-2 text-amber-700 text-sm">
                  <li>• Meet in public places</li>
                  <li>• Inspect items before paying</li>
                  <li>• Avoid advance payments</li>
                  <li>• Verify the seller&apos;s identity</li>
                </ul>
                <Link
                  href="/safety-tips"
                  className="text-amber-800 hover:underline text-sm mt-3 inline-block"
                >
                  Read more safety tips →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
