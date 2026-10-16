"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getReports, reviewReport } from "@/lib/api/reports";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Report } from "../types/report";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value;
}

export async function getReportsAction(
  params: FetchParams,
): Promise<PaginatedResponse<Report>> {
  const token = await getToken();
  if (!token) throw new Error("Não autorizado");
  return getReports(token, params);
}

export async function reviewReportAction(id: number): Promise<ActionState> {
  const token = await getToken();
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await reviewReport(id, token);
    revalidatePath("/dashboard/reports");
    return { message: "Denúncia marcada como revisada.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar denúncia.";
    return { message, success: false };
  }
}
