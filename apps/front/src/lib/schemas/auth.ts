import z from 'zod';

function isOver18(birthday: string): boolean {
  if (!birthday) return false;
  const today = new Date();
  const birthdayObj = new Date(birthday);

  let age = today.getFullYear() - birthdayObj.getFullYear();
  const monthDifference = today.getMonth() - birthdayObj.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthdayObj.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

export const createAccountSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
    email: z.string().email({ message: 'Por favor, insira um email válido.' }),
    birthday: z
      .string()
      .refine((date) => new Date(date).toString() !== 'Invalid Date', {
        message: 'Por favor, insira uma data válida.',
      })
      .refine(isOver18, {
        message: 'Você deve ter pelo menos 18 anos para se cadastrar.',
      }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
      .regex(/[a-z]/, {
        message: 'A senha deve conter pelo menos uma letra minúscula.',
      })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula.',
      })
      .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'A senha deve conter pelo menos um caractere especial.',
      }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos de uso.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });
