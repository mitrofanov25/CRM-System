export type Roles = 'ADMIN' | 'MODERATOR' | 'USER';

export interface User {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Roles[];
  phoneNumber: string;
}

export interface UsersFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | undefined;
  isBlocked?: boolean;
  limit?: number;
  page?: number;
}

export interface MetaResponse<T> {
  data: T[];
  meta: {
    totalAmount: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

export interface UserRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}
