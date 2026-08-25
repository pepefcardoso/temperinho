'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Grid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getRecipes } from '@/lib/api/recipe';
import { Recipe, RecipeDiet, RecipeCategory } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import AdBanner from '../marketing/AdBanner';
import { RecipeFilterControls } from './RecipeFilterControls';
import { motion, AnimatePresence } from 'framer-motion';

type SortByType = 'created_at' | 'time' | 'difficulty';

interface RecipesPageClientProps {
  initialRecipes: Recipe[];
  initialMeta: { current_page: number; last_page: number; };
  categories: RecipeCategory[];
  diets: RecipeDiet[];
}

export function RecipesPageClient({
  initialRecipes,
  initialMeta,
  categories,
  diets
}: RecipesPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [recipes, setRecipes] = useState(initialRecipes);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(initialMeta.current_page + 1);
  const [hasMore, setHasMore] = useState(initialMeta.current_page < initialMeta.last_page);
  const [isLoadingMore, startTransition] = useTransition();

  const updateUrlParam = (key: string, value: string | number[] | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === null || value === 'todos' || (Array.isArray(value) && value.length === 0)) {
      current.delete(key);
    } else {
      current.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    const search = current.toString();
    const newQuery = search ? `?${search}` : "";
    router.push(`${pathname}${newQuery}`);
  }

  const loadMoreRecipes = () => {
    startTransition(async () => {
      try {
        const paginatedResponse = await getRecipes({
          page,
          limit: 9,
          sortBy: (searchParams.get('sortBy') as SortByType) || undefined,
          filters: {
            search: searchParams.get('search') || undefined,
            category_id: Number(searchParams.get('category_id')) || undefined,
            diets: searchParams.get('diets')?.split(',').map(Number) || [],
          },
        });

        const newRecipes = paginatedResponse.data;
        if (newRecipes.length > 0) {
          setRecipes(prev => [...prev, ...newRecipes]);
          setPage(prev => prev + 1);
        }
        setHasMore(paginatedResponse.meta.current_page < paginatedResponse.meta.last_page);
      } catch (error) {
        console.error("Falha ao carregar mais receitas:", error);
      }
    });
  };

  const currentSortBy = (searchParams.get('sortBy') as SortByType) || 'created_at';
  const currentCategory = searchParams.get('category_id') || 'todos';
  const currentDiets = searchParams.get('diets')?.split(',').map(Number).filter(Boolean) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <RecipeFilterControls
        query={query}
        onQueryChange={setQuery}
        onSearchSubmit={() => updateUrlParam('search', query.trim() || null)}
        categories={categories}
        selectedCategory={currentCategory}
        onCategoryChange={(value) => updateUrlParam('category_id', value)}
        diets={diets}
        selectedDiets={currentDiets}
        onDietToggle={(dietId) => {
          const newDiets = currentDiets.includes(dietId)
            ? currentDiets.filter(id => id !== dietId)
            : [...currentDiets, dietId];
          updateUrlParam('diets', newDiets);
        }}
        onClearDiets={() => updateUrlParam('diets', null)}
        sortBy={currentSortBy}
        onSortByChange={(value) => updateUrlParam('sortBy', value)}
      />

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Mostrando {recipes.length} receita{recipes.length !== 1 ? 's' : ''}
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Ver em grade"><Grid className="h-4 w-4" /></Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="Ver em lista"><List className="h-4 w-4" /></Button>
            </div>
          </div>

          <AnimatePresence>
            {recipes.length > 0 ? (
              <motion.div
                layout
                className={cn('grid gap-8', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}
              >
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <RecipeCard recipe={recipe} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 border-2 border-dashed rounded-lg"
              >
                <p className="text-muted-foreground">Nenhuma receita encontrada para os filtros selecionados.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-12">
            {hasMore && (
              <Button size="lg" onClick={loadMoreRecipes} disabled={isLoadingMore}>
                {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Carregar Mais Receitas
              </Button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block w-80 space-y-6 flex-shrink-0">
          <AdBanner href='/marketing' layout="sidebar" />
        </aside>
      </div>
    </div>
  );
}