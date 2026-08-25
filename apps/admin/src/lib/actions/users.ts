"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createUser, updateUser, deleteUser, getUsers } from "@/lib/api/users";
import { userSchema } from "@/lib/schemas/users";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { User } from "../types/user";

export async function getUsersAction(
  params: FetchParams
): Promise<PaginatedResponse<User>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const users = await getUsers(token, params);
  return users;
}

export async function createUserAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size === 0) {
    formData.delete("image");
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = userSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createUser(validatedFields.data, token);
    revalidatePath("/dashboard/users");
    return { message: "Usuário criado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar usuário.";
    return { message, success: false };
  }
}

export async function updateUserAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size === 0) {
    formData.delete("image");
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = userSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateUser(id, validatedFields.data, token);
    revalidatePath("/dashboard/users");
    return { message: "Usuário atualizado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar usuário.";
    return { message, success: false };
  }
}

export async function deleteUserAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteUser(id, token);
    revalidatePath("/dashboard/users");
    return { message: "Usuário excluído com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir usuário.";
    return { message, success: false };
  }
}
