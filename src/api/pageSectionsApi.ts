import axiosClient from "./axiosClient";
import type { AboutSectionDto, AboutSectionPayloadDto } from "./dtos/about.response";

/** Wrapper cho ApiResponse<T> của Spring Boot */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: number;
}

// ─── Page Sections API ───────────────────────────────────────

/** Tạo section mới */
export const createSection = async (payload: AboutSectionPayloadDto & { pageId: number }) => {
  const res = await axiosClient.post<ApiResponse<AboutSectionDto>>("/api/v1/page-sections", payload);
  return res.data.data;
};

/** Cập nhật section theo id */
export const updateSection = async (id: number, payload: AboutSectionPayloadDto & { pageId: number }) => {
  const res = await axiosClient.put<ApiResponse<AboutSectionDto>>(`/api/v1/page-sections/${id}`, payload);
  return res.data.data;
};

/** Xóa section theo id */
export const deleteSection = async (id: number) => {
  const res = await axiosClient.delete<ApiResponse<null>>(`/api/v1/page-sections/${id}`);
  return res.data;
};

/** Lấy tất cả sections theo pageId */
export const getSectionsByPageId = async (pageId: number) => {
  const res = await axiosClient.get<ApiResponse<AboutSectionDto[]>>("/api/v1/page-sections", {
    params: { pageId },
  });
  return res.data.data;
};
