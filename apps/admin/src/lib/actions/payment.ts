"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createPayment,
  updatePayment,
  deletePayment,
  getPayments,
} from "@/lib/api/payments";
import { paymentSchema } from "@/lib/schemas/finance";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Payment } from "../types/payment";

export async function getPaymentsAction(
  params: FetchParams
): Promise<PaginatedResponse<Payment>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const payments = await getPayments(token, params);
  return payments;
}

export async function createPaymentAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = paymentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createPayment(validatedFields.data, token);
    revalidatePath("/dashboard/payments");
    return { message: "Pagamento criado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar pagamento.";
    return { message, success: false };
  }
}

export async function updatePaymentAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = paymentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updatePayment(id, validatedFields.data, token);
    revalidatePath("/dashboard/payments");
    return { message: "Pagamento atualizado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar pagamento.";
    return { message, success: false };
  }
}

export async function deletePaymentAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deletePayment(id, token);
    revalidatePath("/dashboard/payments");
    return { message: "Pagamento excluído com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir pagamento.";
    return { message, success: false };
  }
}
