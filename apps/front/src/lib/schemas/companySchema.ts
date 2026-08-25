import { z } from 'zod';

export const companySchema = z.object({
  name: z
    .string()
    .min(3, 'O nome da empresa precisa ter pelo menos 3 caracteres.'),
  cnpj: z
    .string()
    .regex(/^[0-9]{14}$/, 'O CNPJ deve conter 14 dígitos numéricos.')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Por favor, insira um email válido.'),
  phone: z.string().min(1, 'O telefone é obrigatório.'),
  address: z.string().min(1, 'O endereço é obrigatório.'),
  website: z.string().url('Por favor, insira uma URL válida.'),
});