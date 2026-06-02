/** Khớp fe-logistics/src/api/dtos/priceResponse.dto.ts */

export interface OtherOptionDto {
  icon: string;
  image: string;
  type: string;
  value: string;
}

export interface TableCellDto {
  text: string;
  colspan: number | null;
  rowspan: number | null;
  startRow: number;
}

export interface SectionDescriptionDto {
  type: "text" | "table" | string;
  icon: string;
  text: string;
  boldParts: string[];
  headers: string[] | null;
  cellRows: TableCellDto[][] | null;
}

export interface SectionDto {
  id: number;
  pageId: number;
  pageTitle: string;
  title: string;
  description: SectionDescriptionDto[];
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
  otherOptions: OtherOptionDto[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number | null;
  children: ServiceChildDto[] | null;
  sections: SectionDto[];
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
  otherOptions: OtherOptionDto[];
  sortIndex: number;
  active: boolean;
  type: string;
  parentId: number | null;
  children: ServiceChildDto[] | null;
  sections: SectionDto[];
  createdAt: string;
  updatedAt: string;
}
