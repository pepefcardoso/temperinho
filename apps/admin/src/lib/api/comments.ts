import { CommentFormData } from "../schemas/interactions";
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Comment } from "@/lib/types/interactions";

export async function getComments(
  type: "posts" | "recipes",
  commentableId: number,
  params: FetchParams,
  token?: string
): Promise<PaginatedResponse<Comment>> {
  const response = await apiClient.get(
    `/${type}/${commentableId}/comments`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params: {
        page: params.pageIndex + 1,
        per_page: params.pageSize,
        order_by: params.sorting[0] ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}` : "created_at,asc",
        search: params.searchTerm,
      },
    }
  );
  return response.data;
}

export async function createComment(
  data: CommentFormData,
  token: string
): Promise<Comment> {
  const { commentable_type, commentable_id, content } = data;
  const response = await apiClient.post(
    `/${commentable_type}/${commentable_id}/comments`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.data;
}

export async function updateComment(
  id: number,
  data: Pick<CommentFormData, "content">,
  token: string
): Promise<Comment> {
  const response = await apiClient.put(`/comments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deleteComment(id: number, token: string): Promise<void> {
  await apiClient.delete(`/comments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
