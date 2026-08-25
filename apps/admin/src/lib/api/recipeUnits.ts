import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { RecipeUnit } from "@/lib/types/recipe";

export async function getRecipeUnits(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<RecipeUnit>> {
  const response = await apiClient.get("/recipe-units", {
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

export async function createRecipeUnit(
  data: { name: string },
  token: string
): Promise<RecipeUnit> {
  const response = await apiClient.post("/recipe-units", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function updateRecipeUnit(
  id: number,
  data: { name: string },
  token: string
): Promise<RecipeUnit> {
  const response = await apiClient.put(`/recipe-units/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deleteRecipeUnit(
  id: number,
  token: string
): Promise<void> {
  await apiClient.delete(`/recipe-units/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
