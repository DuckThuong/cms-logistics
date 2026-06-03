import uploadAxiosClient from "../uploadAxiosClient";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: number;
}

/** Upload 1 file, trả về URL */
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await uploadAxiosClient.post<ApiResponse<{ url: string }>>(
    "/api/v1/files/upload",
    formData,
  );
  return res.data.data.url;
};

/** Upload nhiều file, trả về danh sách URL */
export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await uploadAxiosClient.post<ApiResponse<{ urls: string[] }>>(
    "/api/v1/files/upload-multiple",
    formData,
  );
  return res.data.data.urls;
};

/** Xóa file theo URL */
export const deleteFile = async (url: string): Promise<void> => {
  await uploadAxiosClient.delete<ApiResponse<null>>("/api/v1/files", {
    params: { url },
  });
};
