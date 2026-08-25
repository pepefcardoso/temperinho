'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Post } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deletePost } from '@/lib/api/blog';

interface UserArticleCardProps {
    article: Post;
    onDelete: (id: number) => void;
}

export function UserArticleCard({ article, onDelete }: UserArticleCardProps) {
    const handleDelete = async () => {
        toast.loading("Deletando artigo...");
        try {
            await deletePost(article.id);
            toast.dismiss();
            toast.success("Artigo deletado com sucesso!");
            onDelete(article.id);
        } catch (error) {
            toast.dismiss();
            toast.error("Falha ao deletar o artigo. Tente novamente.");
            console.error("Erro ao deletar post:", error);
        }
    };

    return (
        <Card className="group overflow-hidden transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0">
                    <Image
                        src={article.image?.url || '/images/placeholder.svg'}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover"
                    />
                </div>

                <CardContent className="p-4 flex flex-1 flex-col justify-between">
                    <div>
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
                            {article.category && (
                                <Badge variant="secondary">{article.category.name}</Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.summary}</p>
                        <div className="flex items-center flex-wrap text-xs text-muted-foreground gap-x-4 gap-y-1">
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500" />
                                {(article.average_rating ?? 0).toFixed(1)} ({article.ratings_count ?? 0} avaliações)
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Criado em {format(new Date(article.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 self-end mt-4">
                        <Button variant="outline" size="icon" asChild aria-label="Editar artigo">
                            <Link href={`/usuario/artigos/editar/${article.id}`}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive-outline" size="icon" aria-label="Deletar artigo">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Isso irá deletar permanentemente o artigo &quot;{article.title}&quot;.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Sim, deletar artigo
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}