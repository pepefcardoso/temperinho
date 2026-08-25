'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Calendar } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { Post } from '@/types/blog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const cardVariants = cva(
    "group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border h-full",
    {
        variants: {
            variant: {
                default: "flex flex-col hover:-translate-y-1",
                featured: "relative text-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface BlogPostCardProps extends VariantProps<typeof cardVariants> {
    post: Post;
    className?: string;
}

const MetaInfo = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center">
        <Icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
        <span className="truncate">{text}</span>
    </div>
);

export function BlogPostCard({ post, variant = "default", className }: BlogPostCardProps) {
    const href = `/blog/${post.id}`;

    const imageSizes = variant === 'featured'
        ? '(max-width: 1024px) 100vw, 75vw'
        : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

    return (
        <article className={cn(cardVariants({ variant }), className)}>
            <Link href={href} className="block w-full h-full" aria-label={`Ler o artigo ${post.title}`}>
                <div className={cn("relative w-full overflow-hidden", variant === 'featured' ? 'h-full' : 'aspect-video')}>
                    <Image
                        src={post.image?.url ?? '/images/placeholder.svg'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes={imageSizes}
                    />
                    {variant === 'featured' && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>}
                </div>

                <div className={cn("flex flex-1 flex-col", variant === 'featured' ? 'absolute bottom-0 left-0 p-6 w-full' : 'p-4 md:p-6')}>
                    {variant === 'featured' ? (
                        <Badge className="w-fit">Destaque</Badge>
                    ) : (
                        <Badge variant="secondary" className="w-fit mb-2">{post.category?.name ?? 'Sem Categoria'}</Badge>
                    )}

                    <h3 className={cn(
                        "font-semibold line-clamp-2 group-hover:text-primary transition-colors",
                        variant === 'featured' ? 'text-2xl text-white mt-2 font-display' : 'text-lg text-foreground mb-3'
                    )}>
                        {post.title}
                    </h3>

                    {variant === 'featured' && (
                        <p className="mt-2 text-sm text-neutral-200 line-clamp-2">{post.summary}</p>
                    )}

                    {variant === 'default' && (
                        <>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                                {post.summary}
                            </p>
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
                                <MetaInfo icon={User} text={post.author?.name ?? 'Autor Desconhecido'} />
                                <MetaInfo icon={Calendar} text={format(new Date(post.created_at), "dd MMM yyyy", { locale: ptBR })} />
                            </div>
                        </>
                    )}
                </div>
            </Link>
        </article>
    );
}