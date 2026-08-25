"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createRating,
  updateRating,
  deleteRating,
  getRatings,
} from "@/lib/api/ratings";
import { ratingSchema } from "@/lib/schemas/interactions";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Rating } from "../types/interactions";

export async function getRatingsAction(
  type: "posts" | "recipes",
  rateableId: number,
  params: FetchParams
): Promise<PaginatedResponse<Rating>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const ratings = await getRatings(type, rateableId, params, token);
  return ratings;
}

export async function createRatingAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = ratingSchema.safeParse({
    value: Number(formData.get("value")),
    comment: formData.get("comment"),
    rateable_id: Number(formData.get("rateable_id")),
    rateable_type: formData.get("rateable_type"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createRating(validatedFields.data, token);
    revalidatePath("/dashboard/ratings");
    return { message: "Avaliação criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar avaliação.";
    return { message, success: false };
  }
}

export async function updateRatingAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = ratingSchema.safeParse({
    value: Number(formData.get("value")),
    comment: formData.get("comment"),
    rateable_id: Number(formData.get("rateable_id")),
    rateable_type: formData.get("rateable_type"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateRating(id, validatedFields.data, token);
    revalidatePath("/dashboard/ratings");
    return { message: "Avaliação atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar avaliação.";
    return { message, success: false };
  }
}

export async function deleteRatingAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteRating(id, token);
    revalidatePath("/dashboard/ratings");
    return { message: "Avaliação excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir avaliação.";
    return { message, success: false };
  }
}
