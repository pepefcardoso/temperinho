'use client';

import { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Comment } from '@/types/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, MoreVertical, Trash2, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getComments, InteractableType } from '@/lib/api/interactions';
import { deleteComment, updateComment } from '@/lib/api/interactions.server';
import { AxiosError } from 'axios';
interface CommentListProps {
    type: InteractableType;
    id: number;
}

export function CommentList({ type, id }: CommentListProps) {
    const { user, isAuthenticated } = useAuth();

    const [comments, setComments] = useState<Comment[]>([]);
    const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const [page, setPage] = useState(1);

    const [isPending, startTransition] = useTransition();
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const commentPage = await getComments(type, id, page);
                setComments(commentPage.data);
                setMeta(commentPage.meta);
            } catch (err) {
                setError(err as Error | AxiosError);
                toast.error('Não foi possível carregar os comentários.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [type, id, page]);

    const handleEditClick = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    const handleUpdate = async () => {
        if (!editingCommentId || !editingContent.trim()) {
            toast.error('O comentário não pode estar vazio.');
            return;
        };

        startTransition(async () => {
            try {
                const updatedComment = await updateComment(editingCommentId, editingContent);
                setComments(currentComments =>
                    currentComments.map(c => (c.id === updatedComment.id ? updatedComment : c))
                );
                toast.success('Comentário atualizado!');
                handleCancelEdit();
            } catch (err) {
                console.error(err);
                toast.error('Falha ao atualizar o comentário.');
            }
        });
    };

    const handleDelete = async (commentId: number) => {
        startTransition(async () => {
            try {
                await deleteComment(commentId);
                setComments(currentComments => currentComments.filter(c => c.id !== commentId));
                toast.success('Comentário deletado!');
            } catch (err) {
                console.error(err);
                toast.error('Falha ao deletar o comentário.');
            }
        });
    };

    if (isLoading) return <p className="text-center py-4">Carregando comentários...</p>;
    if (error) return <div className="text-center py-4 text-red-500">Falha ao carregar os comentários.</div>;

    return (
        <div className="space-y-6 mt-8">
            {!isLoading && comments.length === 0 && (
                <p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p>
            )}

            {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                    <Avatar>
                        <AvatarImage src={comment.author.image?.url ?? '/images/avatar-placeholder.png'} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{comment.author.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                                </p>
                            </div>
                            {isAuthenticated && user?.id === comment.author.id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={isPending}>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleEditClick(comment)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editar</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(comment.id)} className="text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Deletar</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                        {editingCommentId === comment.id ? (
                            <div className="mt-2 space-y-2">
                                <Textarea
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    rows={3}
                                />
                                <div className="flex space-x-2">
                                    <Button onClick={handleUpdate} size="sm" disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Salvar
                                    </Button>
                                    <Button onClick={handleCancelEdit} variant="ghost" size="sm">Cancelar</Button>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                        )}
                    </div>
                </div>
            ))}

            {meta && meta.last_page > 1 && (
                <div className="flex justify-center space-x-2 pt-4">
                    <Button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                        Anterior
                    </Button>
                    <span className="self-center">
                        Página {meta.current_page} de {meta.last_page}
                    </span>
                    <Button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page}>
                        Próxima
                    </Button>
                </div>
            )}
        </div>
    );
}