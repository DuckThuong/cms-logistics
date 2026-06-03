import type {
  NewsChildDto,
  NewsPageWritePayloadDto,
  NewsSectionDto,
  NewsSectionDescriptionDto,
} from "@/api/dtos/news.response";
import { NEWS_OPTION_TYPES } from "@/common/constants/newsOptions";
import type {
  NewsDetailContent,
  NewsDetailSection,
  NewsHubContent,
  NewsListItem,
} from "@/common/types/news";
import { mapChildDtoToNewsListItem } from "@/common/utils/mapFromNewsResponse";
import { DEFAULT_DESCRIPTION_TYPE } from "@/common/utils/companyInformationSection";
import { buildSectionTitle } from "@/common/utils/sectionTitle";
import { isNewsTextImgType } from "@/common/constants/newsDescriptionTypes";
import type { NewsSectionDescription } from "@/common/types/news";

const mapDescriptionToApi = (
  desc: NewsSectionDescription,
): NewsSectionDescriptionDto => {
  const type = desc.type?.trim() || DEFAULT_DESCRIPTION_TYPE;
  const img = isNewsTextImgType(type) ? desc.img?.trim() || null : null;

  return {
    type,
    icon: "",
    img,
    text: desc.text ?? "",
    boldParts: [],
    headers: desc.headers?.length ? desc.headers : null,
    cellRows: [],
  };
};

const mapSectionToApi = (
  section: NewsDetailSection,
): Omit<NewsSectionDto, "id" | "pageId" | "pageTitle" | "createdAt" | "updatedAt"> => ({
  title: section.title ? buildSectionTitle(section.title) : "",
  description: (section.descriptions ?? []).map(mapDescriptionToApi),
  images: [],
  sortIndex: section.sortIndex,
  active: section.active ?? true,
});

const buildHeroSubtitleOptions = (subtitle: string) => {
  const value = subtitle.trim();
  if (!value) {
    return [];
  }
  return [
    {
      icon: "",
      image: "",
      type: NEWS_OPTION_TYPES.heroSubtitle,
      value: buildSectionTitle(value),
    },
  ];
};

const buildCardDateOptions = (date: string) => {
  const value = date.trim();
  if (!value) {
    return [];
  }
  return [
    {
      icon: "",
      image: "",
      type: NEWS_OPTION_TYPES.cardDate,
      value,
    },
  ];
};

const buildArticleDateOptions = (date: string) => {
  const value = date.trim();
  if (!value) {
    return [];
  }
  return [
    {
      icon: "",
      image: "",
      type: NEWS_OPTION_TYPES.articleDate,
      value,
    },
  ];
};

export const mapNewsHubToApi = (
  hub: NewsHubContent,
  existingHubSections: NewsSectionDto[] = [],
): NewsPageWritePayloadDto => ({
  name: hub.heroTitle.trim() || "Tin tức",
  url: hub.seoUrl,
  shortDescription: hub.shortDescription,
  description: hub.heroTitle.trim() ? [hub.heroTitle.trim()] : [],
  content: hub.heroSubtitle,
  otherOptions: buildHeroSubtitleOptions(hub.heroSubtitle),
  sections: existingHubSections,
  type: "NEWS",
  active: true,
});

export const mapNewsChildCardToApi = (
  child: NewsListItem,
  parentId: number,
  existingSections: NewsSectionDto[] = [],
): NewsPageWritePayloadDto => ({
  name: child.name,
  url: child.url,
  shortDescription: child.shortDescription,
  content: child.shortDescription || child.name,
  image: child.image?.trim() || null,
  sortIndex: child.sortIndex,
  active: child.active ?? true,
  type: "NEWS",
  parentId,
  otherOptions: buildCardDateOptions(child.publishDate),
  sections: existingSections,
});

export const mapNewsDetailToApi = (
  detail: NewsDetailContent,
  options: { parentId?: number | null; listItem?: NewsListItem },
): NewsPageWritePayloadDto => {
  const { listItem, parentId = null } = options;

  return {
    name: detail.name,
    url: detail.url,
    shortDescription: detail.shortDescription,
    content: detail.shortDescription || detail.name,
    image: detail.image?.trim() || null,
    sortIndex: listItem?.sortIndex ?? 1,
    active: listItem?.active ?? true,
    type: "NEWS",
    parentId,
    otherOptions: buildArticleDateOptions(detail.publishDate),
    sections: (detail.sections ?? []).map(mapSectionToApi),
  };
};

export const mapSavedChildToNewsListItem = (saved: NewsChildDto): NewsListItem =>
  mapChildDtoToNewsListItem(saved);
