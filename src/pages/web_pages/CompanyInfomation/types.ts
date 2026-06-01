export interface HighlightItem {
  id: string;
  label: string;
}

export interface QuickLinkItem {
  id: string;
  label: string;
  anchor: string;
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

export interface CompanyInformationContent {
  seoUrl: string;
  pageTag: string;
  pageTitle: string;
  pageSubtitle: string;
  introTitle: string;
  introContent: string;
  introImageUrl: string;
  headerExtras: ExtraFieldItem[];
  servicesTitle: string;
  services: string[];
  refusalsTitle: string;
  refusals: string[];
  sections: ContentSectionItem[];
  closingLineOne: string;
  closingLineTwo: string;
  highlights: HighlightItem[];
  quickLinks: QuickLinkItem[];
}
