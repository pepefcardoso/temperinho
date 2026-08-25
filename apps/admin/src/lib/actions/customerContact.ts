"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  updateCustomerContact,
  getCustomerContacts,
} from "@/lib/api/customerContacts";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { CustomerContact } from "../types/customer";

export async function getCustomerContactsAction(
  params: FetchParams
): Promise<PaginatedResponse<CustomerContact>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const customerContacts = await getCustomerContacts(token, params);
  return customerContacts;
}

export async function updateCustomerContactAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const status = formData.get("status");
  if (typeof status !== "string") {
    return { message: "Status inválido", success: false };
  }

  try {
    await updateCustomerContact(id, { status }, token);
    revalidatePath("/dashboard/customer-contacts");
    return { message: "Contato atualizado com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar contato.";
    return { message, success: false };
  }
}

