'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  subCategories: SubCategory[];
  categorySlug: string;
}

export default function CategoryFilters({ subCategories, categorySlug }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSub = searchParams.get('sub') || '';

  const setFilter = useCallback(
    (subSlug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (subSlug) {
        params.set('sub', subSlug);
      } else {
        params.delete('sub');
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
      <button
        onClick={() => setFilter('')}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          currentSub === ''
            ? 'bg-pm text-white shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
        }`}
      >
        All
      </button>
      {subCategories.map((sub) => (
        <button
          key={sub.id}
          onClick={() => setFilter(sub.slug)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentSub === sub.slug
              ? 'bg-pm text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
          }`}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
