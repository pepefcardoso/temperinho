import axios from "axios";
import { cookies } from "next/headers";
import type { PaginatedResponse } from "@/types/api";
import type { Post } from "@/types/blog";

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

  const response = await api.get<PaginatedResponse<Post>>("/posts/my", {
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

  const response = await api.get<PaginatedResponse<Post>>("/posts/favorites", {
    params,
  });
  return response.data;
}
