import type { ServiceHubContent } from "@/common/types/service";

/** Trạng thái form rỗng trước khi API trả dữ liệu hoặc khi chưa có page trên server. */
export const EMPTY_SERVICE_HUB_CONTENT: ServiceHubContent = {
  seoUrl: "",
  name: "",
  shortDescription: "",
  content: "",
  appBannerUrl: "",
  appBannerLabel: "",
  children: [],
};
