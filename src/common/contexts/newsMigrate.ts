import type {
  NewsDetailContent,
  NewsDetailSection,
  NewsHubContent,
  NewsListItem,
  NewsSectionDescription,
} from "@/common/types/news";
import { DEFAULT_DESCRIPTION_TYPE } from "@/common/utils/companyInformationSection";
import { slugify } from "@/common/utils/seoUrl";

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const ensureListItem = (item: NewsListItem, index: number): NewsListItem => {
  const url =
    item.url?.trim() ||
    slugify(item.shortDescription || item.name || `tin-tuc-${index + 1}`);
  return {
    id: item.id?.trim() || newId("news"),
    name: item.name ?? "Tin tức",
    shortDescription: item.shortDescription ?? "",
    image: item.image ?? "",
    url,
    sortIndex: item.sortIndex ?? index + 1,
    active: item.active ?? true,
    publishDate: item.publishDate ?? "",
  };
};

export const migrateNewsHub = (data: NewsHubContent): NewsHubContent => ({
  seoUrl: data.seoUrl?.trim() || "tin-tuc",
  shortDescription: data.shortDescription ?? "",
  heroTitle: data.heroTitle ?? "",
  heroSubtitle: data.heroSubtitle ?? "",
  children: (data.children ?? [])
    .map(ensureListItem)
    .sort((a, b) => a.sortIndex - b.sortIndex),
});

const ensureDescriptions = (
  descriptions: NewsSectionDescription[] | undefined,
): NewsSectionDescription[] =>
  (descriptions ?? []).map((item, index) => ({
    id: item.id?.trim() || newId("desc"),
    text: item.text ?? "",
    type: item.type?.trim() || DEFAULT_DESCRIPTION_TYPE,
    img: item.img ?? "",
    headers: item.headers?.length ? item.headers : null,
  }));

const ensureSections = (sections: NewsDetailSection[] | undefined): NewsDetailSection[] =>
  (sections ?? []).map((section, index) => ({
    id: section.id?.trim() || newId("sec"),
    title: section.title ?? "",
    descriptions: ensureDescriptions(section.descriptions),
    sortIndex: section.sortIndex ?? index + 1,
    active: section.active ?? true,
  }));

export const migrateNewsDetail = (data: NewsDetailContent): NewsDetailContent => {
  const url = data.url?.trim() || slugify(data.shortDescription || data.id);

  return {
    id: data.id?.trim() || newId("news"),
    name: data.name?.trim() || "Tin tức",
    shortDescription: data.shortDescription ?? "",
    url,
    image: data.image ?? "",
    publishDate: data.publishDate ?? "",
    sections: ensureSections(data.sections).sort((a, b) => a.sortIndex - b.sortIndex),
  };
};
