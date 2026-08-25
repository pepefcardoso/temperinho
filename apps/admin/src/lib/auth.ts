import { cookies } from "next/headers";
import { cache } from "react";
import { fetchUserProfile } from "@/lib/api/auth";
import { User } from "./types/user";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value ?? null;
}

export const getSession = cache(
  async (
    token: string | null
  ): Promise<{ user: User; token: string } | null> => {
    if (!token) return null;
    try {
      const { user } = await fetchUserProfile(token);
      return { user, token };
    } catch {
      return null;
    }
  }
);
