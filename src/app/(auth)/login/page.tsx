'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle2,
  Shield,
  Tag,
  ChevronRight,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// ---------- Left panel feature data ----------
const features = [
  {
    icon: Tag,
    title: 'Free to Post',
    desc: 'List your items for free — no hidden fees, ever.',
  },
  {
    icon: Shield,
    title: 'Secure Chat',
    desc: 'End-to-end encrypted messages keep your conversations private.',
  },
  {
    icon: CheckCircle2,
    title: 'Verified Sellers',
    desc: 'Every seller is verified so you buy and sell with confidence.',
  },
];

// ---------- Inner component that uses useSearchParams ----------
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (result?.error) {
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome Back!',
          description: 'You have successfully logged in.',
        });
        router.push(callbackUrl);
        router.refresh();
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

  return (
    <div className="min-h-screen flex">
      {/* ===== LEFT PANEL ===== */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={{ backgroundColor: '#002f34' }}
      >
        {/* Decorative geometric background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large circle top-right */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: '#23e5db' }}
          />
          {/* Medium circle bottom-left */}
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#23e5db' }}
          />
          {/* Small accent dots */}
          <div
            className="absolute top-1/3 left-8 w-6 h-6 rounded-full opacity-30"
            style={{ backgroundColor: '#ffce32' }}
          />
          <div
            className="absolute top-2/3 right-12 w-4 h-4 rounded-full opacity-25"
            style={{ backgroundColor: '#ffce32' }}
          />
          {/* Diagonal stripe accent */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #23e5db 0, #23e5db 1px, transparent 0, transparent 50%)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              Pakistan
            </span>
            <span
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: '#23e5db' }}
            >
              Market
            </span>
          </Link>

          {/* Hero text + features */}
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Buy &amp; Sell Anything,
                <br />
                <span style={{ color: '#23e5db' }}>Anywhere in Pakistan</span>
              </h2>
              <p className="mt-3 text-gray-300 text-base leading-relaxed">
                Pakistan&apos;s most trusted marketplace — millions of buyers
                and sellers, one platform.
              </p>
            </div>

            <ul className="space-y-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(35,229,219,0.15)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#23e5db' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: 'rgba(35,229,219,0.07)',
              borderColor: 'rgba(35,229,219,0.2)',
            }}
          >
            <p className="text-gray-300 text-sm italic leading-relaxed">
              &ldquo;I sold my old phone within 2 hours of posting. Pakistan
              Market is simply the best — fast, safe, and free!&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: '#00363d' }}
              >
                AK
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Ahmed Khan</p>
                <p className="text-gray-500 text-xs">Lahore, Punjab</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-3 h-3"
                    fill="#ffce32"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center">
            <Link href="/" className="flex items-center gap-1">
              <span
                className="text-2xl font-extrabold"
                style={{ color: '#002f34' }}
              >
                Pakistan
              </span>
              <span
                className="text-2xl font-extrabold"
                style={{ color: '#23e5db' }}
              >
                Market
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1.5 text-gray-500 text-sm">
              Sign in to your account to continue.
            </p>
            {/* Social proof */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                {['#002f34', '#23e5db', '#ffce32', '#00363d'].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white"
                      style={{ backgroundColor: bg }}
                    />
                  )
                )}
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Join <strong className="text-gray-700">5M+</strong> users
                already on the platform
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11 border-gray-300 focus:border-[#23e5db] focus:ring-[#23e5db]"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={errors.email}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-[#23e5db] focus:ring-[#23e5db]"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#002f34] cursor-pointer"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: '#002f34' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm tracking-wide transition-all"
              style={{ backgroundColor: '#002f34' }}
              isLoading={isLoading}
            >
              {!isLoading && (
                <span className="flex items-center gap-2">
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 whitespace-nowrap">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Placeholder social buttons (styling only, no actual OAuth) */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', letter: 'G', color: '#EA4335' },
                { label: 'Facebook', letter: 'f', color: '#1877F2' },
              ].map(({ label, letter, color }) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm font-medium opacity-60 cursor-not-allowed select-none"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {letter}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </form>

          {/* Register link */}
          <p className="text-sm text-center text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold hover:underline transition-colors"
              style={{ color: '#002f34' }}
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Page with Suspense boundary for useSearchParams ----------
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#002f34', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
