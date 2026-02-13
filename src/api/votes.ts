import { apiClient } from "./client";
import type {
  ApiResponse,
  FirstVoteStatusResponse,
  FlexibleVoteStatusResponse,
  VoteSummaryResponse,
} from "@/types/api";

export type VoteChoice = "PARTICIPATE" | "NOT_PARTICIPATE";

export interface FirstVoteRequest {
  choice: VoteChoice;
}

export interface FlexibleVoteRequest {
  choice: VoteChoice;
  changeType?: string;
  cancellationReason?: string;
}

export async function postFirstVote(
  scheduleId: number,
  body: FirstVoteRequest
): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.post<ApiResponse<unknown>>(
    `/api/votes/${scheduleId}/first-vote`,
    body
  );
  return data;
}

export async function putFirstVote(
  scheduleId: number,
  body: FirstVoteRequest
): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.put<ApiResponse<unknown>>(
    `/api/votes/${scheduleId}/first-vote`,
    body
  );
  return data;
}

export async function getFirstVoteStatus(
  scheduleId: number
): Promise<ApiResponse<FirstVoteStatusResponse>> {
  const { data } = await apiClient.get<ApiResponse<FirstVoteStatusResponse>>(
    `/api/votes/${scheduleId}/first-vote-status`
  );
  return data;
}

export async function getFirstVoteMe(
  scheduleId: number
): Promise<ApiResponse<{ choice?: VoteChoice }>> {
  const { data } = await apiClient.get<
    ApiResponse<{ choice?: VoteChoice }>
  >(`/api/votes/${scheduleId}/first-vote/me`);
  return data;
}

export async function postFlexibleVote(
  scheduleId: number,
  body: FlexibleVoteRequest
): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.post<ApiResponse<unknown>>(
    `/api/votes/${scheduleId}/flexible-vote`,
    body
  );
  return data;
}

export async function putFlexibleVote(
  scheduleId: number,
  body: FlexibleVoteRequest
): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.put<ApiResponse<unknown>>(
    `/api/votes/${scheduleId}/flexible-vote`,
    body
  );
  return data;
}

export async function getFlexibleVoteStatus(
  scheduleId: number
): Promise<ApiResponse<FlexibleVoteStatusResponse>> {
  const { data } = await apiClient.get<
    ApiResponse<FlexibleVoteStatusResponse>
  >(`/api/votes/${scheduleId}/flexible-vote-status`);
  return data;
}

export async function getFlexibleVoteMe(
  scheduleId: number
): Promise<ApiResponse<{ choice?: VoteChoice; cancellationReason?: string }>> {
  const { data } = await apiClient.get<
    ApiResponse<{ choice?: VoteChoice; cancellationReason?: string }>
  >(`/api/votes/${scheduleId}/flexible-vote/me`);
  return data;
}

export async function getVoteSummary(
  scheduleId: number
): Promise<ApiResponse<VoteSummaryResponse>> {
  const { data } = await apiClient.get<ApiResponse<VoteSummaryResponse>>(
    `/api/votes/${scheduleId}/summary`
  );
  return data;
}

export async function getFirstVoteHistory(): Promise<
  ApiResponse<Array<{ scheduleId: number; participate: boolean; [key: string]: unknown }>>
> {
  const { data } = await apiClient.get<
    ApiResponse<Array<{ scheduleId: number; participate: boolean; [key: string]: unknown }>>
  >("/api/votes/first-vote/history");
  return data;
}

export async function getFlexibleVoteHistory(): Promise<
  ApiResponse<Array<{ scheduleId: number; participate: boolean; [key: string]: unknown }>>
> {
  const { data } = await apiClient.get<
    ApiResponse<Array<{ scheduleId: number; participate: boolean; [key: string]: unknown }>>
  >("/api/votes/flexible-vote/history");
  return data;
}
