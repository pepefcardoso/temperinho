"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createRecipeUnit,
  updateRecipeUnit,
  deleteRecipeUnit,
  getRecipeUnits,
} from "@/lib/api/recipeUnits";
import { recipeUnitSchema } from "@/lib/schemas/recipes";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { RecipeUnit } from "../types/recipe";

export async function getRecipeUnitsAction(
  params: FetchParams
): Promise<PaginatedResponse<RecipeUnit>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  return getRecipeUnits(token, params);
}

export async function createRecipeUnitAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = recipeUnitSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createRecipeUnit(validatedFields.data, token);
    revalidatePath("/dashboard/recipe-units");
    return { message: "Unidade criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar unidade.";
    return { message, success: false };
  }
}

export async function updateRecipeUnitAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = recipeUnitSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateRecipeUnit(id, validatedFields.data, token);
    revalidatePath("/dashboard/recipe-units");
    return { message: "Unidade atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar unidade.";
    return { message, success: false };
  }
}

export async function deleteRecipeUnitAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteRecipeUnit(id, token);
    revalidatePath("/dashboard/recipe-units");
    return { message: "Unidade excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir unidade.";
    return { message, success: false };
  }
}
