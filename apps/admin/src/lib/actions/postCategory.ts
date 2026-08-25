"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createPostCategory,
  updatePostCategory,
  deletePostCategory,
  getPostCategories,
} from "@/lib/api/postCategories";
import { postCategorySchema } from "@/lib/schemas/posts";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { PostCategory } from "../types/post";

export async function getPostCategoriesAction(
  params: FetchParams
): Promise<PaginatedResponse<PostCategory>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const categories = await getPostCategories(token, params);
  return categories;
}

export async function createPostCategoryAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = postCategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createPostCategory(validatedFields.data, token);
    revalidatePath("/dashboard/post-categories");
    return { message: "Categoria criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar categoria.";
    return { message, success: false };
  }
}

export async function updatePostCategoryAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = postCategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updatePostCategory(id, validatedFields.data, token);
    revalidatePath("/dashboard/post-categories");
    return { message: "Categoria atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar categoria.";
    return { message, success: false };
  }
}

export async function deletePostCategoryAction(
  id: number
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deletePostCategory(id, token);
    revalidatePath("/dashboard/post-categories");
    return { message: "Categoria excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir categoria.";
    return { message, success: false };
  }
}
