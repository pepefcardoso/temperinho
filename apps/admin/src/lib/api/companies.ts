import { CompanyFormData } from "../schemas/company";
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Company } from "@/lib/types/company";

export async function getCompanies(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<Company>> {
  const response = await apiClient.get("/companies", {
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

export async function createCompany(
  data: CompanyFormData,
  token: string
): Promise<Company> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await apiClient.post("/companies", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function updateCompany(
  id: number,
  data: CompanyFormData,
  token: string
): Promise<Company> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  formData.append("_method", "PUT");

  const response = await apiClient.post(`/companies/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function deleteCompany(id: number, token: string): Promise<void> {
  await apiClient.delete(`/companies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
