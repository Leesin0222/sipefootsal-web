import { apiClient } from "./client";
import type {
  ApiResponse,
  PageResponse,
  SettlementResponse,
  SettlementHistoryResponse,
  SettlementStatisticsResponse,
} from "@/types/api";

export async function getMySettlementHistories(params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<PageResponse<SettlementHistoryResponse>>> {
  const { data } = await apiClient.get<
    ApiResponse<PageResponse<SettlementHistoryResponse>>
  >("/api/user/settlements", { params });
  return data;
}

export async function getSettlement(
  settlementId: number
): Promise<ApiResponse<SettlementResponse>> {
  const { data } = await apiClient.get<ApiResponse<SettlementResponse>>(
    `/api/user/settlements/${settlementId}`
  );
  return data;
}

export async function getSettlementStatistics(): Promise<
  ApiResponse<SettlementStatisticsResponse>
> {
  const { data } = await apiClient.get<
    ApiResponse<SettlementStatisticsResponse>
  >("/api/user/settlements/statistics");
  return data;
}

export async function completeSettlement(
  settlementId: number
): Promise<ApiResponse<void>> {
  const { data } = await apiClient.post<ApiResponse<void>>(
    `/api/user/settlements/${settlementId}/complete`
  );
  return data;
}

export async function getPendingSettlements(): Promise<
  ApiResponse<SettlementResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<SettlementResponse[]>>(
    "/api/user/settlements/pending"
  );
  return data;
}
