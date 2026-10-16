'use server';

import { createAuthenticatedServerApi } from './serverApi';
import type { PaginatedResponse } from '@/types/api';
import type { Recipe } from '@/types/recipe';

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
  if (options.page) params.append('page', String(options.page));
  if (options.limit) params.append('per_page', String(options.limit));
  if (options.search) params.append('search', options.search);
  if (options.categoryId) params.append('category_id', options.categoryId);

  const response = await api.get<PaginatedResponse<Recipe>>('/recipes/my', {
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
  if (options.page) params.append('page', String(options.page));
  if (options.limit) params.append('per_page', String(options.limit));
  if (options.search) params.append('search', options.search);
  if (options.categoryId) params.append('category_id', options.categoryId);

  const response = await api.get<PaginatedResponse<Recipe>>(
    '/recipes/favorites',
    { params }
  );
  return response.data;
}

export async function createRecipe(data: FormData): Promise<Recipe> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Recipe }>('/recipes', data);
  return response.data.data;
}

export async function updateRecipe(
  id: number,
  data: FormData
): Promise<Recipe> {
  data.append('_method', 'PUT');
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Recipe }>(`/recipes/${id}`, data);
  return response.data.data;
}

export async function deleteRecipe(id: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/recipes/${id}`);
}
