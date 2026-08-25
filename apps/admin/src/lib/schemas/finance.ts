import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.coerce.number().min(0, { message: "O valor deve ser positivo." }),
  status: z.string().min(1, { message: "O status é obrigatório." }),
  notes: z.string().optional().nullable(),
  due_date: z
    .string()
    .min(1, { message: "A data de vencimento é obrigatória." }),
  paid_at: z.string().optional().nullable(),
  subscription_id: z.coerce
    .number()
    .positive({ message: "A inscrição é obrigatória." }),
  payment_method_id: z.coerce
    .number()
    .positive({ message: "O método de pagamento é obrigatório." }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const paymentMethodSchema = z.object({
  id: z.coerce.number().positive().optional(),
  name: z.string().min(1, { message: "O nome do método é obrigatório." }),
  slug: z
    .string()
    .min(1, { message: "O slug do método é obrigatório." })
    .regex(/^[a-z0-9-_]+$/i, {
      message: "O slug só pode conter letras, números, hífen e underline.",
    }),
  description: z.string().optional().nullable(),
  is_active: z.coerce.boolean().optional().default(true),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

export const subscriptionSchema = z.object({
  id: z.coerce.number().positive().optional(),
  company_id: z.coerce
    .number()
    .positive({ message: "O id da empresa é obrigatório." }),
  plan_id: z.coerce
    .number()
    .positive({ message: "O id do plano é obrigatório." }),
  starts_at: z.string().min(1, { message: "A data de início é obrigatória." }),
  ends_at: z.string().optional().nullable(),
  status: z
    .string()
    .min(1, { message: "O status da assinatura é obrigatório." }),
  created_at: z.string().optional(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export const planSchema = z.object({
  id: z.coerce.number().positive().optional(),
  name: z.string().min(1, { message: "O nome do plano é obrigatório." }),
  badge: z.string().optional().nullable(),
  price: z.string().min(1, { message: "O preço do plano é obrigatório." }),
  period: z.enum(["Mensal", "Anual"], {
    errorMap: () => ({ message: "O período deve ser 'Mensal' ou 'Anual'." }),
  }),
  description: z.string().optional().nullable(),
  features: z.array(z.string().min(1)).optional().default([]),
  status: z.string().min(1, { message: "O status do plano é obrigatório." }),
  display_order: z.coerce.number().int().nonnegative().optional().default(0),
  limits: z.object({
    users: z.coerce.number().int().nonnegative(),
    posts: z.coerce.number().int().nonnegative(),
    recipes: z.coerce.number().int().nonnegative(),
    banners: z.coerce.number().int().nonnegative(),
    email_campaigns: z.coerce.number().int().nonnegative(),
  }),
  newsletter: z.coerce.boolean().optional().default(false),
  trial_days: z.coerce.number().int().nonnegative().optional().default(0),
  created_at: z.string().optional(),
});

export type PlanFormData = z.infer<typeof planSchema>;
