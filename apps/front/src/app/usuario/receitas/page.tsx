import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRecipesClient } from '@/components/recipe/UserRecipesClient';
import { getMyRecipes } from '@/lib/api/recipe.server';

export const metadata: Metadata = {
    title: 'Minhas Receitas | Temperinho',
    description: 'Gerencie, edite e crie suas próprias receitas deliciosas na plataforma Temperinho.',
};

export default async function UserMyRecipesPage(props: {
    searchParams: Promise<{
        search?: string;
        category_id?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    let paginated;

    try {
        paginated = await getMyRecipes({
            search: searchParams.search,
            categoryId: searchParams.category_id,
        });
    } catch (error) {
        console.error('Falha ao carregar as receitas do usuário:', error);
        return (
            <div className="container mx-auto py-16 text-center">
                <h2 className="text-xl font-bold text-destructive">Ocorreu um Erro</h2>
                <p className="text-muted-foreground mt-2">
                    Não foi possível carregar suas receitas. Verifique se você está logado e tente novamente.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Minhas Receitas</h1>
                    <p className="text-muted-foreground">Gerencie suas receitas publicadas e rascunhos.</p>
                </div>
                <Button asChild>
                    <Link href="/usuario/receitas/nova">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Receita
                    </Link>
                </Button>
            </div>
            <UserRecipesClient initialRecipes={paginated.data} />
        </div>
    );
}