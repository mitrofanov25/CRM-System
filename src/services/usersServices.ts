import { api } from '../api/http.ts';
import { AxiosResponse } from 'axios';
import { Profile } from '../types/authTypes.ts';
import {
  MetaResponse,
  Roles,
  User,
  UserRequest,
  UsersFilters,
} from '../types/usersTypes.ts';

export const getProfile = (): Promise<AxiosResponse<Profile>> => {
  return api('/user/profile');
};

export const getUsers = async (
  usersFilters: UsersFilters,
): Promise<AxiosResponse<MetaResponse<User>>> => {
  return api.get('/admin/users', {
    params: {
      ...usersFilters,
    },
  });
};

export const getUserProfile = (id: number): Promise<AxiosResponse<User>> => {
  return api.get(`/admin/users/${id}`);
};

export const updateUserProfile = (
  id: number,
  userRequest: UserRequest,
): Promise<AxiosResponse<User>> => {
  return api.put(`/admin/users/${id}`, userRequest);
};

export const blockUser = (id: number): Promise<AxiosResponse<User>> => {
  return api.post(`/admin/users/${id}/block`);
};

export const unblockUser = (id: number): Promise<AxiosResponse<User>> => {
  return api.post(`/admin/users/${id}/unblock`);
};

export const deleteUser = (id: number) => {
  return api.delete(`/admin/users/${id}`);
};

export const updateRightsUser = (id: number, updatingRights: Roles[]) => {
  return api.post(`/admin/users/${id}/rights`, {
    roles: updatingRights,
  });
};
