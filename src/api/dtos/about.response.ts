/** Khớp fe-logistics/src/api/dtos/about.response.ts */

export interface AboutOptionsDto {
  icon: string;
  type: string;
  value: string;
}

export interface AboutDescriptionDto {
  icon: string;
  text: string;
}

export interface AboutSectionDto {
  id: number;
  pageId: number;
  pageTitle: string;
  title: string;
  description: AboutDescriptionDto[];
  images: string[];
  sortIndex: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AboutResponseDto {
  id: number;
  name: string;
  url: string;
  shortDescription: string;
  content: string;
  description: string[];
  otherOptions: AboutOptionsDto[];
  sortIndex: number;
  active: boolean;
  type: "ABOUT";
  parentId: null;
  sections: AboutSectionDto[];
  createdAt: string;
  updatedAt: string;
}

/** Section gửi lên API (không có id/pageId/createdAt). */
export interface AboutSectionPayloadDto {
  title: string;
  description: AboutDescriptionDto[];
  images: string[];
  sortIndex: number;
  active: boolean;
}

/** Body lưu / gửi từ CMS Company Information. */
export interface AboutPagePayloadDto {
  name: string;
  url: string;
  shortDescription: string;
  content: string;
  otherOptions: AboutOptionsDto[];
  sections: AboutSectionPayloadDto[];
}

export interface TitleInterfaceProps {
  icon: string;
  text: string;
  type: string;
}
