import axios from "axios";
import { cookies } from "next/headers";
import type { PaginatedResponse } from "@/types/api";
import type { Recipe } from "@/types/recipe";

const createAuthenticatedServerApi = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("AUTH_TOKEN")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export async function getMyRecipes(
  options: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginatedResponse<Recipe>> {
  const api = await createAuthenticatedServerApi();
  const params = new URLSearchParams();
  if (options.page) params.append("page", String(options.page));
  if (options.limit) params.append("per_page", String(options.limit));
  if (options.search) params.append("search", options.search);
  if (options.categoryId) params.append("category_id", options.categoryId);

  const response = await api.get<PaginatedResponse<Recipe>>("/recipes/my", {
    params,
  });
  return response.data;
}

export async function getFavoriteRecipes(
  options: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  } = {}
): Promise<PaginatedResponse<Recipe>> {
  const api = await createAuthenticatedServerApi();
  const params = new URLSearchParams();
  if (options.page) params.append("page", String(options.page));
  if (options.limit) params.append("per_page", String(options.limit));
  if (options.search) params.append("search", options.search);
  if (options.categoryId) params.append("category_id", options.categoryId);

  const response = await api.get<PaginatedResponse<Recipe>>(
    "/recipes/favorites",
    { params }
  );
  return response.data;
}
