import { apiClient } from "./client";
import type { ApiResponse, ScheduleResponse } from "@/types/api";

export async function getSchedule(
  scheduleId: number
): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse>>(
    `/api/schedules/${scheduleId}`
  );
  return data;
}

export async function getSchedulesByStatus(
  status: string
): Promise<ApiResponse<ScheduleResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    `/api/schedules/status/${status}`
  );
  return data;
}

export async function getActiveFirstVoteSchedules(): Promise<
  ApiResponse<ScheduleResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    "/api/schedules/active-first-vote"
  );
  return data;
}

export async function getFirstVoteDeadlineApproaching(): Promise<
  ApiResponse<ScheduleResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    "/api/schedules/first-vote-deadline-approaching"
  );
  return data;
}

export async function getConfirmedSchedules(): Promise<
  ApiResponse<ScheduleResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    "/api/schedules/confirmed"
  );
  return data;
}
