import axiosClient from '@/lib/axios';
import type { PaginatedResponse } from '@/types/api';
import type { Plan } from '@/types/company';

export interface GetPlansOptions {
  sortBy?: 'name';
  sortDirection?: 'asc' | 'desc';
  filters?: {
    name?: string;
  };
  page?: number;
  limit?: number;
}

export async function getPlans(
  options: GetPlansOptions = {}
): Promise<PaginatedResponse<Plan>> {
  const params = new URLSearchParams();

  if (options.sortBy) params.append('order_by', options.sortBy);
  if (options.sortDirection)
    params.append('order_direction', options.sortDirection);
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('per_page', options.limit.toString());
  if (options.filters) {
    if (options.filters.name) params.append('name', options.filters.name);
  }

  const response = await axiosClient.get<PaginatedResponse<Plan>>(`/plans`, {
    params,
  });
  return response.data;
}

export async function getPlanById(id: number): Promise<Plan> {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error(`ID inválido: ${id}`);
    }

    const response = await axiosClient.get<{ data?: Plan }>(`/plans/${id}`, {
      validateStatus: (status) => status < 500,
    });

    if (response.status === 404) {
      throw new Error('Plano não encontrado');
    }

    if (!response.data?.data) {
      throw new Error('Formato de resposta inválido da API');
    }

    return response.data.data;
  } catch (error) {
    console.error(`Falha ao buscar plano ID ${id}:`, error);
    throw new Error(
      `Não foi possível carregar o plano: ${(error as Error).message}`
    );
  }
}
