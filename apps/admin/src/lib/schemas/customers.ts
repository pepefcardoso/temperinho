import { z } from "zod";

export const customerContactSchema = z.object({
  id: z.coerce.number().positive().optional(),
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().optional().nullable(),
  message: z
    .string()
    .min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
  status: z.string().optional(),
  consent_date: z.string().optional().nullable(),
  consent_source: z.string().optional().nullable(),
});

export type CustomerContactFormData = z.infer<typeof customerContactSchema>;

export const newsletterCustomerSchema = z.object({
  id: z.coerce.number().positive().optional(),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  consent_date: z.string().optional().nullable(),
  consent_source: z.string().optional().nullable(),
});

export type NewsletterCustomerFormData = z.infer<
  typeof newsletterCustomerSchema
>;
