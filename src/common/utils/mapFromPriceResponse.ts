import type {
  OtherOptionDto,
  SectionDescriptionDto,
  SectionDto,
  ServiceChildDto,
} from "@/api/dtos/priceResponse.dto";
import type { ServiceFeaturedDto, ServiceResponseDto } from "@/api/dtos/service.response";
import type {
  PriceDetailContent,
  PriceDetailSection,
  PriceHubContent,
  PriceListItem,
  PriceOtherOption,
  PriceSectionDescription,
  PriceTableCell,
} from "@/common/types/price";
import { parseSectionTitle } from "@/common/utils/sectionTitle";

/** Hub hoặc trang bảng giá đơn (GET by-url?url=price). */
export type PricePageDto = ServiceResponseDto | ServiceChildDto;

const newDescId = (sectionKey: string | number, index: number) =>
  `desc-${sectionKey}-${index}`;

const mapCellFromApi = (cell: PriceTableCell): PriceTableCell => ({
  text: cell.text ?? "",
  colspan: cell.colspan ?? null,
  rowspan: cell.rowspan ?? null,
  startRow: cell.startRow ?? 0,
});

const mapDescriptionFromApi = (
  desc: SectionDescriptionDto,
  sectionKey: string | number,
  index: number,
): PriceSectionDescription => {
  if (desc.type === "table") {
    return {
      id: newDescId(sectionKey, index),
      type: "table",
      icon: desc.icon ?? "",
      text: desc.text ?? "",
      boldParts: [],
      headers: desc.headers?.length ? desc.headers : [],
      cellRows: (desc.cellRows ?? []).map((row) => row.map(mapCellFromApi)),
    };
  }

  return {
    id: newDescId(sectionKey, index),
    type: "text",
    icon: desc.icon ?? "",
    text: desc.text ?? "",
    boldParts: desc.boldParts ?? [],
    headers: null,
    cellRows: null,
  };
};

const mapSectionFromApi = (section: SectionDto, index: number): PriceDetailSection => {
  const sectionKey = section.id ?? index;
  return {
    id: section.id ? String(section.id) : `sec-${index + 1}`,
    title: parseSectionTitle(section.title ?? ""),
    sortIndex: section.sortIndex ?? index + 1,
    active: section.active ?? true,
    description: (section.description ?? []).map((desc, descIndex) =>
      mapDescriptionFromApi(desc, sectionKey, descIndex),
    ),
  };
};

const mapOtherOptionFromApi = (opt: OtherOptionDto, index: number): PriceOtherOption => ({
  id: `opt-${index}`,
  icon: opt.icon ?? "",
  image: opt.image ?? "",
  type: opt.type ?? "info",
  value: opt.value ?? "",
});

export const mapChildDtoToPriceListItem = (
  child: ServiceFeaturedDto | ServiceChildDto,
): PriceListItem => ({
  id: String(child.id),
  name: child.name ?? "",
  shortDescription: child.shortDescription ?? "",
  url: child.url ?? "",
  sortIndex: child.sortIndex ?? 1,
  active: child.active ?? true,
});

export const mapResponseToPriceHub = (response: ServiceResponseDto): PriceHubContent => ({
  seoUrl: response.url ?? "price",
  name: response.name ?? "",
  shortDescription: response.shortDescription ?? "",
  content: response.content ?? "",
  children: (response.children ?? [])
    .map(mapChildDtoToPriceListItem)
    .sort((a, b) => a.sortIndex - b.sortIndex),
});

export const mapResponseToPriceDetail = (response: PricePageDto): PriceDetailContent => {
  const sections: PriceDetailSection[] = (response.sections ?? [])
    .map(mapSectionFromApi)
    .sort((a, b) => a.sortIndex - b.sortIndex);

  return {
    id: String(response.id),
    name: response.name ?? "",
    url: response.url ?? "",
    shortDescription: response.shortDescription ?? "",
    description: response.description ?? [],
    content: response.content ?? "",
    otherOptions: (response.otherOptions ?? []).map(mapOtherOptionFromApi),
    sections,
    updatedAt: response.updatedAt ?? new Date().toISOString(),
  };
};
