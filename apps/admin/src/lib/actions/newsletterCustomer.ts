"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createNewsletterCustomer,
  updateNewsletterCustomer,
  deleteNewsletterCustomer,
  getNewsletterCustomers,
} from "@/lib/api/newsletterCustomers";
import { newsletterCustomerSchema } from "@/lib/schemas/customers";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { NewsletterCustomer } from "../types/customer";

export async function getNewsletterCustomersAction(
  params: FetchParams
): Promise<PaginatedResponse<NewsletterCustomer>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const customers = await getNewsletterCustomers(token, params);
  return customers;
}

export async function createNewsletterCustomerAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = newsletterCustomerSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createNewsletterCustomer(validatedFields.data, token);
    revalidatePath("/dashboard/newsletter");
    return {
      message: "Cliente da newsletter adicionado com sucesso!",
      success: true,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao adicionar cliente da newsletter.";
    return { message, success: false };
  }
}

export async function updateNewsletterCustomerAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const validatedFields = newsletterCustomerSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateNewsletterCustomer(id, validatedFields.data, token);
    revalidatePath("/dashboard/newsletter");
    return {
      message: "Cliente da newsletter atualizado com sucesso!",
      success: true,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao atualizar cliente da newsletter.";
    return { message, success: false };
  }
}

export async function deleteNewsletterCustomerAction(
  id: number
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteNewsletterCustomer(id, token);
    revalidatePath("/dashboard/newsletter");
    return {
      message: "Cliente da newsletter excluído com sucesso.",
      success: true,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao excluir cliente da newsletter.";
    return { message, success: false };
  }
}
