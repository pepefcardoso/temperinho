import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Post } from "@/lib/types/post";

export async function getPosts(
  token: string,
  params: FetchParams,
): Promise<PaginatedResponse<Post>> {
  const response = await apiClient.get("/posts", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0]
        ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}`
        : "created_at,desc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function approvePost(id: number, token: string): Promise<Post> {
  const response = await apiClient.patch(`/posts/${id}/approve`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function rejectPost(
  id: number,
  reason: string,
  token: string,
): Promise<Post> {
  const response = await apiClient.patch(
    `/posts/${id}/reject`,
    { reason },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data.data;
}
