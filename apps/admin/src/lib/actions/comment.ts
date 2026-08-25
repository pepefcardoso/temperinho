"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "@/lib/api/comments";
import { commentSchema } from "@/lib/schemas/interactions";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Comment } from "../types/interactions";

export async function getCommentsAction(
  type: "posts" | "recipes",
  commentableId: number,
  params: FetchParams
): Promise<PaginatedResponse<Comment>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const comments = await getComments(type, commentableId, params, token);
  return comments;
}

export async function createCommentAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = commentSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createComment(validatedFields.data, token);
    revalidatePath("/dashboard/comments");
    return { message: "Comentário criado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar comentário.";
    return { message, success: false };
  }
}

export async function updateCommentAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = commentSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateComment(id, validatedFields.data, token);
    revalidatePath("/dashboard/comments");
    return { message: "Comentário atualizado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar comentário.";
    return { message, success: false };
  }
}

export async function deleteCommentAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteComment(id, token);
    revalidatePath("/dashboard/comments");
    return { message: "Comentário excluído com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir comentário.";
    return { message, success: false };
  }
}
