"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createRecipeDiet,
  updateRecipeDiet,
  deleteRecipeDiet,
  getRecipeDiets,
} from "@/lib/api/recipeDiets";
import { recipeDietSchema } from "@/lib/schemas/recipes";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { RecipeDiet } from "../types/recipe";

export async function getRecipeDietsAction(
  params: FetchParams
): Promise<PaginatedResponse<RecipeDiet>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const diets = await getRecipeDiets(token, params);
  return diets;
}

export async function createRecipeDietAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = recipeDietSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createRecipeDiet(validatedFields.data, token);
    revalidatePath("/dashboard/recipe-diets");
    return { message: "Dieta criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar dieta.";
    return { message, success: false };
  }
}

export async function updateRecipeDietAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = recipeDietSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateRecipeDiet(id, validatedFields.data, token);
    revalidatePath("/dashboard/recipe-diets");
    return { message: "Dieta atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar dieta.";
    return { message, success: false };
  }
}

export async function deleteRecipeDietAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteRecipeDiet(id, token);
    revalidatePath("/dashboard/recipe-diets");
    return { message: "Dieta excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir dieta.";
    return { message, success: false };
  }
}
