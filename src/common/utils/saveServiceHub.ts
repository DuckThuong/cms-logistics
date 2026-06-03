import {
  createPage,
  getServiceById,
  getServiceContent,
  updatePage,
} from "@/api/config/common.config";
import type {
  ServiceChildDto,
  ServiceDetailSectionDto,
  ServiceResponseDto,
} from "@/api/dtos/service.response";
import { normalizeServiceHubContent } from "@/common/contexts/serviceNormalize";
import type { ServiceHubContent, ServiceListItem } from "@/common/types/service";
import { parseNumericId } from "@/common/utils/parseNumericId";
import {
  mapServiceChildCardToApi,
  mapServiceHubToApi,
  mapSavedChildToListItem,
} from "@/common/utils/mapToServiceApi";

export type SaveServiceHubResult = {
  pageId: number;
  content: ServiceHubContent;
};

/** Lưu hub + từng thẻ children (giữ sections chi tiết khi chỉ sửa metadata hub). */
export const saveServiceHubToApi = async (
  draft: ServiceHubContent,
  pageId: number | null,
): Promise<SaveServiceHubResult> => {
  const normalized = normalizeServiceHubContent(draft);

  let existingHubSections: ServiceDetailSectionDto[] = [];
  if (pageId != null) {
    try {
      const current = await getServiceContent();
      existingHubSections = current.sections ?? [];
    } catch {
      existingHubSections = [];
    }
  }

  const hubPayload = mapServiceHubToApi(normalized, existingHubSections);
  const hub =
    pageId != null
      ? await updatePage<ServiceResponseDto>(pageId, hubPayload)
      : await createPage<ServiceResponseDto>(hubPayload);

  const updatedChildren: ServiceListItem[] = [];

  for (const child of normalized.children) {
    const childId = parseNumericId(child.id);
    let existingSections: ServiceDetailSectionDto[] = [];
    if (childId > 0) {
      const existing = await getServiceById(childId);
      existingSections = existing.sections ?? [];
    }

    const hubPageId = hub.id;
    const childPayload = mapServiceChildCardToApi(child, hubPageId, existingSections);
    const saved =
      childId > 0
        ? await updatePage<ServiceChildDto>(childId, childPayload)
        : await createPage<ServiceChildDto>(childPayload);

    updatedChildren.push(mapSavedChildToListItem(saved));
  }

  return {
    pageId: hub.id,
    content: { ...normalized, children: updatedChildren },
  };
};
