import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { PostCategory } from "@/lib/types/post";

export async function getPostCategories(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<PostCategory>> {
  const response = await apiClient.get("/post-categories", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0] ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}` : "name,asc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function createPostCategory(
  data: { name: string },
  token: string
): Promise<PostCategory> {
  const response = await apiClient.post("/post-categories", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function updatePostCategory(
  id: number,
  data: { name: string },
  token: string
): Promise<PostCategory> {
  const response = await apiClient.put(`/post-categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deletePostCategory(
  id: number,
  token: string
): Promise<void> {
  await apiClient.delete(`/post-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
