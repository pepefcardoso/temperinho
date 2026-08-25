'use client';

import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { RecipeDiet } from '@/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface DietaryFiltersProps {
    diets: RecipeDiet[];
    selectedDiets: number[];
    onDietToggle: (dietId: number) => void;
    onClearDiets: () => void;
}

const filterButtonVariants = cva(
    "transition-all duration-200 rounded-full text-sm",
    {
        variants: {
            selected: {
                true: "bg-primary text-primary-foreground hover:bg-primary/90",
                false: "bg-muted text-foreground hover:bg-accent"
            }
        }
    }
);

export function DietaryFilters({ diets, selectedDiets, onDietToggle, onClearDiets }: DietaryFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Restrições Dietéticas</CardTitle>
                    {selectedDiets.length > 0 && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={onClearDiets}
                            className="text-destructive p-0 h-auto flex items-center gap-1"
                        >
                            <X className="h-4 w-4" /> Limpar
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {diets.map(diet => {
                        const isSelected = selectedDiets.includes(diet.id);
                        return (
                            <Button
                                key={diet.id}
                                onClick={() => onDietToggle(diet.id)}
                                aria-pressed={isSelected}
                                variant={isSelected ? 'default' : 'outline'}
                                size="sm"
                                className={cn(filterButtonVariants({ selected: isSelected }))}
                            >
                                {diet.name}
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
};