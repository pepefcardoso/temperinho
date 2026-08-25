'use client';

import * as React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RecipeDiet } from '@/types/recipe';
import { getRecipeDiets } from '@/lib/api/recipe';
import { RecipeFormData } from '@/lib/schemas/recipeSchema';

interface DietsProps {
    control: Control<RecipeFormData>;
    errors: FieldErrors<RecipeFormData>;
}

export function RecipeFormDiets({ control, errors }: DietsProps) {
    const [diets, setDiets] = React.useState<RecipeDiet[]>([]);

    React.useEffect(() => {
        const fetchDiets = async () => {
            try {
                const fetchedDiets = await getRecipeDiets({limit: 100});
                setDiets(fetchedDiets);
            } catch (error) {
                console.error("Falha ao buscar as dietas:", error);
            }
        };
        fetchDiets();
    }, []);

    return (
        <Card>
            <CardHeader><CardTitle>Dietas Específicas</CardTitle></CardHeader>
            <CardContent>
                <Controller
                    name="diets"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                            {diets.map(diet => (
                                <Button
                                    key={diet.id}
                                    type="button"
                                    variant={field.value?.includes(diet.id) ? 'default' : 'outline'}
                                    onClick={() => {
                                        const currentValue = Array.isArray(field.value) ? field.value : [];
                                        const newValue = currentValue.includes(diet.id)
                                            ? currentValue.filter(id => id !== diet.id)
                                            : [...currentValue, diet.id];
                                        field.onChange(newValue);
                                    }}
                                >
                                    {diet.name}
                                </Button>
                            ))}
                        </div>
                    )}
                />
                {errors.diets && (
                    <p className="text-sm text-destructive mt-2" role="alert">
                        {errors.diets.message}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}