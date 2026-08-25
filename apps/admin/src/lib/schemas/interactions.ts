import { z } from "zod";

export const commentSchema = z.object({
  id: z.coerce.number().positive().optional(),
  content: z
    .string()
    .min(3, { message: "O comentário deve ter pelo menos 3 caracteres." }),
  commentable_id: z.coerce
    .number()
    .positive({ message: "O ID do conteúdo é obrigatório." }),
  commentable_type: z
    .string()
    .min(1, { message: "O tipo de conteúdo é obrigatório." }),
});

export type CommentFormData = z.infer<typeof commentSchema>;

export const ratingSchema = z.object({
  id: z.coerce.number().positive().optional(),
  value: z
    .number()
    .min(1, { message: "A nota deve ser pelo menos 1." })
    .max(5, { message: "A nota deve ser no máximo 5." }),
  comment: z.string().optional(),
  rateable_id: z.coerce
    .number()
    .positive({ message: "O ID do conteúdo é obrigatório." }),
  rateable_type: z
    .string()
    .min(1, { message: "O tipo de conteúdo é obrigatório." }),
});

export type RatingFormData = z.infer<typeof ratingSchema>;
