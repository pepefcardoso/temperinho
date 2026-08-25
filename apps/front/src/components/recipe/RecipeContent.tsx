'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Recipe } from '@/types/recipe';
import { cn } from '@/lib/utils';

interface RecipeContentProps {
    recipe: Recipe;
}

export function RecipeContent({ recipe }: RecipeContentProps) {
    const [currentStep, setCurrentStep] = useState(-1);

    const hasIngredients = recipe.ingredients && recipe.ingredients.length > 0;
    const hasSteps = recipe.steps && recipe.steps.length > 0;

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <Tabs defaultValue={hasIngredients ? "ingredients" : "instructions"} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2 h-auto">
                        {hasIngredients && <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>}
                        {hasSteps && <TabsTrigger value="instructions">Modo de Preparo</TabsTrigger>}
                    </TabsList>

                    {hasIngredients && (
                        <TabsContent value="ingredients">
                            <div className="bg-card rounded-xl p-6 shadow-sm border">
                                <h3 className="text-xl font-semibold text-foreground mb-6">Ingredientes para {recipe.portion} porções</h3>
                                <ul className="space-y-4">
                                    {recipe.ingredients?.map((ing, index) => (
                                        <li key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg border">
                                            <div>
                                                <span className="font-medium text-foreground">{ing.quantity} {ing.unit?.name}</span>
                                                <span className="ml-2 text-foreground/80">{ing.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>
                    )}

                    {hasSteps && (
                        <TabsContent value="instructions">
                            <div className="bg-card rounded-xl p-6 shadow-sm border">
                                <h3 className="text-xl font-semibold text-foreground mb-6">Modo de Preparo</h3>
                                <div className="space-y-4">
                                    {recipe.steps?.map((step, index) => (
                                        <div
                                            key={step.id}
                                            className={cn('flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer',
                                                currentStep === index ? 'bg-primary/10 border-l-4 border-primary' : 'bg-muted hover:bg-muted/80'
                                            )}
                                            onClick={() => setCurrentStep(index)}
                                        >
                                            <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                                                currentStep === index ? 'bg-primary text-primary-foreground' : 'bg-border text-foreground'
                                            )}>
                                                {step.order}
                                            </div>
                                            <p className="text-foreground/90 leading-relaxed pt-1">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </section>
    );
}