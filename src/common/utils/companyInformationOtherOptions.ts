import {
  ABOUT_OPTION_TYPES,
  type AboutIntro,
  type AboutOtherOption,
  type AboutSection,
  type CompanyInformationContent,
} from "@/common/types/companyInformation";
import { filterSectionsByKind } from "@/common/utils/companyInformationSection";

export const isHighlightOption = (opt: AboutOtherOption) =>
  opt.type === ABOUT_OPTION_TYPES.highlight;

export const isQuickLinkOption = (opt: AboutOtherOption) =>
  opt.type === ABOUT_OPTION_TYPES.quickLink;

export const getHighlightOptions = (options: AboutOtherOption[]) =>
  options.filter(isHighlightOption);

export const getQuickLinkOptions = (options: AboutOtherOption[]) =>
  options.filter(isQuickLinkOption);

type DeriveQuickLinksInput = {
  intro: AboutIntro;
  sections: AboutSection[];
};

/** Tự sinh quick-link từ intro + các section (trừ closing). */
export const deriveQuickLinkOptions = ({
  intro,
  sections,
}: DeriveQuickLinksInput): AboutOtherOption[] => {
  const links: AboutOtherOption[] = [];

  const introLabel = intro.title.trim();
  if (introLabel) {
    links.push({
      id: "intro",
      type: ABOUT_OPTION_TYPES.quickLink,
      value: introLabel,
      icon: "",
    });
  }

  const navSections = [
    ...filterSectionsByKind(sections, "policy"),
    ...filterSectionsByKind(sections, "content"),
  ];

  for (const section of navSections) {
    const label = section.title.trim();
    if (!label) {
      continue;
    }
    links.push({
      id: section.id,
      type: ABOUT_OPTION_TYPES.quickLink,
      value: label,
      icon: "",
    });
  }

  return links;
};

/** Gắn icon đã lưu vào quick-link tự sinh; giữ nguyên highlights. */
export const mergeOtherOptions = (
  highlights: AboutOtherOption[],
  derivedQuickLinks: AboutOtherOption[],
  saved: AboutOtherOption[],
): AboutOtherOption[] => {
  const iconById = new Map(
    [...saved, ...derivedQuickLinks].filter(isQuickLinkOption).map((link) => [link.id, link.icon ?? ""]),
  );

  const mergedQuickLinks = derivedQuickLinks.map((link) => ({
    ...link,
    icon: iconById.get(link.id) ?? "",
  }));

  return [...highlights, ...mergedQuickLinks];
};

export const syncOtherOptions = (
  content: Pick<CompanyInformationContent, "intro" | "sections" | "otherOptions">,
): AboutOtherOption[] => {
  const highlights = getHighlightOptions(content.otherOptions);
  const derived = deriveQuickLinkOptions(content);
  return mergeOtherOptions(highlights, derived, content.otherOptions);
};

export const replaceHighlightOptions = (
  options: AboutOtherOption[],
  highlights: AboutOtherOption[],
): AboutOtherOption[] => {
  const quickLinks = getQuickLinkOptions(options);
  return [...highlights, ...quickLinks];
};

export const updateQuickLinkIcon = (
  options: AboutOtherOption[],
  linkId: string,
  icon: string,
): AboutOtherOption[] =>
  options.map((opt) =>
    isQuickLinkOption(opt) && opt.id === linkId ? { ...opt, icon } : opt,
  );
