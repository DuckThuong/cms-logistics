import type { AboutPagePayloadDto } from "@/api/dtos/about.response";
import type { CompanyInformationContent } from "@/common/types/companyInformation";
import {
  attachQuickLinkSettings,
  parseQuickLinkSettings,
  syncOtherOptions,
} from "@/common/utils/companyInformationOtherOptions";
import { INTRO_API_SORT_INDEX } from "@/common/utils/companyInformationSection";

/** JSON title khớp FE `retractTitle` */
export const buildAboutSectionTitle = (text: string) =>
  JSON.stringify([{ icon: "", text, type: "text" }]);

/** Chuyển CMS → payload khớp `AboutPagePayloadDto` / `AboutResponseDto`. */
export const mapCompanyInformationToAboutApi = (
  content: CompanyInformationContent,
): AboutPagePayloadDto => {
  const introSection = {
    title: buildAboutSectionTitle(content.intro.title),
    description: [{ icon: "", text: content.intro.content, type: "text" }],
    images: content.intro.imageUrl?.trim() ? [content.intro.imageUrl.trim()] : [],
    sortIndex: INTRO_API_SORT_INDEX,
    active: true,
    kind: null as string | null,
    anchor: content.intro.anchor || null,
    body: null as string | null,
  };

  const settings = parseQuickLinkSettings(content.otherOptions);
  const showQuickLinks = content.showQuickLinks ?? settings.enabled;
  const hiddenQuickLinkIds = content.hiddenQuickLinkIds ?? settings.hiddenIds;
  const otherOptionsForApi = attachQuickLinkSettings(
    syncOtherOptions({
      intro: content.intro,
      sections: content.sections,
      otherOptions: content.otherOptions,
      showQuickLinks,
      hiddenQuickLinkIds,
    }),
    { enabled: showQuickLinks, hiddenIds: hiddenQuickLinkIds },
  );

  const bodySections = content.sections.map((section) => ({
    title: section.title ? buildAboutSectionTitle(section.title) : "",
    description: section.description ?? [],
    images: section.images ?? [],
    sortIndex: section.sortIndex,
    active: section.active,
    kind: section.kind ?? null,
    anchor: section.anchor ?? null,
    body: section.body ?? null,
  }));

  return {
    name: content.pageTitle,
    url: content.seoUrl,
    shortDescription: content.pageTag,
    content: content.pageSubtitle,
    otherOptions: otherOptionsForApi.map((opt) => ({
      icon: opt.icon ?? "",
      type: opt.type,
      value: opt.value ?? "",
    })),
    sections: [introSection, ...bodySections],
  };
};
