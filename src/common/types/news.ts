import type {
  ServiceDetailSection,
  ServiceSectionDescription,
} from "@/common/types/service";

/** Mô tả section tin tức — cùng cấu trúc dịch vụ, thêm ảnh cho text-img */
export type NewsSectionDescription = ServiceSectionDescription & {
  img?: string;
};

export type NewsDetailSection = ServiceDetailSection;

/** Thẻ tin trên hub — khớp FE children[] */
export interface NewsListItem {
  id: string;
  /** Nhãn tag trên card (FE: child.name) */
  name: string;
  /** Tiêu đề card (FE: child.shortDescription) */
  shortDescription: string;
  image: string;
  url: string;
  sortIndex: number;
  active: boolean;
  /** Ngày hiển thị — otherOptions type text */
  publishDate: string;
}

/** Trang hub /tin-tuc */
export interface NewsHubContent {
  seoUrl: string;
  /** Badge hero (FE: shortDescription) */
  shortDescription: string;
  /** Tiêu đề hero — description[0] */
  heroTitle: string;
  /** Phụ đề hero — otherOptions[0] */
  heroSubtitle: string;
  children: NewsListItem[];
}

/** Trang chi tiết bài viết */
export interface NewsDetailContent {
  id: string;
  /** Nhãn breadcrumb hub (FE: name) */
  name: string;
  /** Tiêu đề bài (FE: shortDescription) */
  shortDescription: string;
  url: string;
  image: string;
  publishDate: string;
  sections: NewsDetailSection[];
}
