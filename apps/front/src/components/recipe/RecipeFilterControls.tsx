'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecipeCategory, RecipeDiet } from '@/types/recipe';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { DietaryFilters } from './DietaryFilters';

type SortByType = 'created_at' | 'time' | 'difficulty';

interface RecipeFilterControlsProps {
    query: string;
    onQueryChange: (value: string) => void;
    onSearchSubmit: () => void;

    categories: RecipeCategory[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;

    diets: RecipeDiet[];
    selectedDiets: number[];
    onDietToggle: (dietId: number) => void;
    onClearDiets: () => void;

    sortBy: SortByType;
    onSortByChange: (value: SortByType) => void;
}

export function RecipeFilterControls({
    query, onQueryChange, onSearchSubmit,
    categories, selectedCategory, onCategoryChange,
    diets, selectedDiets, onDietToggle, onClearDiets,
    sortBy, onSortByChange
}: RecipeFilterControlsProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-6 mb-8"
        >
            <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    id="search"
                    placeholder="Buscar por nome da receita... Ex: Bolo de chocolate"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-lg h-14 rounded-full shadow-lg border-2 border-transparent focus:border-primary focus:ring-primary"
                />
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <SlidersHorizontal className="h-5 w-5" />
                            Filtros Adicionais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="category">Categoria</Label>
                            <Select value={selectedCategory} onValueChange={onCategoryChange}>
                                <SelectTrigger id="category"><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todas as Categorias</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="sort">Ordenar por</Label>
                            <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortByType)}>
                                <SelectTrigger id="sort"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">Mais Recentes</SelectItem>
                                    <SelectItem value="time">Tempo de Preparo</SelectItem>
                                    <SelectItem value="difficulty">Dificuldade</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2">
                    <DietaryFilters
                        diets={diets}
                        selectedDiets={selectedDiets}
                        onDietToggle={onDietToggle}
                        onClearDiets={onClearDiets}
                    />
                </div>
            </div>
        </motion.div>
    );
}