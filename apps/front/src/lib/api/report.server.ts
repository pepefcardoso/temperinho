"use server";

import { createAuthenticatedServerApi } from "./serverApi";

export type ReportableType = "comments" | "ratings" | "recipes";
export type ReportReason =
  | "spam"
  | "inappropriate"
  | "misinformation"
  | "other";

interface Report {
  id: number;
  reportable_type: string;
  reportable_id: number;
  reason: ReportReason;
  comment: string | null;
  status: "pending" | "reviewed";
  created_at: string;
}

export async function createReport(
  type: ReportableType,
  id: number,
  reason: ReportReason,
  comment?: string,
): Promise<Report> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Report }>(`/${type}/${id}/reports`, {
    reason,
    comment,
  });
  return response.data.data;
}
