"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createRecipeCategory,
  updateRecipeCategory,
  deleteRecipeCategory,
  getRecipeCategories,
} from "@/lib/api/recipeCategories";
import { recipeCategorySchema } from "@/lib/schemas/recipes";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { RecipeCategory } from "../types/recipe";

export async function getRecipeCategoriesAction(
  params: FetchParams
): Promise<PaginatedResponse<RecipeCategory>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const categories = await getRecipeCategories(token, params);
  return categories;
}

export async function createRecipeCategoryAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = recipeCategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createRecipeCategory(validatedFields.data, token);
    revalidatePath("/dashboard/recipe-categories");
    return { message: "Categoria criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar categoria.";
    return { message, success: false };
  }
}

export async function updateRecipeCategoryAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = recipeCategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateRecipeCategory(id, validatedFields.data, token);
    revalidatePath("/dashboard/recipe-categories");
    return { message: "Categoria atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar categoria.";
    return { message, success: false };
  }
}

export async function deleteRecipeCategoryAction(
  id: number
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteRecipeCategory(id, token);
    revalidatePath("/dashboard/recipe-categories");
    return { message: "Categoria excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir categoria.";
    return { message, success: false };
  }
}
