import { apiClient } from "./client";
import type { ApiResponse, NoticeResponse, PageResponse } from "@/types/api";

export async function getNoticesPaged(params?: {
  page?: number;
  size?: number;
  priority?: string;
  status?: string;
}): Promise<ApiResponse<PageResponse<NoticeResponse>>> {
  const { data } = await apiClient.get<
    ApiResponse<PageResponse<NoticeResponse>>
  >("/api/notices/paged", { params });
  return data;
}

export async function getNotice(
  noticeId: number
): Promise<ApiResponse<NoticeResponse>> {
  const { data } = await apiClient.get<ApiResponse<NoticeResponse>>(
    `/api/notices/${noticeId}`
  );
  return data;
}

export async function getLatestNotices(): Promise<
  ApiResponse<NoticeResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<NoticeResponse[]>>(
    "/api/notices/latest"
  );
  return data;
}
