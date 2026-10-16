'use server';

import axios from 'axios';
import { createAuthenticatedServerApi } from './serverApi';
import type { Company } from '@/types/company';

export async function getMyCompany(): Promise<Company | null> {
  try {
    const api = await createAuthenticatedServerApi();
    const response = await api.get<{ data: Company }>('/companies/my');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getCompany(id: number): Promise<Company> {
  const api = await createAuthenticatedServerApi();
  const response = await api.get<{ data: Company }>(`/companies/${id}`);
  return response.data.data;
}

export async function createCompany(data: FormData): Promise<Company> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Company }>('/companies', data);
  return response.data.data;
}

export async function updateCompany(
  id: number,
  data: FormData
): Promise<Company> {
  data.append('_method', 'PUT');
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Company }>(`/companies/${id}`, data);
  return response.data.data;
}

export async function deleteCompany(id: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/companies/${id}`);
}
