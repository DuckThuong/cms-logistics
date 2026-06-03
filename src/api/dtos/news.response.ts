/** Khớp fe-logistics/src/api/dtos/new.response.ts */

export interface NewsOtherOptionDto {
  icon: string;
  image: string;
  type: string;
  value: string;
}

export interface NewsSectionDescriptionDto {
  type: string;
  icon: string;
  img: string | null;
  text: string;
  boldParts: string[] | null;
  headers: string[];
  cellRows: unknown[];
}

export interface NewsSectionDto {
  id: number;
  pageId: number;
  pageTitle: string;
  title: string;
  description: NewsSectionDescriptionDto[];
  images: unknown[];
  sortIndex: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsChildDto {
  id: number;
  name: string;
  url: string;
  shortDescription: string;
  image: string;
  description: string[];
  content: string;
  otherOptions: NewsOtherOptionDto[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number;
  updatedAt: string;
  createdAt: string;
  sections?: NewsSectionDto[];
}

export interface NewsContentDto {
  id: number;
  name: string;
  url: string;
  shortDescription: string;
  image: string;
  description: string[];
  content: string;
  otherOptions: NewsOtherOptionDto[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number | null;
  children: NewsChildDto[];
  sections: NewsSectionDto[];
  createdAt: string;
  updatedAt: string;
}

export type NewsPageWritePayloadDto = {
  name?: string;
  url?: string;
  shortDescription?: string;
  content?: string;
  description?: string[];
  image?: string | null;
  sortIndex?: number;
  active?: boolean;
  type?: string;
  parentId?: number | null;
  otherOptions?: NewsOtherOptionDto[];
  sections?: Omit<
    NewsSectionDto,
    "id" | "pageId" | "pageTitle" | "createdAt" | "updatedAt"
  >[];
};
