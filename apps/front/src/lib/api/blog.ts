import axiosClient from '@/lib/axios';
import type {
  GetStandardPaginatedOptions,
  PaginatedResponse,
} from '@/types/api';
import type { Post, PostCategory, PostTopic } from '@/types/blog';

export interface GetPostsOptions {
  sortBy?: 'title' | 'created_at';
  sortDirection?: 'asc' | 'desc';
  filters?: {
    search?: string;
    category_id?: number;
    user_id?: number;
  };
  page?: number;
  limit?: number;
}

export async function getPosts(
  options: GetPostsOptions = {}
): Promise<PaginatedResponse<Post>> {
  const params = new URLSearchParams();

  if (options.sortBy) params.append('order_by', options.sortBy);
  if (options.sortDirection)
    params.append('order_direction', options.sortDirection);
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('per_page', options.limit.toString());

  if (options.filters) {
    if (options.filters.search) params.append('search', options.filters.search);
    if (options.filters.category_id)
      params.append('category_id', options.filters.category_id.toString());
    if (options.filters.user_id)
      params.append('user_id', options.filters.user_id.toString());
  }

  const response = await axiosClient.get<PaginatedResponse<Post>>(`/posts`, {
    params,
  });
  return response.data;
}

export async function getMyPosts(
  options: GetPostsOptions = {}
): Promise<PaginatedResponse<Post>> {
  const params = new URLSearchParams();

  if (options.sortBy) params.append('order_by', options.sortBy);
  if (options.sortDirection)
    params.append('order_direction', options.sortDirection);
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('per_page', options.limit.toString());

  if (options.filters) {
    if (options.filters.search) params.append('search', options.filters.search);
    if (options.filters.category_id)
      params.append('category_id', options.filters.category_id.toString());
  }

  const response = await axiosClient.get<PaginatedResponse<Post>>(`/posts/my`, {
    params,
  });
  return response.data;
}

export async function getFavoritePosts(
  options: GetPostsOptions = {}
): Promise<PaginatedResponse<Post>> {
  const params = new URLSearchParams();

  if (options.sortBy) params.append('order_by', options.sortBy);
  if (options.sortDirection)
    params.append('order_direction', options.sortDirection);
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('per_page', options.limit.toString());

  if (options.filters) {
    if (options.filters.search) params.append('search', options.filters.search);
    if (options.filters.category_id)
      params.append('category_id', options.filters.category_id.toString());
  }

  const response = await axiosClient.get<PaginatedResponse<Post>>(
    `/posts/favorites`,
    {
      params,
    }
  );
  return response.data;
}

export async function getPostById(id: number): Promise<Post> {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error(`ID inválido: ${id}`);
    }

    const response = await axiosClient.get<{ data?: Post }>(`/posts/${id}`, {
      validateStatus: (status) => status < 500,
    });

    if (response.status === 404) {
      throw new Error('Post não encontrado');
    }

    if (!response.data?.data) {
      throw new Error('Formato de resposta inválido da API');
    }

    return response.data.data;
  } catch (error) {
    console.error(`Falha ao buscar post ID ${id}:`, error);
    throw new Error(
      `Não foi possível carregar o post: ${(error as Error).message}`
    );
  }
}

export async function createPost(data: FormData): Promise<Post> {
  const response = await axiosClient.post<{ data: Post }>('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function updatePost(id: number, data: FormData): Promise<Post> {
  data.append('_method', 'PUT');

  const response = await axiosClient.post<{ data: Post }>(
    `/posts/${id}`,
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data.data;
}

export async function deletePost(id: number): Promise<void> {
  await axiosClient.delete(`/posts/${id}`);
}

export async function getPostCategories(
  options: GetStandardPaginatedOptions = {}
): Promise<PostCategory[]> {
  const params = new URLSearchParams();
  if (options.limit) {
    params.append('per_page', options.limit.toString());
  }

  const response = await axiosClient.get<{ data: PostCategory[] }>(
    '/post-categories',
    { params }
  );

  return response.data.data;
}

export async function getPostTopics(
  options: GetStandardPaginatedOptions = {}
): Promise<PostTopic[]> {
  const params = new URLSearchParams();
  if (options.limit) {
    params.append('per_page', options.limit.toString());
  }

  const response = await axiosClient.get<{ data: PostTopic[] }>(
    '/post-topics',
    { params }
  );

  return response.data.data;
}
