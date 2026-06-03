import type {
  ServiceChildDto,
  ServiceFeaturedDto,
  ServiceOptionsDto,
  ServiceResponseDto,
} from "@/api/dtos/service.response";
import { SERVICE_OPTION_TYPES } from "@/common/constants/serviceOptions";
import type {
  ServiceDetailContent,
  ServiceDetailSection,
  ServiceHubContent,
  ServiceListItem,
} from "@/common/types/service";
import { parseSectionTitle } from "@/common/utils/sectionTitle";

const parseAppBanner = (options: ServiceOptionsDto[] | undefined) => {
  const opt = options?.find((o) => o.type === SERVICE_OPTION_TYPES.appBanner);
  if (!opt?.value) {
    return { appBannerUrl: "", appBannerLabel: "" };
  }
  try {
    const parsed = JSON.parse(opt.value) as { url?: string; label?: string };
    return {
      appBannerUrl: parsed.url ?? "",
      appBannerLabel: parsed.label ?? "",
    };
  } catch {
    return { appBannerUrl: opt.value, appBannerLabel: opt.icon ?? "" };
  }
};

export const mapChildDtoToListItem = (child: ServiceFeaturedDto): ServiceListItem => ({
  id: String(child.id),
  name: child.name ?? "",
  shortDescription: child.shortDescription ?? "",
  image: child.image ?? "",
  url: child.url ?? "",
  sortIndex: child.sortIndex ?? 1,
  active: child.active ?? true,
});

export const mapResponseToServiceHub = (response: ServiceResponseDto): ServiceHubContent => {
  const { appBannerUrl, appBannerLabel } = parseAppBanner(response.otherOptions);

  return {
    seoUrl: response.url ?? "dich-vu",
    name: response.name ?? "",
    shortDescription: response.shortDescription ?? "",
    content: response.content ?? "",
    appBannerUrl,
    appBannerLabel,
    children: (response.children ?? [])
      .map(mapChildDtoToListItem)
      .sort((a, b) => a.sortIndex - b.sortIndex),
  };
};

export const mapResponseToServiceDetail = (
  response: ServiceChildDto,
): ServiceDetailContent => {
  const sections: ServiceDetailSection[] = (response.sections ?? []).map((section, index) => ({
    id: section.id ? String(section.id) : `sec-${index + 1}`,
    title: parseSectionTitle(section.title),
    sortIndex: section.sortIndex ?? index + 1,
    active: section.active ?? true,
    descriptions: (section.description ?? []).map((desc, descIndex) => ({
      id: `desc-${section.id ?? index}-${descIndex}`,
      text: desc.text ?? "",
    })),
  }));

  return {
    id: String(response.id),
    name: response.name ?? "",
    url: response.url ?? "",
    image: response.image ?? "",
    sections: sections.sort((a, b) => a.sortIndex - b.sortIndex),
  };
};
