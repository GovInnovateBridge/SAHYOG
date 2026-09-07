import api from './api';
import type { User, UserRole } from '../types/User';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
  dpiitNumber?: string;
}

export interface RegisterResponse {
  message: string;
}

export const registerAPI = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>('/auth/register', payload);
  return data;
};

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  token: string;
}

export const verifyOTPAPI = async (payload: VerifyOTPPayload): Promise<VerifyOTPResponse> => {
  const { data } = await api.post<VerifyOTPResponse>('/auth/verify-email', payload);
  return data;
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginAPI = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
};

// Raw shape the backend actually sends from GET /auth/me
interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile: User['profile'];
}

/**
 * GET /api/auth/me
 * Backend returns { id, name, email, role, profile } — note "id", not "_id",
 * and organization/dpiitNumber live inside "profile", not flat on the user.
 * This function maps that onto our internal User shape so the rest of the
 * app can keep using `_id` everywhere else.
 */
export const getMeAPI = async (): Promise<User> => {
  const { data } = await api.get<MeResponse>('/auth/me');
  return {
    _id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    profile: data.profile ?? null,
  };
};