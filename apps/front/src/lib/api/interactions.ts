import axiosClient from '@/lib/axios';
import { Comment, Rating } from '@/types/actions';
import type { PaginatedResponse } from '@/types/api';

export type InteractableType = 'posts' | 'recipes';

export async function getComments(
  type: InteractableType,
  id: number,
  page = 1
): Promise<PaginatedResponse<Comment>> {
  const response = await axiosClient.get<PaginatedResponse<Comment>>(
    `/${type}/${id}/comments`,
    { params: { page } }
  );
  return response.data;
}

export async function getCommentById(commentId: number): Promise<Comment> {
  const response = await axiosClient.get<{ data: Comment }>(
    `/comments/${commentId}`
  );
  return response.data.data;
}

export async function getRatings(
  type: InteractableType,
  id: number,
  page = 1
): Promise<PaginatedResponse<Rating>> {
  const response = await axiosClient.get<PaginatedResponse<Rating>>(
    `/${type}/${id}/ratings`,
    { params: { page } }
  );
  return response.data;
}

export async function getRatingById(ratingId: number): Promise<Rating> {
  const response = await axiosClient.get<{ data: Rating }>(
    `/ratings/${ratingId}`
  );
  return response.data.data;
}
