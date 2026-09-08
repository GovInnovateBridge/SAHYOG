import api from './api';
import type { User } from '../types/User';

export const getStartupProfile = async (): Promise<User> => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateStartupProfile = async (profileData: Partial<User>): Promise<User> => {
  const { data } = await api.put('/users/profile', profileData);
  return data.user;
};
