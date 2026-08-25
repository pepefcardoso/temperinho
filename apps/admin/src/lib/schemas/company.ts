import { z } from "zod";

export const companySchema = z.object({
  id: z.coerce.number().positive().optional(),
  name: z.string().min(1, { message: "O nome da empresa é obrigatório." }),
  cnpj: z
    .string()
    .min(14, { message: "O CNPJ deve ter 14 caracteres." })
    .max(18),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z
    .string()
    .url({ message: "Por favor, insira uma URL válida." })
    .optional()
    .or(z.literal("")),
  user: z.coerce.number().positive({ message: "O usuário é obrigatório." }),
  image: z.instanceof(File).optional().nullable(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
