"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { updateUserProfile, updateUserPassword } from "@/lib/api/user";
import { updateProfileSchema, updatePasswordSchema } from "@/lib/schemas/profile";
import { User } from "../types/user";
import { AxiosError } from "axios";
import { ActionState } from "../types/api";

export type ProfileActionState = ActionState & {
  user?: User;
};

export async function updateProfileAction(
  userId: number,
  _prevState: ProfileActionState | undefined,
  formData: FormData
): Promise<ProfileActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return { message: "Não autorizado", success: false };
  }

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size === 0) {
    formData.delete("image");
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = updateProfileSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    const { user: updatedUser } = await updateUserProfile(userId, formData, token);

    revalidatePath("/dashboard/profile");
    return {
      message: "Perfil atualizado com sucesso!",
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    let errorMessage = "Ocorreu um erro ao atualizar o perfil.";
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    return { message: errorMessage, success: false };
  }
}

export async function updatePasswordAction(
  userId: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return { message: "Não autorizado", success: false };
  }

  try {
    const validatedFields = updatePasswordSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        message: validatedFields.error.issues.map((e) => e.message).join(", "),
        success: false,
      };
    }

    await updateUserPassword(userId, validatedFields.data, token);

    return { message: "Senha atualizada com sucesso!", success: true };
  } catch (error) {
    let errorMessage = "Ocorreu um erro ao atualizar a senha.";
    if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
    }
    return { message: errorMessage, success: false };
  }
}