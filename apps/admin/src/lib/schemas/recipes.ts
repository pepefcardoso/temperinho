import { z } from "zod";

export const recipeDietSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
});

export type RecipeDietFormData = z.infer<typeof recipeDietSchema>;

export const recipeCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
});

export type RecipeCategoryFormData = z.infer<typeof recipeCategorySchema>;

export const recipeUnitSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
});

export type RecipeUnitFormData = z.infer<typeof recipeUnitSchema>;
