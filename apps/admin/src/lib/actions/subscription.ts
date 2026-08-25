"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptions,
} from "@/lib/api/subscriptions";
import { subscriptionSchema } from "@/lib/schemas/finance";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Subscription } from "../types/subscription";

export async function getSubscriptionsAction(
  params: FetchParams
): Promise<PaginatedResponse<Subscription>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const subscriptions = await getSubscriptions(token, params);
  return subscriptions;
}

export async function createSubscriptionAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = subscriptionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createSubscription(validatedFields.data, token);
    revalidatePath("/dashboard/subscriptions");
    return { message: "Assinatura criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar assinatura.";
    return { message, success: false };
  }
}

export async function updateSubscriptionAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = subscriptionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateSubscription(id, validatedFields.data, token);
    revalidatePath("/dashboard/subscriptions");
    return { message: "Assinatura atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar assinatura.";
    return { message, success: false };
  }
}

export async function deleteSubscriptionAction(
  id: number
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteSubscription(id, token);
    revalidatePath("/dashboard/subscriptions");
    return { message: "Assinatura excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir assinatura.";
    return { message, success: false };
  }
}
