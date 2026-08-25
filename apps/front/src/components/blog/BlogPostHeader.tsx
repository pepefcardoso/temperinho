'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Post } from '@/types/blog';
import { useAuth } from '@/context/AuthContext';
import { createOrUpdateRating, getUserRating } from '@/lib/api/interactions.server';
import { formatDate } from '@/lib/dateUtils';
import { PostActions } from '@/components/blog/PostActions';
import { StarRating } from '@/components/ui/StarRating';

interface BlogPostHeaderProps {
    article: Post;
    readTime: number;
}

const MetaItem = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
    <div className="flex items-center">
        <Icon className="h-4 w-4 mr-2" />
        {children}
    </div>
);

export function BlogPostHeader({ article, readTime }: BlogPostHeaderProps) {
    const { user } = useAuth();
    const [userRating, setUserRating] = useState<number | null>(null);
    const [isRatingLoading, setIsRatingLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsRatingLoading(false);
            return;
        }

        const fetchUserRating = async () => {
            try {
                const rating = await getUserRating('posts', article.id);
                if (rating) {
                    setUserRating(rating.rating);
                }
            } catch (error) {
                console.error("Erro ao buscar a avaliação do usuário:", error);
            } finally {
                setIsRatingLoading(false);
            }
        };

        fetchUserRating();
    }, [user, article.id]);

    const handleRatingChange = async (rating: number) => {
        if (!user) {
            toast.error("Você precisa estar logado para avaliar posts.");
            return;
        }
        try {
            const updatedRating = await createOrUpdateRating('posts', article.id, rating);
            setUserRating(updatedRating.rating);
            toast.success("Sua avaliação foi registrada com sucesso!");
        } catch (error) {
            console.error("Erro ao registrar avaliação:", error);
            toast.error("Ocorreu um erro ao registrar sua avaliação. Tente novamente.");
        }
    };


    return (
        <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                    <li className="select-none">/</li>
                    <li><span className="text-foreground">{article.category?.name ?? 'Artigo'}</span></li>
                </ol>
            </nav>
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                    {article.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{article.summary}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
                    <MetaItem icon={User}>{article.author?.name ?? 'Autor'}</MetaItem>
                    <MetaItem icon={Calendar}>
                        {formatDate(article.created_at, "dd 'de' MMMM 'de' yyyy")}
                    </MetaItem>
                    <MetaItem icon={Clock}>{readTime} min de leitura</MetaItem>
                    <MetaItem icon={Star}>
                        {(article.average_rating ?? 0).toFixed(1)} ({article.ratings_count ?? 0} avaliações)
                    </MetaItem>
                </div>

                {user && (
                    <div className="p-4 bg-muted rounded-lg space-y-2 my-6">
                        <p className="text-sm font-semibold text-center text-foreground">Sua Avaliação</p>
                        {isRatingLoading ? (
                            <div className="text-center text-sm text-muted-foreground">Carregando sua avaliação...</div>
                        ) : (
                            <div className="flex justify-center">
                                <StarRating
                                    key={userRating}
                                    initialRating={userRating ?? 0}
                                    onRating={handleRatingChange}
                                />
                            </div>
                        )}
                    </div>
                )}

                <PostActions post={article} />
            </div>
        </div>
    );
}