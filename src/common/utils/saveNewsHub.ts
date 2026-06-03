import {
  createPage,
  getNewsById,
  getNewsContent,
  updatePage,
} from "@/api/config/common.config";
import type { NewsChildDto, NewsContentDto, NewsSectionDto } from "@/api/dtos/news.response";
import { normalizeNewsHubContent } from "@/common/contexts/newsNormalize";
import type { NewsHubContent, NewsListItem } from "@/common/types/news";
import { parseNumericId } from "@/common/utils/parseNumericId";
import {
  mapNewsChildCardToApi,
  mapNewsHubToApi,
  mapSavedChildToNewsListItem,
} from "@/common/utils/mapToNewsApi";

export type SaveNewsHubResult = {
  pageId: number;
  content: NewsHubContent;
};

export const saveNewsHubToApi = async (
  draft: NewsHubContent,
  pageId: number | null,
): Promise<SaveNewsHubResult> => {
  const normalized = normalizeNewsHubContent(draft);

  let existingHubSections: NewsSectionDto[] = [];
  if (pageId != null) {
    try {
      const current = await getNewsContent();
      existingHubSections = current.sections ?? [];
    } catch {
      existingHubSections = [];
    }
  }

  const hubPayload = mapNewsHubToApi(normalized, existingHubSections);
  const hub =
    pageId != null
      ? await updatePage<NewsContentDto>(pageId, hubPayload)
      : await createPage<NewsContentDto>(hubPayload);

  const updatedChildren: NewsListItem[] = [];

  for (const child of normalized.children) {
    const childId = parseNumericId(child.id);
    let existingSections: NewsSectionDto[] = [];
    if (childId > 0) {
      const existing = await getNewsById(childId);
      existingSections = existing.sections ?? [];
    }

    const hubPageId = hub.id;
    const childPayload = mapNewsChildCardToApi(child, hubPageId, existingSections);
    const saved =
      childId > 0
        ? await updatePage<NewsChildDto>(childId, childPayload)
        : await createPage<NewsChildDto>(childPayload);

    updatedChildren.push(mapSavedChildToNewsListItem(saved));
  }

  return {
    pageId: hub.id,
    content: { ...normalized, children: updatedChildren },
  };
};
