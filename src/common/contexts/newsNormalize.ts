import { migrateNewsDetail, migrateNewsHub } from "@/common/contexts/newsMigrate";
import type { NewsDetailContent, NewsHubContent } from "@/common/types/news";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";

export const normalizeNewsHubContent = (raw: NewsHubContent): NewsHubContent =>
  migrateNewsHub({
    ...raw,
    seoUrl: normalizeSeoUrl(raw.seoUrl),
  });

export const normalizeNewsDetailContent = (raw: NewsDetailContent): NewsDetailContent =>
  migrateNewsDetail(raw);
