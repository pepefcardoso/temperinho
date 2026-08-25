import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().optional().or(z.literal("")),
  birthday: z.string().optional().or(z.literal("")),
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
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem.",
    path: ["password_confirmation"],
  });

export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
