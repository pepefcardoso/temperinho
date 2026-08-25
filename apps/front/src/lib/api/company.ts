import axiosClient from '@/lib/axios';
import type { Company } from '@/types/company';

export async function createCompany(data: FormData): Promise<Company> {
  const response = await axiosClient.post<{ data: Company }>(
    '/companies',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
}

export async function updateCompany(
  id: number,
  data: FormData
): Promise<Company> {
  data.append('_method', 'PUT');
  const response = await axiosClient.post<{ data: Company }>(
    `/companies/${id}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
}

export async function deleteCompany(id: number): Promise<void> {
  await axiosClient.delete(`/companies/${id}`);
}

export async function getCompany(id: number): Promise<Company> {
  const response = await axiosClient.get<{ data: Company }>(`/companies/${id}`);
  return response.data.data;
}
