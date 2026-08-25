import { ArticleForm } from '@/components/blog/ArticleForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Novo Artigo | Temperinho',
};

export default function NewArticlePage() {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-1">Criar Novo Artigo</h1>
                    <p className="text-muted-foreground">Compartilhe seu conhecimento com a comunidade.</p>
                </div>
                <ArticleForm action="create" />
            </div>
        </div>
    );
}
