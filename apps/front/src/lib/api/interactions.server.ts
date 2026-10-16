'use server';

import { createAuthenticatedServerApi } from './serverApi';
import { Comment, Rating } from '@/types/actions';
import { InteractableType } from './interactions';
import axios from 'axios';

export async function createComment(
  type: InteractableType,
  id: number,
  content: string
): Promise<Comment> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Comment }>(
    `/${type}/${id}/comments`,
    { content }
  );
  return response.data.data;
}

export async function updateComment(
  commentId: number,
  content: string
): Promise<Comment> {
  const api = await createAuthenticatedServerApi();
  const response = await api.put<{ data: Comment }>(`/comments/${commentId}`, {
    content,
  });
  return response.data.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/comments/${commentId}`);
}

export async function createOrUpdateRating(
  type: InteractableType,
  id: number,
  rating: number
): Promise<Rating> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Rating }>(`/${type}/${id}/ratings`, {
    rating,
  });
  return response.data.data;
}

export async function getUserRating(
  type: InteractableType,
  id: number
): Promise<Rating | null> {
  const api = await createAuthenticatedServerApi();
  try {
    const response = await api.get<{ data: Rating }>(`/${type}/${id}/rating`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404)
      return null;
    throw error;
  }
}

export async function updateRating(
  ratingId: number,
  rating: number
): Promise<Rating> {
  const api = await createAuthenticatedServerApi();
  const response = await api.put<{ data: Rating }>(`/ratings/${ratingId}`, {
    rating,
  });
  return response.data.data;
}

export async function deleteRating(ratingId: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/ratings/${ratingId}`);
}
