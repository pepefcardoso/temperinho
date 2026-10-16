import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export async function createAuthenticatedServerApi(): Promise<AxiosInstance> {
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
}
