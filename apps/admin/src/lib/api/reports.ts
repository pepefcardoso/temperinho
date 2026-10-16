import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Report } from "@/lib/types/report";

export async function getReports(
  token: string,
  params: FetchParams,
): Promise<PaginatedResponse<Report>> {
  const response = await apiClient.get("/reports", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0]
        ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}`
        : "created_at,desc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function reviewReport(id: number, token: string): Promise<Report> {
  const response = await apiClient.patch(`/reports/${id}/review`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}
