import type {
  NewsChildDto,
  NewsContentDto,
  NewsOtherOptionDto,
  NewsSectionDto,
} from "@/api/dtos/news.response";
import type {
  NewsDetailContent,
  NewsDetailSection,
  NewsHubContent,
  NewsListItem,
} from "@/common/types/news";
import { NEWS_OPTION_TYPES } from "@/common/constants/newsOptions";
import { DEFAULT_DESCRIPTION_TYPE } from "@/common/utils/companyInformationSection";
import { parseSectionTitle } from "@/common/utils/sectionTitle";

const parseOptionText = (options: NewsOtherOptionDto[] | undefined, type: string) =>
  options?.find((o) => o.type === type)?.value?.trim() ?? "";

const parseCardDate = (options: NewsOtherOptionDto[] | undefined) =>
  parseOptionText(options, NEWS_OPTION_TYPES.cardDate) ||
  options?.find((o) => o.type === "text")?.value?.trim() ||
  "";

const parseArticleDate = (options: NewsOtherOptionDto[] | undefined) => {
  const raw =
    parseOptionText(options, NEWS_OPTION_TYPES.articleDate) ||
    parseOptionText(options, NEWS_OPTION_TYPES.cardDate) ||
    options?.find((o) => o.type === "text")?.value?.trim() ||
    "";
  return parseSectionTitle(raw) || raw;
};

export const mapChildDtoToNewsListItem = (child: NewsChildDto): NewsListItem => ({
  id: String(child.id),
  name: child.name ?? "",
  shortDescription: child.shortDescription ?? "",
  image: child.image ?? "",
  url: child.url ?? "",
  sortIndex: child.sortIndex ?? 1,
  active: child.active ?? true,
  publishDate: parseCardDate(child.otherOptions),
});

export const mapResponseToNewsHub = (response: NewsContentDto): NewsHubContent => ({
  seoUrl: response.url ?? "tin-tuc",
  shortDescription: response.shortDescription ?? "",
  heroTitle: response.description?.[0] ?? response.name ?? "",
  heroSubtitle: parseSectionTitle(
    parseOptionText(response.otherOptions, NEWS_OPTION_TYPES.heroSubtitle),
  ),
  children: (response.children ?? [])
    .map(mapChildDtoToNewsListItem)
    .sort((a, b) => a.sortIndex - b.sortIndex),
});

const mapSections = (sections: NewsSectionDto[] | undefined): NewsDetailSection[] =>
  (sections ?? []).map((section, index) => ({
    id: section.id ? String(section.id) : `sec-${index + 1}`,
    title: parseSectionTitle(section.title),
    sortIndex: section.sortIndex ?? index + 1,
    active: section.active ?? true,
    descriptions: (section.description ?? []).map((desc, descIndex) => ({
      id: `desc-${section.id ?? index}-${descIndex}`,
      text: desc.text ?? "",
      type: desc.type ?? DEFAULT_DESCRIPTION_TYPE,
      img: desc.img ?? "",
      headers: desc.headers?.length ? desc.headers : null,
    })),
  }));

export const mapResponseToNewsDetail = (response: NewsChildDto): NewsDetailContent => ({
  id: String(response.id),
  name: response.name ?? "Tin tức",
  shortDescription: response.shortDescription ?? "",
  url: response.url ?? "",
  image: response.image ?? "",
  publishDate: parseArticleDate(response.otherOptions),
  sections: mapSections(response.sections).sort((a, b) => a.sortIndex - b.sortIndex),
});
