"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
} from "@/lib/api/paymentMethods";
import { paymentMethodSchema } from "@/lib/schemas/finance";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { PaymentMethod } from "../types/paymentMethod";

export async function getPaymentMethodsAction(
  params: FetchParams
): Promise<PaginatedResponse<PaymentMethod>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const paymentMethods = await getPaymentMethods(token, params);
  return paymentMethods;
}

export async function createPaymentMethodAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = paymentMethodSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createPaymentMethod(validatedFields.data, token);
    revalidatePath("/dashboard/payment-methods");
    return {
      message: "Método de pagamento criado com sucesso!",
      success: true,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao criar método de pagamento.";
    return { message, success: false };
  }
}

export async function updatePaymentMethodAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = paymentMethodSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updatePaymentMethod(id, validatedFields.data, token);
    revalidatePath("/dashboard/payment-methods");
    return {
      message: "Método de pagamento atualizado com sucesso!",
      success: true,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao atualizar método de pagamento.";
    return { message, success: false };
  }
}

export async function deletePaymentMethodAction(
  id: number
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deletePaymentMethod(id, token);
    revalidatePath("/dashboard/payment-methods");
    return {
      message: "Método de pagamento excluído com sucesso.",
      success: true,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao excluir método de pagamento.";
    return { message, success: false };
  }
}
