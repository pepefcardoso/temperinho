import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getRecipeById } from '@/lib/api/recipe'
import { RecipeHeader } from '@/components/recipe/RecipeHeader'
import { RecipeContent } from '@/components/recipe/RecipeContent'
import { CommentsSection } from '@/components/comments/CommentsSection'
import MarketingSection from '@/components/marketing/MarketingSection'

type RecipePageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
  props: RecipePageProps
): Promise<Metadata> {
  const { id } = await props.params
  const recipeId = parseInt(id, 10)
  if (isNaN(recipeId) || recipeId <= 0) {
    return { title: 'Receita não encontrada' }
  }

  try {
    const recipe = await getRecipeById(recipeId)
    return {
      title: `${recipe.title} | Temperinho`,
      description: recipe.description,
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        images: [
          {
            url: recipe.image?.url ?? '/images/og-image.png',
            width: 1200,
            height: 630,
          },
        ],
      },
    }
  } catch (error) {
    console.error('Erro ao buscar receita para metadata:', error)
    return { title: 'Receita não encontrada' }
  }
}

export default async function RecipeDetailPage(
  props: RecipePageProps
) {
  const { id } = await props.params
  const recipeId = parseInt(id, 10)
  if (isNaN(recipeId) || recipeId <= 0) notFound()

  try {
    const recipe = await getRecipeById(recipeId)
    return (
      <div className="bg-background">
        <main>
          <RecipeHeader recipe={recipe} />
          <RecipeContent recipe={recipe} />
          <CommentsSection type="recipes" id={recipeId} />
          <MarketingSection
            adBannerHref="/marketing"
            adBannerImageUrl=""
            adBannerAltText="Anuncie conosco e conecte-se com nossa comunidade"
            googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPE_DETAIL || ''}
          />
        </main>
      </div>
    )
  } catch (error) {
    console.error('Falha ao buscar a receita:', error)
    notFound()
  }
}
