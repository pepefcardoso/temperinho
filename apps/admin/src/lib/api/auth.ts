import { apiClient } from "./client";
import { AuthResponse } from "@/lib/types/api";
import { loginSchema } from "@/lib/schemas/auth";
import { User } from "../types/user";

export async function loginWithCredentials(
  formData: FormData
): Promise<AuthResponse> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.issues.map((e) => e.message).join(", ")
    );
  }

  const { email, password } = validatedFields.data;

  const response = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function logoutFromApi(token: string): Promise<void> {
  await apiClient.post(
    "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function fetchUserProfile(token: string): Promise<{ user: User }> {
  const response = await apiClient.get<{ data: User }>("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { user: response.data.data };
}
