import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getRecipes, getRecipeDiets, getRecipeCategories } from '@/lib/api/recipe';
import { RecipesPageClient } from '@/components/recipe/RecipePageClient';
import { PageSkeleton } from '@/components/skeletons/PageSkeleton';
import { Recipe, RecipeDiet, RecipeCategory } from '@/types/recipe';
import MarketingSection from '@/components/marketing/MarketingSection';

export const metadata: Metadata = {
  title: 'Receitas | Temperinho',
  description: 'Explore centenas de receitas deliciosas e inclusivas.',
};

async function RecipesList({
  searchParams,
}: {
  searchParams: {
    search?: string
    category_id?: string
    sortBy?: 'created_at' | 'time' | 'difficulty'
    diets?: string
  }
}) {
  const dietFilters = searchParams.diets
    ? searchParams.diets.split(',').map(Number).filter(id => !isNaN(id))
    : [];

  let paginatedResponse: {
    data: Array<Recipe>
    meta: {
      total: number
      per_page: number
      current_page: number
      last_page: number
    }
  };

  let categories: RecipeCategory[] = [];
  let diets: RecipeDiet[] = [];

  try {
    const [recipesResponse, categoriesResponse, dietsResponse] = await Promise.all([
      getRecipes({
        sortBy: searchParams.sortBy,
        filters: {
          search: searchParams.search,
          category_id: searchParams.category_id
            ? Number(searchParams.category_id)
            : undefined,
          diets: dietFilters,
        },
        page: 1,
        limit: 9,
      }),
      getRecipeCategories({limit: 100}),
      getRecipeDiets({limit: 100}),
    ]);

    paginatedResponse = recipesResponse;
    categories = categoriesResponse;
    diets = dietsResponse;
  } catch {
    paginatedResponse = {
      data: [],
      meta: {
        total: 0,
        per_page: 9,
        current_page: 1,
        last_page: 1,
      },
    };
    categories = [];
    diets = [];
  }

  return (
    <RecipesPageClient
      initialRecipes={paginatedResponse.data}
      initialMeta={paginatedResponse.meta}
      categories={categories}
      diets={diets}
    />
  );
}

export default async function RecipesPage(props: {
  searchParams: Promise<{
    search?: string
    category_id?: string
    sortBy?: 'created_at' | 'time' | 'difficulty'
    diets?: string
  }>
}) {
  const params = await props.searchParams;

  return (
    <main>
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Nossas Receitas
          </h1>
          <p className="text-lg text-muted-foreground">
            Encontre o prato perfeito para qualquer ocasião.
          </p>
        </div>
      </section>

      <Suspense
        key={JSON.stringify(params)}
        fallback={
          <PageSkeleton
            layout="content-sidebar"
            sidebarPosition="right"
          />
        }
      >
        <RecipesList searchParams={params} />
      </Suspense>

      <MarketingSection
        adBannerHref="/marketing"
        adBannerImageUrl=""
        adBannerAltText="Anuncie conosco e conecte-se com nossa comunidade"
        googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPES_LEADERBOARD || ''}
      />
    </main>
  );
}