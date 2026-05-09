'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, Upload, X, CheckCircle, Loader2,
  Building2, CreditCard, ArrowLeft, Clock,
  TrendingUp, Eye, Zap, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils';

interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  city: string;
  isApproved: boolean;
  isFeatured: boolean;
  featuredUntil: string | null;
  category: { name: string };
}

interface BankConfig {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchCode?: string;
  featuredAdPrice: number;
  featuredAdDuration: number;
}

const BENEFITS = [
  { icon: TrendingUp, title: 'Top of Results',    desc: 'Your ad appears above regular listings in search & categories.' },
  { icon: Eye,        title: '10x More Views',    desc: 'Featured ads get dramatically more clicks and enquiries.' },
  { icon: Zap,        title: 'Featured Badge',    desc: 'A gold star badge makes your ad instantly stand out.' },
  { icon: ShieldCheck,title: 'Priority Support',  desc: 'Our team ensures your ad stays visible for the full duration.' },
];

export default function FeatureAdPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [ad, setAd]                         = useState<Ad | null>(null);
  const [bankConfig, setBankConfig]         = useState<BankConfig | null>(null);
  const [screenshot, setScreenshot]         = useState('');
  const [uploading, setUploading]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [loadingAd, setLoadingAd]           = useState(true);
  const [submitted, setSubmitted]           = useState(false);

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/login?callbackUrl=/feature-ad/${id}`);
  }, [status, router, id]);

  // Fetch ad + bank config
  useEffect(() => {
    if (!session?.user || !id) return;

    const fetchData = async () => {
      setLoadingAd(true);
      try {
        const [adRes, configRes] = await Promise.all([
          fetch(`/api/ads/${id}`),
          fetch('/api/admin/bank-details').catch(() => ({ json: async () => ({ success: false }) })),
        ]);

        const adData = await adRes.json();
        if (adData.success) {
          if (adData.data.userId !== session.user.id) {
            toast({ title: 'Unauthorized', description: 'You can only feature your own ads.', variant: 'destructive' });
            router.push('/my-ads');
            return;
          }
          setAd(adData.data);
        } else {
          router.push('/my-ads');
        }

        const configData = await (configRes as Response).json();
        if (configData.success) setBankConfig(configData.data);
        else {
          // Sensible fallback
          setBankConfig({
            bankName: 'HBL – Habib Bank Limited',
            accountTitle: 'Pakistan Market (PM)',
            accountNumber: '01234567890123',
            iban: 'PK12HABB0012345678901234',
            featuredAdPrice: 2000,
            featuredAdDuration: 7,
          });
        }
      } catch {
        router.push('/my-ads');
      } finally {
        setLoadingAd(false);
      }
    };

    fetchData();
  }, [session, id, router, toast]);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'payment-proofs');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setScreenshot(data.data.url);
        toast({ title: 'Screenshot uploaded ✅' });
      } else {
        toast({ title: 'Upload failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Upload error', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      toast({ title: 'Please upload a payment screenshot first.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: id, screenshotImage: screenshot }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast({ title: '🌟 Request submitted!', description: data.message });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (status === 'loading' || loadingAd) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm" />
            <p className="text-gray-500">Loading…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-pm-yellow to-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">
              <Star className="h-10 w-10 text-pm fill-pm" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Request Submitted! 🎉</h1>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your feature request is under review. Our team will approve it within <strong>24 hours</strong> and notify you once your ad goes featured.
            </p>
            <div className="flex gap-3">
              <Link href="/my-ads" className="flex-1">
                <Button className="w-full bg-pm hover:bg-pm-light rounded-full">View My Ads</Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full rounded-full">Go Home</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!ad) return null;

  // ── Main page ─────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f6fa]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-pm to-pm-light text-white py-10 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, rgba(35,229,219,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="container mx-auto px-4 relative">
            <Link href="/my-ads" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to My Ads
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pm-yellow/20 border border-pm-yellow/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-pm-yellow fill-pm-yellow" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">Feature Your Ad</h1>
                <p className="text-white/70 text-sm">Get 10× more views and top placement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-5xl">
          {/* Benefits strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pm to-pm-light flex items-center justify-center">
                  <b.icon className="h-4 w-4 text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left — Ad preview + pricing */}
            <div className="space-y-5">
              {/* Ad preview card */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={ad.images[0] || '/images/placeholder.jpg'}
                    alt={ad.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-pm-yellow text-pm text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <Star className="h-3 w-3 fill-pm" /> Will be Featured
                  </span>
                </div>
                <CardContent className="p-5">
                  <p className="text-2xl font-extrabold text-pm">{formatPrice(ad.price)}</p>
                  <h3 className="font-semibold text-gray-900 mt-0.5">{ad.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{ad.category?.name} · {ad.city}</p>
                </CardContent>
              </Card>

              {/* Pricing card */}
              <div className="bg-gradient-to-br from-pm to-pm-light rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative">
                  <p className="text-white/70 text-sm mb-1">Featured Ad Price</p>
                  <p className="text-4xl font-extrabold">
                    Rs {(bankConfig?.featuredAdPrice ?? 2000).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Clock className="h-4 w-4 text-pm-yellow" />
                    <span className="text-white/80 text-sm">
                      Duration: <strong>{bankConfig?.featuredAdDuration ?? 7} days</strong>
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {['Top placement in all searches', 'Gold Featured badge', 'Priority in category pages'].map((t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle className="h-4 w-4 text-pm-yellow shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right — Payment + upload form */}
            <div>
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-pm" /> Bank Transfer Details
                  </CardTitle>
                  <CardDescription>
                    Transfer Rs {(bankConfig?.featuredAdPrice ?? 2000).toLocaleString()} to the account below, then upload your payment screenshot.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {/* Bank details */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                    {[
                      { icon: Building2,   label: 'Bank Name',       value: bankConfig?.bankName       || 'HBL – Habib Bank Limited' },
                      { icon: CreditCard,  label: 'Account Title',   value: bankConfig?.accountTitle   || 'Pakistan Market (PM)' },
                      { icon: CreditCard,  label: 'Account Number',  value: bankConfig?.accountNumber  || '01234567890123' },
                      { icon: CreditCard,  label: 'IBAN',            value: bankConfig?.iban            || 'PK12HABB0012345678901234' },
                      ...(bankConfig?.branchCode ? [{ icon: Building2, label: 'Branch Code', value: bankConfig.branchCode }] : []),
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-3">
                        <row.icon className="h-4 w-4 text-pm mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400">{row.label}</p>
                          <p className="font-semibold text-gray-900 text-sm break-all">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Screenshot upload */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Payment Screenshot <span className="text-red-500">*</span>
                    </label>
                    {screenshot ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
                        <Image src={screenshot} alt="Payment proof" fill className="object-contain" />
                        <button
                          type="button"
                          onClick={() => setScreenshot('')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Uploaded
                        </span>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-pm-accent hover:bg-pm-accent/5 transition-all group">
                        {uploading ? (
                          <Loader2 className="h-7 w-7 text-pm animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-7 w-7 text-gray-300 group-hover:text-pm transition-colors mb-2" />
                            <span className="text-sm text-gray-400 group-hover:text-pm transition-colors">Click to upload screenshot</span>
                            <span className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP up to 10MB</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleScreenshotUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Upload a clear screenshot of your bank transfer receipt.</p>
                  </div>

                  {/* Notice */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 leading-relaxed">
                      After submitting, our team reviews your request within <strong>24 hours</strong>. You&apos;ll be notified once your ad is featured.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pm-yellow to-amber-400 text-pm font-extrabold rounded-full py-5 text-base hover:opacity-90 transition-opacity shadow-lg shadow-amber-200 gap-2"
                      disabled={submitting || !screenshot || uploading}
                    >
                      {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Star className="h-5 w-5 fill-pm" />}
                      Submit Feature Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
