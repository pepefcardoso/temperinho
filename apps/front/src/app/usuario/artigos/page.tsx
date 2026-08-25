import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getMyPosts } from '@/lib/api/blog.server'
import { Button } from '@/components/ui/button'
import { UserArticlesClient } from '@/components/blog/UserArticlesClient'
import { PageSkeleton } from '@/components/skeletons/PageSkeleton'

export const metadata: Metadata = {
    title: 'Meus Artigos | Temperinho',
    description: 'Gerencie, edite e crie seus artigos e posts para a comunidade Temperinho.',
}

interface LoaderParams {
    search?: string
    category_id?: string
}

async function ArticlesLoader({ searchParams }: { searchParams: LoaderParams }) {
    try {
        const paginatedResponse = await getMyPosts({
            search: searchParams.search,
            categoryId: searchParams.category_id,
        })

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">Meus Artigos</h1>
                        <p className="text-muted-foreground">Gerencie seus artigos publicados e rascunhos.</p>
                    </div>
                    <Button asChild>
                        <Link href="/usuario/artigos/novo">
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Artigo
                        </Link>
                    </Button>
                </div>
                <UserArticlesClient initialArticles={paginatedResponse.data} />
            </div>
        )
    } catch (error) {
        console.error('Falha ao carregar os artigos do usuário:', error)
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-bold text-destructive">Ocorreu um Erro</h2>
                <p className="text-muted-foreground mt-2">
                    Não foi possível carregar seus artigos. Tente novamente.
                </p>
            </div>
        )
    }
}

export default async function UserMyArticlesPage({
    searchParams,
}: {
    searchParams: Promise<LoaderParams>
}) {
    const sp = await searchParams
    const suspenseKey = `artigos-${sp.category_id ?? 'todas'}-${sp.search ?? ''}`

    return (
        <div className="container mx-auto py-8">
            <Suspense key={suspenseKey} fallback={<PageSkeleton layout="single-column" />}>
                <ArticlesLoader searchParams={sp} />
            </Suspense>
        </div>
    )
}
