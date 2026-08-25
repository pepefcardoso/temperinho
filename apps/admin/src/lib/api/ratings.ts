import { RatingFormData } from "../schemas/interactions";
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Rating } from "@/lib/types/interactions";

export async function getRatings(
  type: "posts" | "recipes",
  rateableId: number,
  params: FetchParams,
  token?: string
): Promise<PaginatedResponse<Rating>> {
  const response = await apiClient.get(`/${type}/${rateableId}/ratings`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0] ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}` : "created_at,asc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function createRating(
  data: RatingFormData,
  token: string
): Promise<Rating> {
  const { rateable_type, rateable_id, value, comment } = data;
  const response = await apiClient.post(
    `/${rateable_type}/${rateable_id}/ratings`,
    { value, comment },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.data;
}

export async function updateRating(
  id: number,
  data: Pick<RatingFormData, "value" | "comment">,
  token: string
): Promise<Rating> {
  const response = await apiClient.put(`/ratings/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deleteRating(id: number, token: string): Promise<void> {
  await apiClient.delete(`/ratings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
