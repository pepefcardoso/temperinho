import z from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z
    .string()
    .min(8, { message: 'Por favor, insira um telefone válido.' }),
  message: z
    .string()
    .min(10, { message: 'A mensagem precisa ter pelo menos 10 caracteres.' }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message:
      'Você deve aceitar a Política de Privacidade para enviar a mensagem.',
  }),
});

export const newsletterSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
});
