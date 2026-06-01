import type { PricePageApiPayload, PriceApiSectionDescription } from "./apiTypes";
import type {
  PriceDetailContent,
  PriceDetailSection,
  PriceListItem,
  PriceOtherOption,
  PriceSectionDescription,
} from "./types";

const parseNumericId = (id: string): number => {
  const digits = id.replace(/\D/g, "");
  if (!digits) {
    return 0;
  }
  const n = Number.parseInt(digits, 10);
  return Number.isNaN(n) ? 0 : n;
};

export const mapOtherOptionToApi = (opt: PriceOtherOption) => ({
  icon: opt.icon ?? "",
  image: opt.image ?? "",
  type: opt.type ?? "info",
  value: opt.value ?? "",
});

export const mapSectionDescriptionToApi = (
  desc: PriceSectionDescription,
): PriceApiSectionDescription => {
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

export const mapSectionToApi = (
  section: PriceDetailSection,
  page: PriceDetailContent,
): PricePageApiPayload["sections"][number] => {
  const timestamp = page.updatedAt || new Date().toISOString();
  return {
    id: parseNumericId(section.id),
    pageId: parseNumericId(page.id),
    pageTitle: page.shortDescription || page.name,
    title: section.title,
    description: (section.description ?? []).map(mapSectionDescriptionToApi),
    images: [],
    sortIndex: section.sortIndex,
    active: section.active,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export type MapPriceDetailOptions = {
  listItem?: PriceListItem;
};

/** Chuyển nội dung CMS → payload khớp priceResponse.dto (ServiceByIdResponseDto) */
export const mapPriceDetailToApi = (
  detail: PriceDetailContent,
  options: MapPriceDetailOptions = {},
): PricePageApiPayload => {
  const { listItem } = options;
  const updatedAt = detail.updatedAt || new Date().toISOString();

  return {
    id: parseNumericId(detail.id),
    name: detail.name,
    url: detail.url,
    shortDescription: detail.shortDescription,
    image: null,
    description: detail.description ?? [],
    content: detail.content ?? listItem?.name ?? detail.name,
    otherOptions: (detail.otherOptions ?? []).map(mapOtherOptionToApi),
    sortIndex: listItem?.sortIndex ?? 1,
    active: listItem?.active ?? true,
    type: "PRICE",
    parentId: null,
    children: null,
    sections: (detail.sections ?? []).map((section) => mapSectionToApi(section, detail)),
    createdAt: updatedAt,
    updatedAt,
  };
};
