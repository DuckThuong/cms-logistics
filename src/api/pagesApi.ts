import axiosClient from "./axiosClient";
import type { AboutPagePayloadDto, AboutResponseDto } from "./dtos/about.response";

/** Wrapper cho ApiResponse<T> của Spring Boot */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: number;
}

// ─── Pages API ───────────────────────────────────────────────

/** Tạo page mới (kèm sections nếu có trong payload) */
export const createPage = async (payload: AboutPagePayloadDto) => {
  const res = await axiosClient.post<ApiResponse<AboutResponseDto>>("/api/v1/pages", payload);
  return res.data.data;
};

/** Cập nhật page theo id */
export const updatePage = async (id: number, payload: AboutPagePayloadDto) => {
  const res = await axiosClient.put<ApiResponse<AboutResponseDto>>(`/api/v1/pages/${id}`, payload);
  return res.data.data;
};

/** Lấy page + sections theo id */
export const getPageById = async (id: number) => {
  const res = await axiosClient.get<ApiResponse<AboutResponseDto>>(`/api/v1/pages/${id}`);
  return res.data.data;
};

/** Lấy page + sections theo url (SEO) */
export const getPageByUrl = async (url: string) => {
  const res = await axiosClient.get<ApiResponse<AboutResponseDto>>("/api/v1/pages/by-url", {
    params: { url },
  });
  return res.data.data;
};

/** Lấy tất cả pages */
export const getAllPages = async () => {
  const res = await axiosClient.get<ApiResponse<AboutResponseDto[]>>("/api/v1/pages");
  return res.data.data;
};

/** Lấy pages theo type (ABOUT, SERVICE, PRICE, ...) */
export const getPagesByType = async (type: string) => {
  const res = await axiosClient.get<ApiResponse<AboutResponseDto[]>>("/api/v1/pages/by-type", {
    params: { type },
  });
  return res.data.data;
};

/** Xóa page theo id */
export const deletePage = async (id: number) => {
  const res = await axiosClient.delete<ApiResponse<null>>(`/api/v1/pages/${id}`);
  return res.data;
};
