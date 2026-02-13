import { apiClient, setTokens } from "./client";
import type { ApiResponse, UserResponse } from "@/types/api";

export interface ValidateInviteKeyRequest {
  inviteKey: string;
}

export interface RegisterSendEmailRequest {
  email: string;
}

export interface RegisterVerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface UserRegistrationRequest {
  email: string;
  name: string;
  gender: string;
  residence: string;
  cohort: string;
  inviteKey: string;
  verificationCode: string;
}

export async function validateInviteKey(
  inviteKey: string
): Promise<ApiResponse<string>> {
  const { data } = await apiClient.post<ApiResponse<string>>(
    "/api/users/validate-invite-key",
    { inviteKey }
  );
  return data;
}

export async function registerSendEmail(
  email: string
): Promise<ApiResponse<string>> {
  const { data } = await apiClient.post<ApiResponse<string>>(
    "/api/users/register/send-email",
    { email }
  );
  return data;
}

export async function registerVerifyEmail(
  email: string,
  verificationCode: string
): Promise<ApiResponse<string>> {
  const { data } = await apiClient.post<ApiResponse<string>>(
    "/api/users/register/verify-email",
    { email, verificationCode }
  );
  return data;
}

export async function register(
  body: UserRegistrationRequest
): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: UserResponse }>> {
  const { data } = await apiClient.post<
    ApiResponse<{ accessToken: string; refreshToken: string; user: UserResponse }>
  >("/api/users/register", body);
  if (data.success && data.data) {
    setTokens(data.data.accessToken, data.data.refreshToken);
  }
  return data;
}

export async function getMe(): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.get<ApiResponse<UserResponse>>(
    "/api/users/me"
  );
  return data;
}

export interface UpdateMeRequest {
  name?: string;
  residence?: string;
}

export async function updateMe(
  body: UpdateMeRequest
): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.put<ApiResponse<UserResponse>>(
    "/api/users/me",
    body
  );
  return data;
}

export async function getCurrentCohort(): Promise<ApiResponse<UserResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<UserResponse[]>>(
    "/api/users/current-cohort"
  );
  return data;
}

export async function getCohort(
  cohort: string
): Promise<ApiResponse<UserResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<UserResponse[]>>(
    `/api/users/cohort/${encodeURIComponent(cohort)}`
  );
  return data;
}

export async function searchUsers(params?: {
  name?: string;
  cohort?: string;
}): Promise<ApiResponse<UserResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<UserResponse[]>>(
    "/api/users/search",
    { params }
  );
  return data;
}
