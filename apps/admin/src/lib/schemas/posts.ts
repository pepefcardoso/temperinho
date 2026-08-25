import { z } from "zod";

export const postCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
});

export type PostCategoryFormData = z.infer<typeof postCategorySchema>;

export const postTopicSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
});

export type PostTopicFormData = z.infer<typeof postTopicSchema>;
