import { ArticleForm } from '@/components/blog/ArticleForm';
import { getPostById } from '@/lib/api/blog';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Editar Artigo | Temperinho',
};

export default async function EditArticlePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const postId = parseInt(params.id, 10);

    if (isNaN(postId)) {
        notFound();
    }

    try {
        const article = await getPostById(postId);
        return (
            <div className="container mx-auto py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-1">Editar Artigo</h1>
                        <p className="text-muted-foreground">Ajuste e melhore seu conteúdo.</p>
                    </div>
                    <ArticleForm action="update" initialData={article} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Erro ao buscar artigo para edição:", error);
        notFound();
    }
}