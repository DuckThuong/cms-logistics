import type {
  OtherOptionDto,
  SectionDescriptionDto,
  SectionDto,
  ServiceChildDto,
} from "@/api/dtos/priceResponse.dto";
import type {
  PriceDetailContent,
  PriceDetailSection,
  PriceHubContent,
  PriceListItem,
  PriceOtherOption,
  PriceSectionDescription,
} from "@/common/types/price";
import { mapChildDtoToPriceListItem } from "@/common/utils/mapFromPriceResponse";
import { buildSectionTitle } from "@/common/utils/sectionTitle";

export type PriceSectionPayloadDto = Omit<
  SectionDto,
  "id" | "pageId" | "pageTitle" | "createdAt" | "updatedAt"
>;

export interface PricePageWritePayloadDto {
  name: string;
  url: string;
  shortDescription: string;
  content: string;
  description?: string[];
  otherOptions?: OtherOptionDto[];
  sections?: PriceSectionPayloadDto[] | SectionDto[];
  type?: string;
  parentId?: number | null;
  image?: string | null;
  active?: boolean;
  sortIndex?: number;
}

export const mapOtherOptionToApi = (opt: PriceOtherOption): OtherOptionDto => ({
  icon: opt.icon ?? "",
  image: opt.image ?? "",
  type: opt.type ?? "info",
  value: opt.value ?? "",
});

export const mapSectionDescriptionToApi = (
  desc: PriceSectionDescription,
): SectionDescriptionDto => {
  if (desc.type === "table") {
    return {
      type: "table",
      icon: desc.icon ?? "",
      text: desc.text ?? "",
      boldParts: [],
      headers: desc.headers?.length ? desc.headers : [],
      cellRows: desc.cellRows?.length ? desc.cellRows : [],
    };
  }

  return {
    type: "text",
    icon: desc.icon ?? "",
    text: desc.text ?? "",
    boldParts: desc.boldParts ?? [],
    headers: null,
    cellRows: null,
  };
};

const mapSectionToWritePayload = (section: PriceDetailSection): PriceSectionPayloadDto => ({
  title: section.title ? buildSectionTitle(section.title) : "",
  description: (section.description ?? []).map(mapSectionDescriptionToApi),
  images: [],
  sortIndex: section.sortIndex,
  active: section.active ?? true,
});

export type MapPriceDetailOptions = {
  listItem?: PriceListItem;
  parentId?: number | null;
};

/** Hub /bang-gia — giữ sections hub từ API nếu có. */
export const mapPriceHubToApi = (
  hub: PriceHubContent,
  existingHubSections: SectionDto[] = [],
): PricePageWritePayloadDto => ({
  name: hub.name,
  url: hub.seoUrl,
  shortDescription: hub.shortDescription,
  content: hub.content,
  description: [],
  otherOptions: [],
  sections: existingHubSections,
  type: "PRICE",
  active: true,
});

export type PriceChildExistingPayload = {
  sections?: SectionDto[];
  otherOptions?: OtherOptionDto[];
  description?: string[];
  content?: string;
};

/** Thẻ bảng giá (children) — giữ nội dung chi tiết khi chỉ sửa metadata hub. */
export const mapPriceChildCardToApi = (
  child: PriceListItem,
  parentId: number,
  existing: PriceChildExistingPayload = {},
): PricePageWritePayloadDto => ({
  name: child.name,
  url: child.url,
  shortDescription: child.shortDescription,
  content: existing.content ?? (child.shortDescription || child.name),
  description: existing.description ?? [],
  otherOptions: existing.otherOptions ?? [],
  sections: existing.sections ?? [],
  sortIndex: child.sortIndex,
  active: child.active ?? true,
  type: "PRICE",
  parentId,
  image: null,
});

/** Trang chi tiết bảng giá — gửi đầy đủ sections, banner, intro. */
export const mapPriceDetailToApi = (
  detail: PriceDetailContent,
  options: MapPriceDetailOptions = {},
): PricePageWritePayloadDto => {
  const { listItem, parentId = null } = options;

  return {
    name: detail.name,
    url: detail.url,
    shortDescription: detail.shortDescription,
    content: detail.content ?? listItem?.name ?? detail.name,
    description: detail.description ?? [],
    otherOptions: (detail.otherOptions ?? []).map(mapOtherOptionToApi),
    sortIndex: listItem?.sortIndex ?? 1,
    active: listItem?.active ?? true,
    type: "PRICE",
    parentId,
    image: null,
    sections: (detail.sections ?? []).map(mapSectionToWritePayload),
  };
};

export const mapSavedChildToPriceListItem = (saved: ServiceChildDto): PriceListItem =>
  mapChildDtoToPriceListItem(saved);
