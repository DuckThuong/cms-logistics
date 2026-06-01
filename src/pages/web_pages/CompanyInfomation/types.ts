export interface HighlightItem {
  id: string;
  label: string;
  /** URL ảnh hoặc ký tự/emoji hiển thị icon */
  icon: string;
}

export interface QuickLinkItem {
  id: string;
  label: string;
  anchor: string;
  icon: string;
}

export interface ExtraFieldItem {
  id: string;
  title: string;
  description: string;
}

export interface ContentSectionItem {
  id: string;
  anchor: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
}

/** Khối dịch vụ / từ chối: tiêu đề + danh sách dòng nội dung */
export interface TitledContentSection {
  id: string;
  title: string;
  /** Liên kết nhanh (#anchor) */
  anchor: string;
  content: string[];
}

export interface CompanyInformationContent {
  seoUrl: string;
  pageTag: string;
  pageTitle: string;
  pageSubtitle: string;
  introTitle: string;
  /** Liên kết nhanh (#anchor) cho khối giới thiệu */
  introAnchor: string;
  introContent: string;
  introImageUrl: string;
  headerExtras: ExtraFieldItem[];
  policySections: TitledContentSection[];
  sections: ContentSectionItem[];
  closingLineOne: string;
  closingLineTwo: string;
  highlights: HighlightItem[];
  quickLinks: QuickLinkItem[];
}
