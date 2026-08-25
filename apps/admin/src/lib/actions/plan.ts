"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createPlan, updatePlan, deletePlan, getPlans } from "@/lib/api/plans";
import { planSchema } from "@/lib/schemas/finance";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Plan } from "../types/plan";

export async function getPlansAction(
  params: FetchParams
): Promise<PaginatedResponse<Plan>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const plans = await getPlans(token, params);
  return plans;
}

export async function createPlanAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = planSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createPlan(validatedFields.data, token);
    revalidatePath("/dashboard/plans");
    return { message: "Plano criado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar plano.";
    return { message, success: false };
  }
}

export async function updatePlanAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = planSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updatePlan(id, validatedFields.data, token);
    revalidatePath("/dashboard/plans");
    return { message: "Plano atualizado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar plano.";
    return { message, success: false };
  }
}

export async function deletePlanAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deletePlan(id, token);
    revalidatePath("/dashboard/plans");
    return { message: "Plano excluído com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir plano.";
    return { message, success: false };
  }
}
