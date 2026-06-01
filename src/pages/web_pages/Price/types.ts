/** Ô trong bảng giá (khớp FE TableCellDto) */
export interface PriceTableCell {
  text: string;
  colspan: number | null;
  rowspan: number | null;
  startRow: number;
}

/** Mô tả trong section: text hoặc table */
export interface PriceSectionDescription {
  id: string;
  type: "text" | "table";
  icon: string;
  text: string;
  boldParts: string[];
  headers: string[] | null;
  cellRows: PriceTableCell[][] | null;
}

export interface PriceDetailSection {
  id: string;
  title: string;
  /** Khớp FE SectionDto.description (không phải descriptions) */
  description: PriceSectionDescription[];
  sortIndex: number;
  active: boolean;
}

export interface PriceOtherOption {
  id: string;
  icon: string;
  image: string;
  type: string;
  value: string;
}

/** Mục trong danh sách bảng giá (nav con) */
export interface PriceListItem {
  id: string;
  name: string;
  shortDescription: string;
  url: string;
  sortIndex: number;
  active: boolean;
}

export interface PriceHubContent {
  seoUrl: string;
  name: string;
  shortDescription: string;
  content: string;
  children: PriceListItem[];
}

/** Trang chi tiết bảng giá — khớp FE ServiceByIdResponseDto / getPriceContent */
export interface PriceDetailContent {
  id: string;
  name: string;
  url: string;
  shortDescription: string;
  /** Đoạn intro — khớp FE description[] (cấp page) */
  description: string[];
  /** Mô tả phụ — khớp FE content (tùy API) */
  content: string;
  otherOptions: PriceOtherOption[];
  sections: PriceDetailSection[];
  updatedAt: string;
}
