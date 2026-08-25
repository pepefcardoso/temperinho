import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { RecipeCategory } from "@/lib/types/recipe";

export async function getRecipeCategories(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<RecipeCategory>> {
  const response = await apiClient.get("/recipe-categories", {
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

export async function createRecipeCategory(
  data: { name: string },
  token: string
): Promise<RecipeCategory> {
  const response = await apiClient.post("/recipe-categories", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function updateRecipeCategory(
  id: number,
  data: { name: string },
  token: string
): Promise<RecipeCategory> {
  const response = await apiClient.put(`/recipe-categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deleteRecipeCategory(
  id: number,
  token: string
): Promise<void> {
  await apiClient.delete(`/recipe-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
