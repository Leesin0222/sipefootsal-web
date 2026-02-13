import { apiClient } from "./client";
import type { ApiResponse, BadgeResponse } from "@/types/api";

export async function getBadges(): Promise<ApiResponse<BadgeResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<BadgeResponse[]>>(
    "/api/badges"
  );
  return data;
}

export async function getMyBadges(): Promise<ApiResponse<BadgeResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<BadgeResponse[]>>(
    "/api/badges/my"
  );
  return data;
}

export async function getUserBadges(
  userId: number
): Promise<ApiResponse<BadgeResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<BadgeResponse[]>>(
    `/api/badges/user/${userId}`
  );
  return data;
}
