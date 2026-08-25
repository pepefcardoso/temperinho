'use client';

import { useState } from 'react';
import { Bookmark, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Post } from '@/types/blog';
import { useAuth } from '@/context/AuthContext';
import { toggleFavoritePost } from '@/lib/api/user';

interface PostActionsProps {
    post: Post;
}

export function PostActions({ post }: PostActionsProps) {
    const { user } = useAuth();
    const [isFavorited, setIsFavorited] = useState(post.is_favorited ?? false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFavoriteClick = async () => {
        if (!user) {
            toast.error("Você precisa estar logado para salvar artigos.");
            return;
        }

        setIsLoading(true);
        const originalState = isFavorited;
        setIsFavorited(!originalState);

        try {
            await toggleFavoritePost(post.id);
            toast.success(originalState ? "Artigo removido dos salvos!" : "Artigo salvo com sucesso!");
        } catch (error) {
            setIsFavorited(originalState);
            toast.error("Ocorreu um erro. Tente novamente.");
            console.error("Erro ao favoritar post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.summary,
            url: window.location.href,
        };
        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link do artigo copiado para a área de transferência!');
        }
    };

    return (
        <div className="flex flex-wrap gap-3">
            <Button
                variant="outline"
                onClick={handleFavoriteClick}
                disabled={isLoading}
                aria-pressed={isFavorited}
                className={cn(isFavorited && 'border-primary text-primary hover:text-primary')}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    <Bookmark className={cn('h-4 w-4 mr-2', isFavorited && 'fill-primary')} />
                )}
                {isFavorited ? 'Salvo' : 'Salvar'}
            </Button>
            <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
            </Button>
        </div>
    );
}
