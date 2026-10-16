'use server';

import { createAuthenticatedServerApi } from './serverApi';
import type { PaginatedResponse } from '@/types/api';
import type { Post } from '@/types/blog';

interface GetMyPostsParams {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export async function getMyPosts({
  search,
  categoryId,
  page = 1,
  limit = 10,
}: GetMyPostsParams = {}): Promise<PaginatedResponse<Post>> {
  const api = await createAuthenticatedServerApi();
  const params: Record<string, string> = {
    page: page.toString(),
    per_page: limit.toString(),
  };

  if (search) {
    params.search = search;
  }
  if (categoryId) {
    params.category_id = categoryId;
  }

  const response = await api.get<PaginatedResponse<Post>>('/posts/my', {
    params,
  });
  return response.data;
}

interface GetFavoritePostsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export async function getFavoritePosts({
  page = 1,
  limit = 10,
  search,
  categoryId,
}: GetFavoritePostsParams = {}): Promise<PaginatedResponse<Post>> {
  const api = await createAuthenticatedServerApi();
  const params: Record<string, string> = {
    page: page.toString(),
    per_page: limit.toString(),
  };
  if (search) {
    params.search = search;
  }
  if (categoryId) {
    params.category_id = categoryId;
  }

  const response = await api.get<PaginatedResponse<Post>>('/posts/favorites', {
    params,
  });
  return response.data;
}

export async function createPost(data: FormData): Promise<Post> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Post }>('/posts', data);
  return response.data.data;
}

export async function updatePost(id: number, data: FormData): Promise<Post> {
  data.append('_method', 'PUT');
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Post }>(`/posts/${id}`, data);
  return response.data.data;
}

export async function deletePost(id: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/posts/${id}`);
}
