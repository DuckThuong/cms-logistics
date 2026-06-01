/**
 * Mirror fe-logistics/src/api/dtos/priceResponse.dto.ts
 * Dùng khi map payload gửi API / so sánh với FE.
 */

export interface PriceApiOtherOption {
  icon: string;
  image: string;
  type: string;
  value: string;
}

export interface PriceApiTableCell {
  text: string;
  colspan: number | null;
  rowspan: number | null;
  startRow: number;
}

export interface PriceApiSectionDescription {
  type: string;
  icon: string;
  text: string;
  boldParts: string[];
  headers: string[] | null;
  cellRows: PriceApiTableCell[][] | null;
}

export interface PriceApiSection {
  id: number;
  pageId: number;
  pageTitle: string;
  title: string;
  description: PriceApiSectionDescription[];
  images: unknown[];
  sortIndex: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Khớp ServiceByIdResponseDto — body getPriceContent / trang chi tiết bảng giá */
export interface PricePageApiPayload {
  id: number;
  name: string;
  url: string;
  shortDescription: string;
  image: string | null;
  description: string[];
  content: string;
  otherOptions: PriceApiOtherOption[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number | null;
  children: null;
  sections: PriceApiSection[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceDetailStorageRecord {
  cms: import("./types").PriceDetailContent;
  api: PricePageApiPayload;
}
