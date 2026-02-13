import { apiClient } from "./client";
import type {
  ApiResponse,
  CommentResponse,
  PageResponse,
} from "@/types/api";

export async function getCommentsBySchedule(
  scheduleId: number
): Promise<ApiResponse<CommentResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<CommentResponse[]>>(
    `/api/comments/schedule/${scheduleId}`
  );
  return data;
}

export async function getCommentsBySchedulePaged(
  scheduleId: number,
  params?: { page?: number; size?: number }
): Promise<ApiResponse<PageResponse<CommentResponse>>> {
  const { data } = await apiClient.get<
    ApiResponse<PageResponse<CommentResponse>>
  >(`/api/comments/schedule/${scheduleId}/paged`, { params });
  return data;
}

export async function createComment(
  scheduleId: number,
  content: string
): Promise<ApiResponse<CommentResponse>> {
  const { data } = await apiClient.post<ApiResponse<CommentResponse>>(
    `/api/comments/schedule/${scheduleId}`,
    null,
    { params: { content } }
  );
  return data;
}

export async function updateComment(
  commentId: number,
  content: string
): Promise<ApiResponse<CommentResponse>> {
  const { data } = await apiClient.put<ApiResponse<CommentResponse>>(
    `/api/comments/${commentId}`,
    { content }
  );
  return data;
}

export async function deleteComment(
  commentId: number
): Promise<ApiResponse<void>> {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/comments/${commentId}`
  );
  return data;
}
