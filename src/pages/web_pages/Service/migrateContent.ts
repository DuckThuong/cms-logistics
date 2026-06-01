import { slugify } from "@/common/utils/seoUrl";
import type {
  ServiceDetailContent,
  ServiceDetailSection,
  ServiceHubContent,
  ServiceListItem,
  ServiceSectionDescription,
} from "./types";

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const ensureDescriptions = (
  descriptions: ServiceSectionDescription[] | undefined,
): ServiceSectionDescription[] =>
  (descriptions ?? []).map((item, index) => ({
    id: item.id?.trim() || newId("desc"),
    text: item.text ?? "",
  }));

const ensureSections = (
  sections: ServiceDetailSection[] | undefined,
): ServiceDetailSection[] =>
  (sections ?? []).map((section, index) => ({
    id: section.id?.trim() || newId("sec"),
    title: section.title ?? "",
    descriptions: ensureDescriptions(section.descriptions),
    sortIndex: section.sortIndex ?? index + 1,
    active: section.active ?? true,
  }));

const ensureListItem = (item: ServiceListItem, index: number): ServiceListItem => {
  const url =
    item.url?.trim() ||
    slugify(item.shortDescription || item.name || `dich-vu-${index + 1}`);
  return {
    id: item.id?.trim() || newId("svc"),
    name: item.name ?? "Dịch vụ",
    shortDescription: item.shortDescription ?? "",
    image: item.image ?? "",
    url,
    sortIndex: item.sortIndex ?? index + 1,
    active: item.active ?? true,
  };
};

export const migrateServiceHub = (data: ServiceHubContent): ServiceHubContent => ({
  seoUrl: data.seoUrl?.trim() || "/dich-vu",
  name: data.name ?? "",
  shortDescription: data.shortDescription ?? "",
  content: data.content ?? "",
  appBannerUrl: data.appBannerUrl ?? "",
  appBannerLabel: data.appBannerLabel ?? "",
  children: (data.children ?? [])
    .map(ensureListItem)
    .sort((a, b) => a.sortIndex - b.sortIndex)
    .map((item, index) => ({ ...item, sortIndex: index + 1 })),
});

export const migrateServiceDetail = (data: ServiceDetailContent): ServiceDetailContent => {
  const url = data.url?.trim() || slugify(data.name || data.id);
  return {
    id: data.id?.trim() || newId("svc"),
    name: data.name ?? "",
    url,
    image: data.image ?? "",
    sections: ensureSections(data.sections).sort((a, b) => a.sortIndex - b.sortIndex),
  };
};
