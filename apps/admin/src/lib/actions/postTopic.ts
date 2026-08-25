"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createPostTopic,
  updatePostTopic,
  deletePostTopic,
  getPostTopics,
} from "@/lib/api/postTopics";
import { postTopicSchema } from "@/lib/schemas/posts";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { PostTopic } from "../types/post";

export async function getPostTopicsAction(
  params: FetchParams
): Promise<PaginatedResponse<PostTopic>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const topics = await getPostTopics(token, params);
  return topics;
}

export async function createPostTopicAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = postTopicSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createPostTopic(validatedFields.data, token);
    revalidatePath("/dashboard/post-topics");
    return { message: "Tópico criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar tópico.";
    return { message, success: false };
  }
}

export async function updatePostTopicAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = postTopicSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updatePostTopic(id, validatedFields.data, token);
    revalidatePath("/dashboard/post-topics");
    return { message: "Tópico atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar tópico.";
    return { message, success: false };
  }
}

export async function deletePostTopicAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deletePostTopic(id, token);
    revalidatePath("/dashboard/post-topics");
    return { message: "Tópico excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir tópico.";
    return { message, success: false };
  }
}
