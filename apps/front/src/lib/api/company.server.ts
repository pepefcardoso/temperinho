import axios from 'axios';
import { cookies } from 'next/headers';
import type { Company } from '@/types/company';

const createAuthenticatedServerApi = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('AUTH_TOKEN')?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

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
