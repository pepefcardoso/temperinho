import { User } from "./user";

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthState = {
  message?: string;
  success: boolean;
};

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface FetchParams {
    pageIndex: number;
    pageSize: number;
    sorting: { id: string; desc: boolean }[];
    searchTerm: string;
}

export type ActionState = {
  message?: string;
  success: boolean;
};