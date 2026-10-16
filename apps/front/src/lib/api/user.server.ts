'use server';

import { createAuthenticatedServerApi } from './serverApi';
import type { User } from '@/types/user';

interface ToggleFavoriteResponse {
  attached: number[];
  detached: number[];
}

export async function getAuthenticatedUserProfile(): Promise<User> {
  const api = await createAuthenticatedServerApi();
  const response = await api.get('/users/me');
  return response.data.data;
}

export async function toggleFavoriteRecipe(
  recipeId: number
): Promise<ToggleFavoriteResponse> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<ToggleFavoriteResponse>(
    '/users/favorites/recipes',
    { recipe_id: recipeId }
  );
  return response.data;
}

export async function toggleFavoritePost(
  postId: number
): Promise<ToggleFavoriteResponse> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<ToggleFavoriteResponse>(
    '/users/favorites/posts',
    { post_id: postId }
  );
  return response.data;
}

export async function updateUserProfile(
  userId: number,
  data: FormData
): Promise<User> {
  data.append('_method', 'PUT');
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: User }>(`/users/${userId}`, data);
  return response.data.data;
}

export async function deleteAccount(userId: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/users/${userId}`);
}
