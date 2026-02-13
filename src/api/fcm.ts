import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";

export async function registerFcmToken(
  token: string
): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(
    "/api/fcm/token",
    { token }
  );
  return data;
}

export async function deleteFcmToken(): Promise<ApiResponse<void>> {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    "/api/fcm/token"
  );
  return data;
}
