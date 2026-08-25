import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const userSchema = z
  .object({
    id: z.coerce.number().positive().optional(),
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um email válido." }),
    role: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    birthday: z.string().optional().nullable(),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
      .optional(),
    password_confirmation: z.string().optional(),
    image: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        `O tamanho máximo da imagem é 2MB.`
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Apenas os formatos .jpg, .jpeg, .png e .webp são suportados."
      ),
  })
  .refine(
    (data) => {
      if (data.password && data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "As senhas não coincidem.",
      path: ["password_confirmation"],
    }
  );

export type UserFormData = z.infer<typeof userSchema>;
