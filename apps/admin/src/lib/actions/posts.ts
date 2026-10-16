"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getPosts, approvePost, rejectPost } from "@/lib/api/posts";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Post } from "../types/post";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value;
}

export async function getPostsAction(
  params: FetchParams,
): Promise<PaginatedResponse<Post>> {
  const token = await getToken();
  if (!token) throw new Error("Não autorizado");
  return getPosts(token, params);
}

export async function approvePostAction(id: number): Promise<ActionState> {
  const token = await getToken();
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await approvePost(id, token);
    revalidatePath("/dashboard/posts");
    return { message: "Artigo aprovado e publicado.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao aprovar artigo.";
    return { message, success: false };
  }
}

export async function rejectPostAction(
  id: number,
  reason: string,
): Promise<ActionState> {
  const token = await getToken();
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await rejectPost(id, reason, token);
    revalidatePath("/dashboard/posts");
    return { message: "Artigo rejeitado.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao rejeitar artigo.";
    return { message, success: false };
  }
}
