import z from "zod";

export const articleSchema = z.object({
  title: z.string().min(10, 'O título precisa ter pelo menos 10 caracteres.'),
  summary: z
    .string()
    .min(20, 'O resumo precisa de pelo menos 20 caracteres.')
    .max(255, 'Resumo não pode exceder 255 caracteres.'),
  content: z.string().min(50, 'O artigo precisa ter pelo menos 50 caracteres.'),
  category_id: z.coerce.number({
    required_error: 'Por favor, selecione uma categoria.',
  }),
  topics: z
    .array(z.number())
    .min(1, 'Selecione pelo menos um tópico.')
    .max(5, 'Selecione no máximo 5 tópicos.'),
});
