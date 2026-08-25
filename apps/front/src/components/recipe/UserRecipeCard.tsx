'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Star, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Recipe } from '@/types/recipe';
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
import { deleteRecipe } from '@/lib/api/recipe';

interface UserRecipeCardProps {
    recipe: Recipe;
    onDelete: (id: number) => void;
}

export function UserRecipeCard({ recipe, onDelete }: UserRecipeCardProps) {
    const handleDelete = async () => {
        toast.loading("Deletando receita...");
        try {
            await deleteRecipe(recipe.id);
            toast.dismiss();
            toast.success("Receita deletada com sucesso!");
            onDelete(recipe.id);
        } catch (error) {
            toast.dismiss();
            toast.error("Falha ao deletar a receita. Tente novamente.");
            console.error("Erro ao deletar receita:", error);
        }
    };

    return (
        <Card className="group overflow-hidden transition-shadow hover:shadow-md">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                        src={recipe.image?.url ?? '/images/placeholder.svg'}
                        alt={recipe.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <div>
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{recipe.title}</h3>
                            {recipe.category && (
                                <Badge variant="secondary">{recipe.category.name}</Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{recipe.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto pt-3 border-t">
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500" />
                                {(recipe.average_rating ?? 0).toFixed(1)} ({recipe.ratings_count ?? 0} avaliações)
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {recipe.time} min
                            </div>
                        </div>
                        <div className="flex gap-2 self-end mt-4 sm:mt-0">
                            <Button variant="outline" size="icon" asChild aria-label="Editar receita">
                                <Link href={`/usuario/receitas/editar/${recipe.id}`}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive-outline" size="icon" aria-label="Deletar receita">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Essa ação não pode ser desfeita. Isso irá deletar permanentemente a receita {`"${recipe.title}"`} dos nossos servidores.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>
                                            Sim, deletar receita
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}