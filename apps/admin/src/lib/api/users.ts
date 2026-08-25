import { UserFormData } from "../schemas/users";
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { User } from "@/lib/types/user";

export async function getUsers(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get("/users", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0] ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}` : "name,asc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function createUser(
  data: UserFormData,
  token: string
): Promise<User> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      key !== "password_confirmation"
    ) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await apiClient.post("/users", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function updateUser(
  id: number,
  data: UserFormData,
  token: string
): Promise<User> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      key !== "password_confirmation"
    ) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  formData.append("_method", "PUT");

  const response = await apiClient.post(`/users/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function deleteUser(id: number, token: string): Promise<void> {
  await apiClient.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
