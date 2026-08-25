import axiosClient from '@/lib/axios';
import { Comment, Rating } from '@/types/actions';
import { InteractableType } from './interactions';
import axios from 'axios';

export async function createComment(
  type: InteractableType,
  id: number,
  content: string
): Promise<Comment> {
  const response = await axiosClient.post<{ data: Comment }>(
    `/${type}/${id}/comments`,
    { content }
  );
  return response.data.data;
}

export async function updateComment(
  commentId: number,
  content: string
): Promise<Comment> {
  const response = await axiosClient.put<{ data: Comment }>(
    `/comments/${commentId}`,
    { content }
  );
  return response.data.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await axiosClient.delete(`/comments/${commentId}`);
}

export async function createOrUpdateRating(
  type: InteractableType,
  id: number,
  rating: number
): Promise<Rating> {
  const response = await axiosClient.post<{ data: Rating }>(
    `/${type}/${id}/ratings`,
    { rating }
  );
  return response.data.data;
}

export async function getUserRating(
  type: InteractableType,
  id: number
): Promise<Rating | null> {
  try {
    const response = await axiosClient.get<{ data: Rating }>(
      `/${type}/${id}/rating`
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateRating(
  ratingId: number,
  rating: number
): Promise<Rating> {
  const response = await axiosClient.put<{ data: Rating }>(
    `/ratings/${ratingId}`,
    { rating }
  );
  return response.data.data;
}

export async function deleteRating(ratingId: number): Promise<void> {
  await axiosClient.delete(`/ratings/${ratingId}`);
}
