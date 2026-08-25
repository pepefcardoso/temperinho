import axiosClient from "@/lib/axios";

export type Provider = "google" | "github" | "facebook";

export const getSocialRedirectUrl = async (provider: Provider): Promise<{ url: string }> => {
  const response = await axiosClient.get(`/auth/social/${provider}`);
  return response.data;
};