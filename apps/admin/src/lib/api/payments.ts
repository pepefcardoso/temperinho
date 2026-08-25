import { PaymentFormData } from "../schemas/finance";
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Payment } from "@/lib/types/payment";

export async function getPayments(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<Payment>> {
  const response = await apiClient.get("/payments", {
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

export async function createPayment(
  data: PaymentFormData,
  token: string
): Promise<Payment> {
  const response = await apiClient.post("/payments", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function updatePayment(
  id: number,
  data: PaymentFormData,
  token: string
): Promise<Payment> {
  const response = await apiClient.put(`/payments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deletePayment(id: number, token: string): Promise<void> {
  await apiClient.delete(`/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
