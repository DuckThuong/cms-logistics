import { migrateServiceDetail } from "@/common/contexts/serviceMigrate";
import type { NewsDetailContent, NewsHubContent, NewsListItem } from "@/common/types/news";
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

export const migrateNewsDetail = (data: NewsDetailContent): NewsDetailContent => {
  const migrated = migrateServiceDetail({
    id: data.id,
    name: data.name,
    url: data.url,
    image: data.image,
    sections: data.sections,
  });

  return {
    id: migrated.id,
    name: data.name?.trim() || "Tin tức",
    shortDescription: data.shortDescription ?? migrated.name,
    url: migrated.url,
    image: migrated.image,
    publishDate: data.publishDate ?? "",
    sections: migrated.sections,
  };
};
