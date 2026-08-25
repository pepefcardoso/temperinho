"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanies,
} from "@/lib/api/companies";
import { companySchema } from "@/lib/schemas/company";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Company } from "../types/company";

export async function getCompaniesAction(
  params: FetchParams
): Promise<PaginatedResponse<Company>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) {
    throw new Error("Não autorizado");
  }

  const companies = await getCompanies(token, params);
  return companies;
}

export async function createCompanyAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size === 0) {
    formData.delete("image");
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = companySchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await createCompany(validatedFields.data, token);
    revalidatePath("/dashboard/companies");
    return { message: "Empresa criada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar empresa.";
    return { message, success: false };
  }
}

export async function updateCompanyAction(
  id: number,
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size === 0) {
    formData.delete("image");
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = companySchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues.map((e) => e.message).join(", "),
      success: false,
    };
  }

  try {
    await updateCompany(id, validatedFields.data, token);
    revalidatePath("/dashboard/companies");
    return { message: "Empresa atualizada com sucesso!", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar empresa.";
    return { message, success: false };
  }
}

export async function deleteCompanyAction(id: number): Promise<ActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await deleteCompany(id, token);
    revalidatePath("/dashboard/companies");
    return { message: "Empresa excluída com sucesso.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao excluir empresa.";
    return { message, success: false };
  }
}
