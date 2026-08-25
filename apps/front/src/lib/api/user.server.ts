import axios from 'axios';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';

const createAuthenticatedServerApi = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('AUTH_TOKEN')?.value;

  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
};

export async function getAuthenticatedUserProfile(): Promise<User> {
  try {
    const api = await createAuthenticatedServerApi();
    const response = await api.get('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw error;
  }
}
