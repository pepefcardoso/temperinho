import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Category {
  id: string | number;
  name: string;
}

interface UseFilterableListProps<T extends { id: string | number }> {
  initialItems: T[];
  fetchCategories: () => Promise<Category[]>;
}

export const useFilterableList = <T extends { id: string | number }>({
  initialItems,
  fetchCategories,
}: UseFilterableListProps<T>) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const fetched = await fetchCategories();
        setCategories(fetched);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    getCategories();
  }, [fetchCategories]);

  const handleFilterChange = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, replace, searchParams]
  );

  const debouncedSearch = useDebouncedCallback((term: string) => {
    handleFilterChange('search', term);
  }, 500);

  const removeItemById = useCallback((id: T['id']) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return {
    items,
    categories,
    isLoadingCategories,
    isPending,
    searchParams,
    handleFilterChange,
    debouncedSearch,
    removeItemById,
  };
};
