/** Khớp FE `ABOUT_OPTION_TYPES` */
export const ABOUT_OPTION_TYPES = {
  highlight: "options",
  quickLink: "quick-link",
} as const;

export type AboutOptionType =
  (typeof ABOUT_OPTION_TYPES)[keyof typeof ABOUT_OPTION_TYPES];

export interface AboutOtherOption {
  id: string;
  icon: string;
  type: AboutOptionType;
  /** Highlight & quick-link: nhãn hiển thị (khớp FE `otherOptions[].value`). */
  value: string;
}

export interface AboutIntro {
  title: string;
  anchor: string;
  content: string;
  imageUrl: string;
}

export interface AboutSectionDescription {
  icon: string;
  text: string;
}

export type AboutSectionKind = "policy" | "content" | "closing";

export interface AboutSection {
  id: string;
  sortIndex: number;
  kind: AboutSectionKind;
  active: boolean;
  title: string;
  anchor: string;
  description: AboutSectionDescription[];
  /** Nội dung chi tiết (khối tuỳ biến) */
  body?: string;
  images: string[];
}

export interface ExtraFieldItem {
  id: string;
  title: string;
  description: string;
}

export interface CompanyInformationContent {
  seoUrl: string;
  pageTag: string;
  pageTitle: string;
  pageSubtitle: string;
  headerExtras: ExtraFieldItem[];
  intro: AboutIntro;
  otherOptions: AboutOtherOption[];
  sections: AboutSection[];
}
