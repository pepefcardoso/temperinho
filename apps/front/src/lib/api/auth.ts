import { RegisterData, LoginData, ResetPasswordData } from '@/types/auth';
import axiosClient from '@/lib/axios';

export const registerUser = async (
  data: RegisterData
): Promise<{ token: string }> => {
  const response = await axiosClient.post('/users', data);
  return response.data;
};

export const loginUser = async (
  data: LoginData
): Promise<{ token: string }> => {
  const response = await axiosClient.post('/auth/login', data);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosClient.post('/auth/logout');
};

export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  const response = await axiosClient.post('/auth/password/forgot', {
    email,
  });
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordData
): Promise<{ message: string }> => {
  const response = await axiosClient.post('/auth/password/reset', data);
  return response.data;
};
