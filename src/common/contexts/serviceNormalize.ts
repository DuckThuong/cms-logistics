import { migrateServiceDetail, migrateServiceHub } from "@/common/contexts/serviceMigrate";
import type { ServiceDetailContent, ServiceHubContent } from "@/common/types/service";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";

export const normalizeServiceHubContent = (raw: ServiceHubContent): ServiceHubContent =>
  migrateServiceHub({
    ...raw,
    seoUrl: normalizeSeoUrl(raw.seoUrl),
  });

export const normalizeServiceDetailContent = (
  raw: ServiceDetailContent,
): ServiceDetailContent => migrateServiceDetail(raw);
