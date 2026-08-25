import { PaymentMethodFormData } from "../schemas/finance";
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { PaymentMethod } from "@/lib/types/paymentMethod";

export async function getPaymentMethods(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<PaymentMethod>> {
  const response = await apiClient.get("/payment-methods", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0] ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}` : "due_date,asc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function createPaymentMethod(
  data: PaymentMethodFormData,
  token: string
): Promise<PaymentMethod> {
  const response = await apiClient.post("/payment-methods", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function updatePaymentMethod(
  id: number,
  data: PaymentMethodFormData,
  token: string
): Promise<PaymentMethod> {
  const response = await apiClient.put(`/payment-methods/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deletePaymentMethod(
  id: number,
  token: string
): Promise<void> {
  await apiClient.delete(`/payment-methods/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
