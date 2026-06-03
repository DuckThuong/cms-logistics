import { slugify } from "@/common/utils/seoUrl";
import type {
  PriceDetailContent,
  PriceDetailSection,
  PriceHubContent,
  PriceListItem,
  PriceOtherOption,
  PriceSectionDescription,
  PriceTableCell,
} from "@/common/types/price";

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const ensureCell = (cell: PriceTableCell): PriceTableCell => ({
  text: cell.text ?? "",
  colspan: cell.colspan ?? null,
  rowspan: cell.rowspan ?? null,
  startRow: cell.startRow ?? 0,
});

export const ensureDescription = (desc: PriceSectionDescription): PriceSectionDescription => {
  const type = desc.type === "table" ? "table" : "text";
  if (type === "table") {
    return {
      id: desc.id?.trim() || newId("desc"),
      type: "table",
      icon: desc.icon ?? "",
      text: "",
      boldParts: [],
      headers: desc.headers?.length ? desc.headers : [],
      cellRows: (desc.cellRows ?? []).map((row) => row.map(ensureCell)),
    };
  }
  return {
    id: desc.id?.trim() || newId("desc"),
    type: "text",
    icon: desc.icon ?? "",
    text: desc.text ?? "",
    boldParts: desc.boldParts ?? [],
    headers: null,
    cellRows: null,
  };
};

const ensureDescriptions = (
  items: PriceSectionDescription[] | undefined,
): PriceSectionDescription[] => (items ?? []).map((item) => ensureDescription(item));

const legacyDescriptions = (
  section: PriceDetailSection & { descriptions?: PriceSectionDescription[] },
): PriceSectionDescription[] =>
  section.description ?? section.descriptions ?? [];

const ensureSection = (
  section: PriceDetailSection & { descriptions?: PriceSectionDescription[] },
  index: number,
): PriceDetailSection => ({
  id: section.id?.trim() || newId("sec"),
  title: section.title ?? "",
  description: ensureDescriptions(legacyDescriptions(section)),
  sortIndex: section.sortIndex ?? index + 1,
  active: section.active ?? true,
});

const ensureListItem = (item: PriceListItem, index: number): PriceListItem => ({
  id: item.id?.trim() || newId("price"),
  name: item.name ?? "Bảng giá",
  shortDescription: item.shortDescription ?? "",
  url:
    item.url?.trim() ||
    slugify(item.shortDescription || item.name || `bang-gia-${index + 1}`),
  sortIndex: item.sortIndex ?? index + 1,
  active: item.active ?? true,
});

const ensureOtherOption = (opt: PriceOtherOption): PriceOtherOption => ({
  id: opt.id?.trim() || newId("opt"),
  icon: opt.icon ?? "",
  image: opt.image ?? "",
  type: opt.type ?? "info",
  value: opt.value ?? "",
});

export const migratePriceHub = (data: PriceHubContent): PriceHubContent => ({
  seoUrl: data.seoUrl?.trim() || "bang-gia",
  name: data.name ?? "",
  shortDescription: data.shortDescription ?? "",
  content: data.content ?? "",
  children: (data.children ?? [])
    .map(ensureListItem)
    .sort((a, b) => a.sortIndex - b.sortIndex)
    .map((item, index) => ({ ...item, sortIndex: index + 1 })),
});

export const migratePriceDetail = (data: PriceDetailContent): PriceDetailContent => {
  const url = data.url?.trim() || slugify(data.shortDescription || data.name || data.id);
  return {
    id: data.id?.trim() || newId("price"),
    name: data.name ?? "",
    url,
    shortDescription: data.shortDescription ?? "",
    description: data.description ?? [],
    content: data.content ?? data.name ?? "",
    otherOptions: (data.otherOptions ?? []).map(ensureOtherOption),
    sections: (data.sections ?? [])
      .map(ensureSection)
      .sort((a, b) => a.sortIndex - b.sortIndex),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  };
};
