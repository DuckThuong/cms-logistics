/** Một dòng mô tả HTML trong section chi tiết (khớp FE: description[].text) */
export interface ServiceSectionDescription {
  id: string;
  text: string;
}

/** Section nội dung trang chi tiết dịch vụ (khớp FE: sections[]) */
export interface ServiceDetailSection {
  id: string;
  title: string;
  descriptions: ServiceSectionDescription[];
  sortIndex: number;
  active: boolean;
}

/** Thẻ dịch vụ trên hub — khớp FE children[] */
export interface ServiceListItem {
  id: string;
  /** Nhãn trên card (FE: child.name) */
  name: string;
  /** Tiêu đề card (FE: child.shortDescription) */
  shortDescription: string;
  image: string;
  /** Slug URL chi tiết, vd. dat-hang-trung-quoc */
  url: string;
  sortIndex: number;
  active: boolean;
}

/** Trang hub /dich-vu — khớp FE ServiceResponseDto (cấp root) */
export interface ServiceHubContent {
  seoUrl: string;
  name: string;
  shortDescription: string;
  content: string;
  appBannerUrl: string;
  appBannerLabel: string;
  children: ServiceListItem[];
}

/** Trang chi tiết từng dịch vụ — khớp FE ServiceChildDto */
export interface ServiceDetailContent {
  id: string;
  name: string;
  url: string;
  image: string;
  sections: ServiceDetailSection[];
}
