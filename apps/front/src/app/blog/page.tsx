import { Suspense } from 'react'
import { getPosts, getPostCategories } from '@/lib/api/blog'
import type { Post, PostCategory } from '@/types/blog'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSkeleton } from '@/components/skeletons/BlogSkeleton'
import MarketingSection from '@/components/marketing/MarketingSection'
import { BlogFilterControls } from '@/components/blog/BlogFiltersControls'

async function PostList({
  categoryId,
  search,
}: {
  categoryId?: number
  search?: string
}) {
  try {
    const paginatedResponse = await getPosts({
      filters: { category_id: categoryId, search },
      limit: 100,
    })
    const allPosts = paginatedResponse.data

    if (!allPosts || allPosts.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-12">
          Nenhum artigo encontrado com os filtros selecionados.
        </p>
      )
    }

    return (
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post: Post) => (
            <BlogPostCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      </section>
    )
  } catch (error) {
    console.error('Falha ao carregar posts:', error)
    return (
      <p className="text-center text-muted-foreground py-12">
        Não foi possível carregar os artigos. Tente novamente mais tarde.
      </p>
    )
  }
}

export default async function BlogPage(props: {
  searchParams: Promise<{
    category_id?: string
    search?: string
  }>
}) {
  const sp = await props.searchParams
  const { category_id, search } = sp
  const currentCategoryId = category_id ? parseInt(category_id, 10) : undefined
  const currentSearchFilter = search

  let categories: PostCategory[] = [];
  try {
    categories = await getPostCategories({ limit: 50 });
  } catch (error) {
    console.error('Falha ao carregar categorias de post:', error);
  }

  const suspenseKey = `posts-${category_id ?? 'todas'}-${search ?? 'tudo'}`

  return (
    <div className="bg-background">
      <main>
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Dicas e novidades da culinária inclusiva
            </p>
          </div>
        </section>

        <section className="py-8 border-y bg-card">
          <BlogFilterControls
            categories={categories}
            initialCategoryId={category_id}
            initialQuery={currentSearchFilter}
          />
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Suspense key={suspenseKey} fallback={<BlogSkeleton />}>
              <PostList
                categoryId={currentCategoryId}
                search={currentSearchFilter}
              />
            </Suspense>
          </div>
        </section>

        <MarketingSection
          adBannerHref="/marketing"
          adBannerImageUrl=""
          adBannerAltText="Anuncie conosco e conecte-se com nossa comunidade"
          googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_LEADERBOARD || ''}
        />
      </main>
    </div>
  )
}