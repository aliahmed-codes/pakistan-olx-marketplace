"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Shield,
  AlertTriangle,
  Camera,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Mail,
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getInitials, cities } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationSettings {
  newMessages: boolean;
  adApproved: boolean;
  priceDropAlerts: boolean;
  marketingEmails: boolean;
}

interface PrivacySettings {
  showPhone: boolean;
  showProfile: boolean;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SettingsSkeleton() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-56 shrink-0 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
            <div className="flex-1 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    profileImage: "",
  });

  // Security state
  const [securityLoading, setSecurityLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // Notifications state (persisted in localStorage)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newMessages: true,
    adApproved: true,
    priceDropAlerts: false,
    marketingEmails: false,
  });

  // Privacy state
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showPhone: true,
    showProfile: true,
  });

  // Danger Zone state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Redirect unauthenticated users ──────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/settings");
    }
  }, [status, router]);

  // ── Populate form from session ───────────────────────────────────────────────
  useEffect(() => {
    if (session?.user) {
      setProfileForm({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as { phone?: string }).phone || "",
        city: (session.user as { city?: string }).city || "",
        bio: (session.user as { bio?: string }).bio || "",
        profileImage: session.user.image || "",
      });
    }
  }, [session]);

  // ── Load settings from localStorage ─────────────────────────────────────────
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem("olx_notification_settings");
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      const savedPrivacy = localStorage.getItem("olx_privacy_settings");
      if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
    } catch {
      // ignore
    }
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "profiles");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setProfileForm((prev) => ({ ...prev, profileImage: data.data.url }));
        toast({ title: "Avatar updated", description: "Profile picture changed successfully." });
      }
    } catch {
      toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          city: profileForm.city,
          bio: profileForm.bio,
          profileImage: profileForm.profileImage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await update({ name: profileForm.name, image: profileForm.profileImage });
        toast({ title: "Profile saved", description: "Your profile has been updated." });
      } else {
        toast({ title: "Error", description: data.error || "Failed to save profile.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Passwords don't match", description: "New password and confirmation must match.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setSecurityLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast({ title: "Password changed", description: "Your password has been updated successfully." });
      } else {
        toast({ title: "Error", description: data.error || "Failed to change password.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    try {
      localStorage.setItem("olx_notification_settings", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    try {
      localStorage.setItem("olx_privacy_settings", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Account deleted", description: "Your account has been permanently deleted." });
        router.push("/");
      } else {
        toast({ title: "Error", description: "Failed to delete account.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // ── Render guard ─────────────────────────────────────────────────────────────

  if (status === "loading") return <SettingsSkeleton />;
  if (!session) return null;

  // ── Sidebar nav items ─────────────────────────────────────────────────────────

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#002f34]">Account Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your profile, security, and preferences</p>
          </div>

          {/* Mobile Tabs (visible on sm screens) */}
          <div className="block md:hidden mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap h-auto gap-1 bg-white border border-gray-200 p-1 rounded-lg">
                {navItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className={`text-xs px-2 py-1.5 rounded-md data-[state=active]:bg-[#002f34] data-[state=active]:text-white ${
                      item.id === "danger" ? "data-[state=active]:bg-red-600" : ""
                    }`}
                  >
                    <item.icon className="h-3 w-3 mr-1" />
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Layout: Sidebar + Content */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* Desktop Sidebar */}
            <nav className="hidden md:block md:w-56 shrink-0">
              <Card className="overflow-hidden">
                <CardContent className="p-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 last:mb-0 ${
                        activeTab === item.id
                          ? item.id === "danger"
                            ? "bg-red-50 text-red-600"
                            : "bg-[#002f34] text-white"
                          : item.id === "danger"
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <ChevronRight className={`h-4 w-4 transition-opacity ${activeTab === item.id ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* User card */}
              <Card className="mt-4">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-[#002f34]/20">
                    <AvatarImage src={profileForm.profileImage || undefined} />
                    <AvatarFallback className="bg-[#002f34] text-white text-sm">
                      {getInitials(profileForm.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 truncate">{profileForm.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{profileForm.email}</p>
                  </div>
                </CardContent>
              </Card>
            </nav>

            {/* Content Panel */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >

                  {/* ── PROFILE TAB ─────────────────────────────────────────── */}
                  {activeTab === "profile" && (
                    <form onSubmit={handleProfileSave} className="space-y-5">
                      {/* Avatar */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-5">
                          <div className="relative shrink-0">
                            <Avatar className="h-20 w-20 border-2 border-[#002f34]/20">
                              <AvatarImage src={profileForm.profileImage || undefined} />
                              <AvatarFallback className="bg-[#002f34] text-white text-xl">
                                {getInitials(profileForm.name || "U")}
                              </AvatarFallback>
                            </Avatar>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={avatarUploading}
                              className="absolute bottom-0 right-0 bg-[#23e5db] text-[#002f34] p-1.5 rounded-full shadow-md hover:brightness-95 transition-all"
                            >
                              {avatarUploading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Camera className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarUpload}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Change your avatar</p>
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP. Max 5 MB.</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 text-xs"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={avatarUploading}
                            >
                              <Camera className="h-3.5 w-3.5 mr-1.5" />
                              Choose Photo
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Personal Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Personal Information</CardTitle>
                          <CardDescription>Update your public profile details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Name */}
                          <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="name"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                                className="pl-9"
                                placeholder="Your full name"
                              />
                            </div>
                          </div>

                          {/* Email (readonly) */}
                          <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                value={profileForm.email}
                                disabled
                                className="pl-9 bg-gray-50 text-gray-500 cursor-not-allowed"
                              />
                            </div>
                            <p className="text-xs text-gray-400">Email address cannot be changed.</p>
                          </div>

                          {/* Phone */}
                          <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                                className="pl-9"
                                placeholder="03XX-XXXXXXX"
                              />
                            </div>
                          </div>

                          {/* City */}
                          <div className="space-y-1.5">
                            <Label htmlFor="city">City</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                              <Select
                                value={profileForm.city}
                                onValueChange={(v) => setProfileForm((p) => ({ ...p, city: v }))}
                              >
                                <SelectTrigger className="pl-9">
                                  <SelectValue placeholder="Select your city" />
                                </SelectTrigger>
                                <SelectContent>
                                  {cities.map((city) => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Bio */}
                          <div className="space-y-1.5">
                            <Label htmlFor="bio">Bio</Label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <textarea
                                id="bio"
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                                rows={3}
                                maxLength={300}
                                placeholder="Tell buyers a little about yourself..."
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                              />
                            </div>
                            <p className="text-xs text-gray-400 text-right">{profileForm.bio.length}/300</p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-[#002f34] hover:bg-[#004d54] text-white gap-2"
                          disabled={profileLoading}
                        >
                          {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Save Profile
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* ── SECURITY TAB ────────────────────────────────────────── */}
                  {activeTab === "security" && (
                    <div className="space-y-5">
                      {/* Change Password */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Change Password</CardTitle>
                          <CardDescription>Use a strong password that you don't use elsewhere</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handlePasswordChange} className="space-y-4">
                            {/* Current Password */}
                            <div className="space-y-1.5">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="currentPassword"
                                  type={showPasswords.current ? "text" : "password"}
                                  value={passwordForm.currentPassword}
                                  onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                                  className="pl-9 pr-10"
                                  placeholder="Enter current password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                              <Label htmlFor="newPassword">New Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="newPassword"
                                  type={showPasswords.new ? "text" : "password"}
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                                  className="pl-9 pr-10"
                                  placeholder="At least 8 characters"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              {/* Strength indicator */}
                              {passwordForm.newPassword.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {[1, 2, 3, 4].map((level) => (
                                    <div
                                      key={level}
                                      className={`h-1 flex-1 rounded-full transition-colors ${
                                        passwordForm.newPassword.length >= level * 3
                                          ? level <= 1
                                            ? "bg-red-400"
                                            : level <= 2
                                            ? "bg-yellow-400"
                                            : level <= 3
                                            ? "bg-blue-400"
                                            : "bg-green-500"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-1.5">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="confirmPassword"
                                  type={showPasswords.confirm ? "text" : "password"}
                                  value={passwordForm.confirmPassword}
                                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                                  className="pl-9 pr-10"
                                  placeholder="Repeat new password"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                {passwordForm.confirmPassword && (
                                  <div className="absolute right-9 top-1/2 -translate-y-1/2">
                                    {passwordForm.newPassword === passwordForm.confirmPassword ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Last changed: Never</span>
                              </div>
                              <Button
                                type="submit"
                                className="bg-[#002f34] hover:bg-[#004d54] text-white gap-2"
                                disabled={securityLoading}
                              >
                                {securityLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                Update Password
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>

                      {/* Two-Factor Authentication */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                          <CardDescription>Add an extra layer of security to your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-800">Enable 2FA via SMS</p>
                              <p className="text-xs text-gray-500">Receive a code on your phone when signing in</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-[#23e5db] border-[#23e5db] text-xs">
                                Coming Soon
                              </Badge>
                              <Switch
                                checked={twoFAEnabled}
                                onCheckedChange={() =>
                                  toast({
                                    title: "Coming Soon",
                                    description: "Two-factor authentication will be available soon.",
                                  })
                                }
                                disabled
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* ── NOTIFICATIONS TAB ───────────────────────────────────── */}
                  {activeTab === "notifications" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Notification Preferences</CardTitle>
                        <CardDescription>Choose what notifications you receive. Changes are saved automatically.</CardDescription>
                      </CardHeader>
                      <CardContent className="divide-y divide-gray-100">
                        {[
                          {
                            key: "newMessages" as const,
                            label: "New Messages",
                            description: "Get notified when someone sends you a message",
                            icon: "💬",
                          },
                          {
                            key: "adApproved" as const,
                            label: "Ad Approved",
                            description: "Know when your posted ad goes live",
                            icon: "✅",
                          },
                          {
                            key: "priceDropAlerts" as const,
                            label: "Price Drop Alerts",
                            description: "Be alerted when a saved ad's price drops",
                            icon: "📉",
                          },
                          {
                            key: "marketingEmails" as const,
                            label: "Marketing Emails",
                            description: "Tips, promotions and product news from pm",
                            icon: "📧",
                          },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={notifications[item.key]}
                              onCheckedChange={(v) => handleNotificationChange(item.key, v)}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* ── PRIVACY TAB ─────────────────────────────────────────── */}
                  {activeTab === "privacy" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Privacy Settings</CardTitle>
                        <CardDescription>Control what information is visible to others</CardDescription>
                      </CardHeader>
                      <CardContent className="divide-y divide-gray-100">
                        {[
                          {
                            key: "showPhone" as const,
                            label: "Show my phone number publicly",
                            description: "Buyers can see your phone number on your ads",
                          },
                          {
                            key: "showProfile" as const,
                            label: "Show my profile to other users",
                            description: "Your profile page is visible to all users",
                          },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{item.label}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                            </div>
                            <Switch
                              checked={privacy[item.key]}
                              onCheckedChange={(v) => handlePrivacyChange(item.key, v)}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* ── DANGER ZONE TAB ─────────────────────────────────────── */}
                  {activeTab === "danger" && (
                    <div className="space-y-5">
                      <Card className="border-red-200 bg-red-50/30">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <CardTitle className="text-base text-red-700">Danger Zone</CardTitle>
                          </div>
                          <CardDescription className="text-red-500/80">
                            Irreversible and destructive actions. Proceed with extreme caution.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-lg border border-red-200 bg-white p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                                  Permanently delete your account and all associated data — ads, messages and reviews — with no way to recover them.
                                </p>
                              </div>
                              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button variant="destructive" size="sm" className="shrink-0">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Delete Account
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-red-600 flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5" />
                                      Delete Your Account
                                    </DialogTitle>
                                    <DialogDescription className="space-y-3 pt-2">
                                      <p>This action is <strong>permanent and cannot be undone</strong>. The following will be deleted:</p>
                                      <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                                        <li>All your ads (active, sold, pending)</li>
                                        <li>Your message history</li>
                                        <li>Your favorites and saved searches</li>
                                        <li>All reviews and ratings</li>
                                      </ul>
                                      <div className="pt-2">
                                        <Label htmlFor="deleteConfirm" className="text-sm font-medium text-gray-700">
                                          Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm
                                        </Label>
                                        <Input
                                          id="deleteConfirm"
                                          value={deleteConfirmText}
                                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                                          className="mt-1.5 border-red-200 focus-visible:ring-red-400"
                                          placeholder="DELETE"
                                        />
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="gap-2 sm:gap-0">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setDeleteDialogOpen(false);
                                        setDeleteConfirmText("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      disabled={deleteConfirmText !== "DELETE" || deleteLoading}
                                      onClick={handleDeleteAccount}
                                    >
                                      {deleteLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      ) : (
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                      )}
                                      Permanently Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Fix: `Nav` was accidentally used instead of `div` - rename back
// Note: The nav element is just a div wrapper — changing nav alias below
const Nav = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);
