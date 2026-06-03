import type { PriceDetailContent } from "@/common/types/price";

/** Trạng thái form trước khi API trả dữ liệu. */
export const EMPTY_PRICE_PAGE_CONTENT: PriceDetailContent = {
  id: "",
  name: "Bảng giá",
  url: "price",
  shortDescription: "",
  description: [],
  content: "",
  otherOptions: [],
  sections: [],
  updatedAt: new Date().toISOString(),
};
