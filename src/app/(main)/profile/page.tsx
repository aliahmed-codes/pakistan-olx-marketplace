"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  Package,
  CheckCircle,
  Star,
  Eye,
  Settings,
  MessageSquare,
  Heart,
  Plus,
  ChevronRight,
  Store,
  Bell,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatDate, getInitials } from "@/lib/utils";

interface UserStats {
  totalAds: number;
  activeAds: number;
  featuredAds: number;
  totalViews: number;
}

const quickLinks = [
  { label: "My Ads", href: "/my-ads", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Favorites", href: "/favorites", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
  { label: "Messages", href: "/chat", icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
  { label: "My Store", href: "/stores/my-store", icon: Store, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Notifications", href: "/notifications", icon: Bell, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Settings", href: "/settings", icon: Settings, color: "text-gray-600", bg: "bg-gray-50" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        profileImage: session.user.image || "",
      });
      fetchUserStats();
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "profiles");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, profileImage: data.data.url }));
        toast({ title: "Image Uploaded", description: "Profile picture updated." });
      }
    } catch {
      toast({ title: "Upload Failed", description: "Failed to upload image.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          profileImage: formData.profileImage,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        await update({ name: formData.name, phone: formData.phone, image: formData.profileImage });
        toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
      } else {
        toast({ title: "Error", description: data.error || "Failed to update profile", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
            <p className="text-gray-500">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const statCards = [
    { label: "Total Ads", value: stats?.totalAds ?? 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Ads", value: stats?.activeAds ?? 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Featured", value: stats?.featuredAds ?? 0, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Total Views", value: stats?.totalViews ?? 0, icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Cover Banner */}
        <div className="h-40 md:h-56 bg-gradient-to-r from-olx via-olx-light to-[#004d55] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Profile Header Card */}
          <div className="relative -mt-16 mb-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0 -mt-12 md:-mt-16">
                    <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white shadow-xl ring-2 ring-olx/20">
                      <AvatarImage src={formData.profileImage || undefined} />
                      <AvatarFallback className="bg-olx text-white text-2xl font-bold">
                        {getInitials(formData.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 bg-olx text-white p-1.5 rounded-full shadow-lg hover:bg-olx-light transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Camera className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 pt-2 md:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{formData.name || "Your Name"}</h1>
                        <p className="text-gray-500 text-sm">{formData.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified User
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Member since {formatDate(new Date())}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href="/post-ad">
                          <Button size="sm" className="bg-olx hover:bg-olx-light gap-1">
                            <Plus className="h-4 w-4" />
                            Post Ad
                          </Button>
                        </Link>
                        <Link href="/settings">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Settings className="h-4 w-4" />
                            Settings
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      {statCards.map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-lg p-3 text-center`}>
                          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Edit Profile</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4 text-olx" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                            <Input id="email" type="email" value={formData.email} disabled className="pl-10 bg-gray-50 cursor-not-allowed" />
                          </div>
                          <p className="text-xs text-gray-400">Email address cannot be changed.</p>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Password & Security</p>
                            <p className="text-xs text-gray-400">Manage your password and security settings</p>
                          </div>
                          <Link href="/settings?tab=security">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Shield className="h-3.5 w-3.5" />
                              Manage
                            </Button>
                          </Link>
                        </div>

                        <Button type="submit" className="bg-olx hover:bg-olx-light gap-2 w-full sm:w-auto" disabled={isLoading}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { icon: Package, color: "text-blue-600 bg-blue-50", label: "You posted a new ad", time: "2 hours ago" },
                          { icon: Eye, color: "text-purple-600 bg-purple-50", label: "Your ad received 12 views", time: "5 hours ago" },
                          { icon: MessageSquare, color: "text-green-600 bg-green-50", label: "New message from Ahmed", time: "1 day ago" },
                          { icon: Heart, color: "text-red-600 bg-red-50", label: "Someone favorited your ad", time: "2 days ago" },
                          { icon: Star, color: "text-yellow-600 bg-yellow-50", label: "Your ad was featured", time: "3 days ago" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${item.color.split(" ")[1]}`}>
                              <item.icon className={`h-4 w-4 ${item.color.split(" ")[0]}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{item.label}</p>
                              <p className="text-xs text-gray-400">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                        <div className={`p-2 rounded-lg ${link.bg}`}>
                          <link.icon className={`h-4 w-4 ${link.color}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-olx flex-1">
                          {link.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-olx" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Promote Banner */}
              <div className="bg-gradient-to-br from-olx-yellow/30 to-olx-yellow/10 rounded-xl p-4 border border-olx-yellow/30">
                <Star className="h-6 w-6 text-olx-yellow mb-2" />
                <p className="font-semibold text-gray-800 mb-1">Feature Your Ads</p>
                <p className="text-xs text-gray-600 mb-3">Get 10x more views with a featured listing</p>
                <Link href="/my-ads">
                  <Button size="sm" className="bg-olx-yellow text-olx hover:bg-olx-yellow/90 w-full text-xs font-semibold">
                    Promote Now
                  </Button>
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
