'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HelpSearch() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Search for help articles..."
        className="pl-12 h-12"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
