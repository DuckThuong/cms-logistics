/** Khớp fe-logistics/src/api/dtos/service.response.ts */

export interface ServiceResponseDto {
  id: number;
  name: string;
  url: string;
  shortDescription: string;
  content: string;
  description: string[];
  children: ServiceFeaturedDto[];
  otherOptions: ServiceOptionsDto[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number | null;
  sections: ServiceHubSectionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceHubSectionDto {
  id: number;
  pageId: number;
  pageTitle: string;
  title: string;
  description: ServiceDescriptionDto[];
  images: string[];
  sortIndex: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOptionsDto {
  icon: string;
  type: string;
  value: string;
}

export interface ServiceDescriptionDto {
  icon: string;
  text: string;
  type?: string;
}

export interface ServiceFeaturedDto {
  active: boolean;
  content: string;
  description: [];
  id: number;
  image: string;
  name: string;
  otherOptions: [];
  parentId: number;
  shortDescription: string;
  sortIndex: number;
  type: string;
  url: string;
}

export interface ServiceSectionDescriptionDto {
  type: string;
  icon: string;
  text: string;
  boldParts: string[];
  headers: string[] | null;
  cellRows: string[][] | null;
}

export interface ServiceDetailSectionDto {
  id: number;
  pageId: number;
  pageTitle: string;
  title: string;
  description: ServiceSectionDescriptionDto[];
  images: unknown[];
  sortIndex: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceChildDto {
  id: number;
  name: string;
  url: string;
  shortDescription: string;
  image: string | null;
  description: string[];
  content: string;
  otherOptions: unknown[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number | null;
  children: ServiceChildDto[] | null;
  sections: ServiceDetailSectionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceByIdResponseDto {
  id: number;
  name: string;
  url: string;
  shortDescription: string;
  image: string | null;
  description: string[];
  content: string;
  otherOptions: unknown[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number | null;
  children: ServiceChildDto[] | null;
  sections: ServiceDetailSectionDto[];
  createdAt: string;
  updatedAt: string;
}

/** Section gửi lên API (không có id/pageId/createdAt). */
export type ServiceSectionPayloadDto = Omit<
  ServiceDetailSectionDto,
  "id" | "pageId" | "pageTitle" | "createdAt" | "updatedAt"
>;

/** Body lưu page SERVICE từ CMS. */
export interface ServicePageWritePayloadDto {
  name: string;
  url: string;
  shortDescription: string;
  content: string;
  otherOptions?: ServiceOptionsDto[];
  sections?: ServiceSectionPayloadDto[];
  type?: string;
  parentId?: number | null;
  image?: string | null;
  active?: boolean;
  sortIndex?: number;
}
