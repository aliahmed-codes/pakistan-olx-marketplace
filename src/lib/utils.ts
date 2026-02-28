import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | Decimal): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice).replace('PKR', 'Rs');
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  
  return formatDate(d);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isValidPhone(phone: string): boolean {
  // Pakistani phone number validation
  const phoneRegex = /^((\+92)|(0092)|0)?3\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function sanitizePhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+92')) return cleaned;
  if (cleaned.startsWith('0092')) return '+' + cleaned.slice(2);
  if (cleaned.startsWith('0')) return '+92' + cleaned.slice(1);
  return '+92' + cleaned;
}

export function getImageUrl(image: string | null | undefined, fallback: string = '/images/placeholder.jpg'): string {
  if (!image) return fallback;
  if (image.startsWith('http')) return image;
  return image;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Type for Decimal from Prisma
type Decimal = {
  toString(): string;
  toNumber(): number;
};

export const cities = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Gujranwala',
  'Sialkot',
  'Multan',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Sargodha',
];

export const conditions = [
  { value: 'NEW', label: 'New', color: 'bg-green-100 text-green-800' },
  { value: 'USED', label: 'Used', color: 'bg-orange-100 text-orange-800' },
];

export const reportReasons = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'FRAUD', label: 'Fraud' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate Content' },
  { value: 'DUPLICATE', label: 'Duplicate Ad' },
  { value: 'OTHER', label: 'Other' },
];
