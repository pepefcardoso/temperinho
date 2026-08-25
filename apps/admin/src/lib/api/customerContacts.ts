import { CustomerContactFormData } from "../schemas/customers";
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { CustomerContact } from "@/lib/types/customer";

export async function getCustomerContacts(
  token: string,
  params: FetchParams
): Promise<PaginatedResponse<CustomerContact>> {
  const response = await apiClient.get("/contact", {
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


export async function updateCustomerContact(
  id: number,
  data: Pick<CustomerContactFormData, "status">,
  token: string
): Promise<CustomerContact> {
  const response = await apiClient.patch(`/contact/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}
