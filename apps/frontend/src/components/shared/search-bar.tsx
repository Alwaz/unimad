'use client';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') ?? '');

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  };

  const hasQuery = !!searchTerm;

  return (
    <InputGroup className="w-full">
      <InputGroupInput
        placeholder="Search for a program or university..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {hasQuery && (
        <InputGroupAddon align="inline-end">
          <Button variant="ghost" type="button" onClick={clearSearch} aria-label="Clear search">
            <X className="h-4 w-4" />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
