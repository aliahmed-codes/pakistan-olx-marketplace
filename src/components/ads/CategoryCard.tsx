'use client';

import Link from 'next/link';
import {
  Smartphone,
  Car,
  Home,
  Bike,
  Monitor,
  Briefcase,
  Sofa,
  Shirt,
  Wrench,
  BookOpen,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Car,
  Home,
  Bike,
  Monitor,
  Briefcase,
  Sofa,
  Shirt,
  Wrench,
  BookOpen,
};

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
  };
  adCount: number;
}

export function CategoryCard({ category, adCount }: CategoryCardProps) {
  const Icon = category.icon ? iconMap[category.icon] : null;

  return (
    <Link href={`/category/${category.slug}`}>
      <div className="category-card flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-olx-accent hover:shadow-md transition-all duration-300">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-olx/5 flex items-center justify-center mb-3">
          {Icon ? (
            <Icon className="h-8 w-8 text-olx" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-olx/20" />
          )}
        </div>

        {/* Name */}
        <h3 className="font-medium text-gray-900 text-center">{category.name}</h3>

        {/* Ad Count */}
        <p className="text-sm text-gray-500 mt-1">
          {adCount} {adCount === 1 ? 'ad' : 'ads'}
        </p>
      </div>
    </Link>
  );
}
