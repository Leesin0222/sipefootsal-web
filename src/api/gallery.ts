import { apiClient } from "./client";
import type {
  ApiResponse,
  GalleryResponse,
  PageResponse,
} from "@/types/api";

export async function getGalleryBySchedule(
  scheduleId: number
): Promise<ApiResponse<GalleryResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<GalleryResponse[]>>(
    `/api/gallery/schedule/${scheduleId}`
  );
  return data;
}

export async function getGalleryBySchedulePaged(
  scheduleId: number,
  params?: { page?: number; size?: number }
): Promise<ApiResponse<PageResponse<GalleryResponse>>> {
  const { data } = await apiClient.get<
    ApiResponse<PageResponse<GalleryResponse>>
  >(`/api/gallery/schedule/${scheduleId}/paged`, { params });
  return data;
}

export async function getRecentGallery(): Promise<
  ApiResponse<GalleryResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<GalleryResponse[]>>(
    "/api/gallery/recent"
  );
  return data;
}

export async function getGalleryItem(
  galleryId: number
): Promise<ApiResponse<GalleryResponse>> {
  const { data } = await apiClient.get<ApiResponse<GalleryResponse>>(
    `/api/gallery/${galleryId}`
  );
  return data;
}
