import z from "zod";

export const profileSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres.' }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length >= 8) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'As senhas não coincidem.',
      path: ['confirmPassword'],
    }
  );
