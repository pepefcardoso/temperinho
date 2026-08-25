'use client';

import * as React from 'react';
import { useFieldArray, Controller, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { RecipeUnit } from '@/types/recipe';
import { getRecipeUnits } from '@/lib/api/recipe';
import { RecipeFormData } from '@/lib/schemas/recipeSchema';

interface IngredientsProps {
    control: Control<RecipeFormData>;
    register: UseFormRegister<RecipeFormData>;
    errors: FieldErrors<RecipeFormData>;
}

export function RecipeFormIngredients({ control, register, errors }: IngredientsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients",
    });

    const [units, setUnits] = React.useState<RecipeUnit[]>([]);

    React.useEffect(() => {
        const fetchUnits = async () => {
            try {
                const fetchedUnits = await getRecipeUnits({limit: 100});
                setUnits(fetchedUnits);
            } catch (error) {
                console.error("Falha ao buscar unidades de medida:", error);
            }
        };
        fetchUnits();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ingredientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => {
                    const errorForField = errors.ingredients?.[index];
                    return (
                        <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg bg-background">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                                <div>
                                    <Label htmlFor={`ingredients-${index}-quantity`}>Quantidade</Label>
                                    <Input
                                        id={`ingredients-${index}-quantity`}
                                        {...register(`ingredients.${index}.quantity`)}
                                        type="text"
                                        aria-invalid={!!errorForField?.quantity}
                                    />
                                    {errorForField?.quantity && <p className="text-sm text-destructive mt-1" role="alert">{errorForField.quantity.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor={`ingredients-${index}-unit_id`}>Unidade</Label>
                                    <Controller
                                        name={`ingredients.${index}.unit_id`}
                                        control={control}
                                        render={({ field: selectField }) => (
                                            <Select onValueChange={selectField.onChange} value={String(selectField.value)}>
                                                <SelectTrigger id={`ingredients-${index}-unit_id`} aria-invalid={!!errorForField?.unit_id}>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {units.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errorForField?.unit_id && <p className="text-sm text-destructive mt-1" role="alert">{errorForField.unit_id.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor={`ingredients-${index}-name`}>Ingrediente</Label>
                                    <Input
                                        id={`ingredients-${index}-name`}
                                        {...register(`ingredients.${index}.name`)}
                                        aria-invalid={!!errorForField?.name}
                                    />
                                    {errorForField?.name && <p className="text-sm text-destructive mt-1" role="alert">{errorForField.name.message}</p>}
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                aria-label={`Remover ingrediente ${index + 1}`}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    );
                })}

                {errors.ingredients?.root && <p className="text-sm text-destructive mt-2" role="alert">{errors.ingredients.root.message}</p>}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ name: '', quantity: '', unit_id: '' })}
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Ingrediente
                </Button>
            </CardContent>
        </Card>
    );
}