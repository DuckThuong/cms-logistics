import type {
  ServiceChildDto,
  ServiceDetailSectionDto,
  ServiceFeaturedDto,
  ServiceOptionsDto,
  ServicePageWritePayloadDto,
  ServiceSectionDescriptionDto,
} from "@/api/dtos/service.response";
import { SERVICE_OPTION_TYPES } from "@/common/constants/serviceOptions";
import type {
  ServiceDetailContent,
  ServiceDetailSection,
  ServiceHubContent,
  ServiceListItem,
} from "@/common/types/service";
import { mapChildDtoToListItem } from "@/common/utils/mapFromServiceResponse";
import { DEFAULT_DESCRIPTION_TYPE } from "@/common/utils/companyInformationSection";
import { buildSectionTitle } from "@/common/utils/sectionTitle";
import type { ServiceSectionDescription } from "@/common/types/service";

const mapDescriptionToApi = (
  desc: ServiceSectionDescription,
): ServiceSectionDescriptionDto => ({
  type: desc.type?.trim() || DEFAULT_DESCRIPTION_TYPE,
  icon: "",
  text: desc.text ?? "",
  boldParts: [],
  headers: desc.headers?.length ? desc.headers : null,
  cellRows: null,
});

const mapSectionToApi = (section: ServiceDetailSection): Omit<ServiceDetailSectionDto, "id" | "pageId" | "pageTitle" | "createdAt" | "updatedAt"> => ({
  title: section.title ? buildSectionTitle(section.title) : "",
  description: (section.descriptions ?? []).map(mapDescriptionToApi),
  images: [],
  sortIndex: section.sortIndex,
  active: section.active ?? true,
});

const buildAppBannerOptions = (hub: ServiceHubContent): ServiceOptionsDto[] => {
  const url = hub.appBannerUrl?.trim();
  const label = hub.appBannerLabel?.trim();
  if (!url && !label) {
    return [];
  }
  return [
    {
      icon: label,
      type: SERVICE_OPTION_TYPES.appBanner,
      value: JSON.stringify({ url: url ?? "", label: label ?? "" }),
    },
  ];
};

/** Hub /dich-vu — giữ sections hub từ API nếu có. */
export const mapServiceHubToApi = (
  hub: ServiceHubContent,
  existingHubSections: ServiceDetailSectionDto[] = [],
): ServicePageWritePayloadDto => ({
  name: hub.name,
  url: hub.seoUrl,
  shortDescription: hub.shortDescription,
  content: hub.content,
  otherOptions: buildAppBannerOptions(hub),
  sections: existingHubSections,
  type: "SERVICE",
  active: true,
});

/** Thẻ dịch vụ (children) — giữ sections hiện có khi chỉ cập nhật metadata hub. */
export const mapServiceChildCardToApi = (
  child: ServiceListItem,
  parentId: number,
  existingSections: ServiceDetailSectionDto[] = [],
): ServicePageWritePayloadDto => ({
  name: child.name,
  url: child.url,
  shortDescription: child.shortDescription,
  content: child.shortDescription || child.name,
  image: child.image?.trim() || null,
  sortIndex: child.sortIndex,
  active: child.active ?? true,
  type: "SERVICE",
  parentId,
  otherOptions: [],
  sections: existingSections,
});

/** Trang chi tiết dịch vụ — gửi đầy đủ sections. */
export const mapServiceDetailToApi = (
  detail: ServiceDetailContent,
  options: { parentId?: number | null; listItem?: ServiceListItem },
): ServicePageWritePayloadDto => {
  const { listItem, parentId = null } = options;

  return {
    name: detail.name,
    url: detail.url,
    shortDescription: listItem?.shortDescription ?? detail.name,
    content: detail.name,
    image: detail.image?.trim() || null,
    sortIndex: listItem?.sortIndex ?? 1,
    active: listItem?.active ?? true,
    type: "SERVICE",
    parentId,
    otherOptions: [],
    sections: (detail.sections ?? []).map(mapSectionToApi),
  };
};

export const mapSavedChildToListItem = (
  saved: ServiceChildDto | ServiceFeaturedDto,
): ServiceListItem => mapChildDtoToListItem(saved as ServiceFeaturedDto);
