"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  User, Mail, Phone, Camera, Save, Loader2,
  Package, CheckCircle, Star, Eye, Settings,
  MessageSquare, Heart, Plus, ChevronRight,
  Bell, Shield, Calendar,
  TrendingUp, Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatRelativeTime, formatDate, getInitials } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  emailVerified?: string | null;
}

interface UserStats {
  totalAds: number;
  activeAds: number;
  featuredAds: number;
  totalViews: number;
}

interface RecentAd {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  views: number;
  category: { name: string; slug: string };
}

// ── Quick links sidebar ────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "My Ads",       href: "/my-ads",          icon: Package,      color: "text-blue-600",   bg: "bg-blue-50"   },
  { label: "Favorites",    href: "/favorites",        icon: Heart,        color: "text-rose-600",   bg: "bg-rose-50"   },
  { label: "Messages",     href: "/chat",             icon: MessageSquare,color: "text-green-600",  bg: "bg-green-50"  },
  { label: "Notifications",href: "/notifications",    icon: Bell,         color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Settings",     href: "/settings",         icon: Settings,     color: "text-gray-600",   bg: "bg-gray-50"   },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentAds, setRecentAds] = useState<RecentAd[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", profileImage: "" });

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/profile");
  }, [status, router]);

  // ── Fetch all data once session is ready ──────────────────────────────────
  useEffect(() => {
    if (!session?.user) return;
    Promise.all([fetchProfile(), fetchStats(), fetchRecentAds()]);
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
          profileImage: data.data.profileImage || "",
        });
      }
    } catch {
      // fall back to session data
      setFormData({
        name: session?.user?.name || "",
        phone: (session?.user as { phone?: string })?.phone || "",
        profileImage: session?.user?.image || "",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/user/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {}
  };

  const fetchRecentAds = async () => {
    try {
      const res = await fetch("/api/ads/my-ads?limit=5");
      const data = await res.json();
      if (data.success) setRecentAds(data.data.slice(0, 5));
    } catch {}
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "profiles");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setFormData((p) => ({ ...p, profileImage: data.data.url }));
        toast({ title: "Photo updated", description: "Profile picture changed." });
      }
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        await update({ name: formData.name, image: formData.profileImage, phone: formData.phone });
        setProfile((p) => p ? { ...p, ...formData } : p);
        toast({ title: "Profile saved", description: "Your profile has been updated." });
      } else {
        toast({ title: "Error", description: data.error || "Failed to save.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f5f6fa]">
          <div className="h-48 bg-gradient-to-r from-pm to-pm-light" />
          <div className="container mx-auto px-4 max-w-5xl -mt-16">
            <Card className="shadow-lg border-0 mb-6">
              <CardContent className="p-8">
                <div className="flex gap-6 items-start">
                  <Skeleton className="h-28 w-28 rounded-full -mt-12" />
                  <div className="flex-1 space-y-3 pt-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Stat cards config ─────────────────────────────────────────────────────

  const statCards = [
    { label: "Total Ads",    value: stats?.totalAds ?? "—",     icon: Package,      gradient: "from-blue-500 to-blue-700" },
    { label: "Active Ads",   value: stats?.activeAds ?? "—",    icon: CheckCircle,  gradient: "from-emerald-500 to-teal-700" },
    { label: "Featured",     value: stats?.featuredAds ?? "—",  icon: Star,         gradient: "from-amber-500 to-orange-600" },
    { label: "Total Views",  value: stats?.totalViews ?? "—",   icon: TrendingUp,   gradient: "from-purple-500 to-violet-700" },
  ];

  const memberSince = profile?.createdAt
    ? formatDate(new Date(profile.createdAt))
    : "—";

  const isVerified = !!profile?.emailVerified;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f6fa]">
        {/* ── Cover Banner ───────────────────────────────────────────── */}
        <div className="h-48 md:h-56 bg-gradient-to-br from-pm via-pm to-pm-light relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(35,229,219,1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-pm-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* ── Profile Header Card ─────────────────────────────────── */}
          <div className="relative -mt-20 mb-8">
            <Card className="shadow-xl border-0 overflow-hidden">
              {/* Top accent stripe */}
              <div className="h-1 bg-gradient-to-r from-pm-accent via-pm-yellow to-pm-accent" />
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Avatar */}
                  <div className="relative shrink-0 -mt-16 sm:-mt-20">
                    <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-xl ring-2 ring-pm/20">
                      <AvatarImage src={formData.profileImage || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-pm to-pm-light text-white text-3xl font-bold">
                        {getInitials(formData.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-1 right-1 bg-pm text-white p-2 rounded-full shadow-lg hover:bg-pm-light transition-all border-2 border-white"
                    >
                      {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pt-1 sm:pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">
                          {profileLoading ? <Skeleton className="h-7 w-40 inline-block" /> : (formData.name || "Your Name")}
                        </h1>
                        <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" /> {profile?.email || session?.user?.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {isVerified && (
                            <Badge variant="success" className="gap-1">
                              <Shield className="h-3 w-3" /> Verified
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Member since {memberSince}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link href="/post-ad">
                          <Button size="sm" className="bg-pm hover:bg-pm-light gap-1 rounded-full px-4">
                            <Plus className="h-4 w-4" /> Post Ad
                          </Button>
                        </Link>
                        <Link href="/settings">
                          <Button size="sm" variant="outline" className="gap-1 rounded-full px-4">
                            <Settings className="h-4 w-4" /> Settings
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                      {statCards.map((s) => (
                        <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-xl p-3 text-center text-white shadow-sm`}>
                          <s.icon className="h-4 w-4 mx-auto mb-1 opacity-80" />
                          <p className="text-xl font-extrabold">{s.value}</p>
                          <p className="text-[11px] opacity-80 mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Main grid ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-14">
            {/* Left — tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-pm data-[state=active]:text-white">
                    Edit Profile
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-pm data-[state=active]:text-white">
                    Recent Ads
                  </TabsTrigger>
                </TabsList>

                {/* ── Profile tab ─────────────────────────────────── */}
                <TabsContent value="profile">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b bg-gray-50/50">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4 text-pm" /> Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                className="pl-10"
                                placeholder="Your full name"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                                className="pl-10"
                                placeholder="03XX-XXXXXXX"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={profile?.email || session?.user?.email || ""}
                              disabled
                              className="pl-10 bg-gray-50 cursor-not-allowed text-gray-500"
                            />
                          </div>
                          <p className="text-xs text-gray-400">Email address cannot be changed.</p>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Password &amp; Security</p>
                            <p className="text-xs text-gray-400">Manage your password and security settings</p>
                          </div>
                          <Link href="/settings">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Shield className="h-3.5 w-3.5" /> Manage
                            </Button>
                          </Link>
                        </div>

                        <Button
                          type="submit"
                          className="bg-pm hover:bg-pm-light gap-2 rounded-full px-8"
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── Recent Ads tab ──────────────────────────────── */}
                <TabsContent value="activity">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4 text-pm" /> Your Recent Ads
                      </CardTitle>
                      <Link href="/my-ads">
                        <Button variant="ghost" size="sm" className="text-pm text-xs gap-1">
                          View All <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                      {recentAds.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No ads yet</p>
                          <p className="text-gray-400 text-sm mb-4">Post your first ad to get started</p>
                          <Link href="/post-ad">
                            <Button size="sm" className="bg-pm hover:bg-pm-light gap-1 rounded-full">
                              <Plus className="h-4 w-4" /> Post an Ad
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {recentAds.map((ad) => (
                            <Link key={ad.id} href={`/ad/${ad.id}`} className="group">
                              <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                {/* Thumbnail */}
                                <div className="relative h-16 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                  {ad.images[0] ? (
                                    <Image src={ad.images[0]} alt={ad.title} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>
                                  )}
                                  {ad.isFeatured && (
                                    <span className="absolute top-1 left-1 bg-pm-yellow text-pm text-[9px] font-bold px-1.5 py-0.5 rounded-full">★</span>
                                  )}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-pm transition-colors">
                                    {ad.title}
                                  </p>
                                  <p className="text-pm font-bold text-sm">{formatPrice(ad.price)}</p>
                                  <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" /> {ad.city}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <Eye className="h-3 w-3" /> {ad.views} views
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> {formatRelativeTime(ad.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                {/* Status */}
                                <div className="shrink-0">
                                  {ad.isApproved ? (
                                    <Badge variant="success" className="text-xs">Active</Badge>
                                  ) : (
                                    <Badge variant="warning" className="text-xs">Pending</Badge>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right — Sidebar ─────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="pb-0 border-b bg-gray-50/50">
                  <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {QUICK_LINKS.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0">
                        <div className={`p-2 rounded-lg ${link.bg} shrink-0`}>
                          <link.icon className={`h-4 w-4 ${link.color}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-pm flex-1 transition-colors">
                          {link.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-pm transition-colors" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Promote Banner */}
              <div className="bg-gradient-to-br from-pm to-pm-light rounded-2xl p-5 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="relative">
                  <Star className="h-7 w-7 text-pm-yellow mb-2 fill-pm-yellow" />
                  <p className="font-bold text-white mb-1">Feature Your Ads</p>
                  <p className="text-xs text-white/70 mb-4">Get 10x more views with a featured listing</p>
                  <Link href="/my-ads">
                    <Button size="sm" className="bg-pm-yellow text-pm hover:bg-pm-yellow/90 w-full font-bold rounded-full">
                      Promote Now →
                    </Button>
                  </Link>
                </div>
              </div>


            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
