'use client';

import Link from 'next/link';
import { Heart, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Post } from '@/types/blog';
import { formatDate } from '@/lib/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toggleFavoritePost } from '@/lib/api/user';

interface FavoriteArticleCardProps {
    article: Post;
    onRemove: (id: number) => void;
}

export function FavoriteArticleCard({ article, onRemove }: FavoriteArticleCardProps) {
    const handleRemoveFavorite = async () => {
        toast.loading("Removendo favorito...");
        try {
            await toggleFavoritePost(article.id);
            toast.dismiss();
            toast.success("Artigo removido dos favoritos!");
            onRemove(article.id);
        } catch (error) {
            toast.dismiss();
            toast.error("Falha ao remover o favorito. Tente novamente.");
            console.error(error);
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">{article.category?.name ?? 'Artigo'}</Badge>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.summary}</p>
                    <div className="flex items-center flex-wrap text-xs text-muted-foreground gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500" />
                            {(article.average_rating ?? 0).toFixed(1)} ({article.ratings_count ?? 0} avaliações)
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Publicado em {formatDate(article.created_at, "dd/MM/yyyy")}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 self-start pt-2 sm:pt-0 w-full sm:w-auto">
                    <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/blog/${article.id}`}>Ler Artigo</Link>
                    </Button>
                    <Button variant="destructive-outline" size="sm" onClick={handleRemoveFavorite} className="w-full">
                        <Heart className="h-4 w-4 mr-2" />Remover
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}