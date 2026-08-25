import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(5, "O título precisa ter pelo menos 5 caracteres."),
  description: z
    .string()
    .min(20, "A descrição precisa de pelo menos 20 caracteres."),
  time: z.coerce.number().min(1, "O tempo de preparo é obrigatório."),
  portion: z.coerce.number().min(1, "O número de porções é obrigatório."),
  difficulty: z.coerce
    .number({ required_error: "Selecione a dificuldade." })
    .min(1, "Selecione a dificuldade."),
  category_id: z.coerce
    .number({ required_error: "Selecione uma categoria." })
    .min(1, "Selecione uma categoria."),
  diets: z.array(z.number()).min(1, "Selecione pelo menos uma dieta."),
  ingredients: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().min(2, "O nome do ingrediente é obrigatório."),
        quantity: z.string().min(1, "A quantidade é obrigatória."),
        unit_id: z.coerce
          .string({ required_error: "Selecione uma unidade." })
          .min(1, "Selecione uma unidade."),
      })
    )
    .min(1, "Adicione pelo menos um ingrediente."),
  steps: z
    .array(
      z.object({
        id: z.number().optional(),
        description: z
          .string()
          .min(10, "Cada passo precisa ser mais detalhado."),
      })
    )
    .min(1, "Adicione pelo menos um passo."),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
