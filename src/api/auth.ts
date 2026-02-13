import { apiClient, clearTokens, setTokens } from "./client";
import type { ApiResponse, AuthResponse } from "@/types/api";

export async function sendVerificationEmail(
  email: string
): Promise<ApiResponse<string>> {
  const { data } = await apiClient.post<ApiResponse<string>>(
    "/api/auth/send-email",
    { email }
  );
  return data;
}

export async function verifyEmail(
  email: string,
  verificationCode: string
): Promise<ApiResponse<string>> {
  const { data } = await apiClient.post<ApiResponse<string>>(
    "/api/auth/verify-email",
    { email, verificationCode }
  );
  return data;
}

export async function login(
  email: string,
  verificationCode: string
): Promise<ApiResponse<AuthResponse>> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    "/api/auth/login",
    { email, verificationCode }
  );
  if (data.success && data.data) {
    setTokens(data.data.accessToken, data.data.refreshToken);
  }
  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } finally {
    clearTokens();
  }
}

export async function getMe(): Promise<ApiResponse<AuthResponse["user"]>> {
  const { data } = await apiClient.get<ApiResponse<AuthResponse["user"]>>(
    "/api/auth/me"
  );
  return data;
}
