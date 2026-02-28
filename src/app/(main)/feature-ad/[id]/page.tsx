'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Upload, CheckCircle, Building2, CreditCard, User, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils';

interface BankDetails {
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode?: string;
  };
  featuredAdPrice: number;
  featuredAdDuration: number;
}

interface Ad {
  id: string;
  title: string;
  images: string[];
  price: number;
  isFeatured: boolean;
  featuredUntil: string | null;
}

export default function FeatureAdPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [ad, setAd] = useState<Ad | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [screenshot, setScreenshot] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [adRes, bankRes] = await Promise.all([
        fetch(`/api/ads/${params.id}`),
        fetch('/api/bank-details'),
      ]);

      const adData = await adRes.json();
      const bankData = await bankRes.json();

      if (adData.success) {
        setAd(adData.data.ad);
      }

      if (bankData.success) {
        setBankDetails(bankData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingScreenshot(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'payment-proofs');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setScreenshot(data.data.url);
        toast({
          title: 'Screenshot Uploaded',
          description: 'Your payment proof has been uploaded.',
        });
      }
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload screenshot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!screenshot) {
      toast({
        title: 'Screenshot Required',
        description: 'Please upload a screenshot of your payment.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId: params.id,
          screenshotImage: screenshot,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Request Submitted!',
          description: 'Your feature request has been submitted for review.',
        });
        router.push('/my-ads');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit request. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
        </main>
        <Footer />
      </>
    );
  }

  if (!ad) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <Card className="text-center p-8">
            <h2 className="text-xl font-bold mb-2">Ad Not Found</h2>
            <p className="text-gray-500 mb-4">The ad you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/my-ads')}>Go to My Ads</Button>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  if (ad.isFeatured && ad.featuredUntil && new Date(ad.featuredUntil) > new Date()) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <Card className="text-center p-8 max-w-md">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Already Featured!</h2>
            <p className="text-gray-500 mb-4">
              This ad is already featured until{' '}
              {new Date(ad.featuredUntil).toLocaleDateString()}.
            </p>
            <Button onClick={() => router.push('/my-ads')}>Go to My Ads</Button>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Feature Your Ad</h1>
          <p className="text-gray-500 mb-8">
            Make your ad stand out and get more views
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ad Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Ad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <Image
                      src={ad.images[0] || '/images/placeholder.jpg'}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{ad.title}</h3>
                  <p className="text-olx font-bold text-xl">
                    {formatPrice(ad.price)}
                  </p>
                </CardContent>
              </Card>

              {/* Pricing Info */}
              <Card className="mt-6 bg-gradient-to-br from-olx-yellow/20 to-olx-accent/20 border-olx-yellow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Featured Ad Price</p>
                      <p className="text-3xl font-bold text-olx">
                        Rs {bankDetails?.featuredAdPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-xl font-semibold">
                        {bankDetails?.featuredAdDuration} Days
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Appear at the top of search results
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Get more visibility and responses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Featured badge on your ad
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div>
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Transfer Details</CardTitle>
                    <CardDescription>
                      Transfer the amount to the following account and upload the screenshot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Bank Details */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-olx" />
                        <div>
                          <p className="text-sm text-gray-500">Bank Name</p>
                          <p className="font-medium">{bankDetails?.bankDetails.bankName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-olx" />
                        <div>
                          <p className="text-sm text-gray-500">Account Title</p>
                          <p className="font-medium">{bankDetails?.bankDetails.accountTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-olx" />
                        <div>
                          <p className="text-sm text-gray-500">Account Number</p>
                          <p className="font-medium">{bankDetails?.bankDetails.accountNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-olx" />
                        <div>
                          <p className="text-sm text-gray-500">IBAN</p>
                          <p className="font-medium">{bankDetails?.bankDetails.iban}</p>
                        </div>
                      </div>
                      {bankDetails?.bankDetails.branchCode && (
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-olx" />
                          <div>
                            <p className="text-sm text-gray-500">Branch Code</p>
                            <p className="font-medium">{bankDetails.bankDetails.branchCode}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Screenshot Upload */}
                    <div>
                      <Label>Payment Screenshot *</Label>
                      <div className="mt-2">
                        {screenshot ? (
                          <div className="relative aspect-video">
                            <Image
                              src={screenshot}
                              alt="Payment screenshot"
                              fill
                              className="object-contain rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => setScreenshot('')}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-olx-accent transition-colors">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">
                              Upload payment screenshot
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleScreenshotUpload}
                              disabled={uploadingScreenshot}
                            />
                          </label>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Please upload a clear screenshot of your bank transfer receipt
                      </p>
                    </div>

                    <Alert>
                      <AlertDescription>
                        Your feature request will be reviewed by our team within 24 hours.
                        You will be notified once your ad is featured.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className="w-full bg-olx hover:bg-olx-light"
                      isLoading={isSubmitting || uploadingScreenshot}
                      disabled={!screenshot}
                    >
                      Submit Feature Request
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
