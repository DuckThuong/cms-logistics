import {
  ABOUT_OPTION_TYPES,
  QUICK_LINK_SETTINGS_OPTION_ID,
  type AboutIntro,
  type AboutOtherOption,
  type AboutSection,
  type CompanyInformationContent,
  type QuickLinkSettingsPayload,
} from "@/common/types/companyInformation";
import { filterSectionsByKind } from "@/common/utils/companyInformationSection";

export const isHighlightOption = (opt: AboutOtherOption) =>
  opt.type === ABOUT_OPTION_TYPES.highlight;

export const isQuickLinkOption = (opt: AboutOtherOption) =>
  opt.type === ABOUT_OPTION_TYPES.quickLink;

export const isQuickLinkSettingsOption = (opt: AboutOtherOption) =>
  opt.type === ABOUT_OPTION_TYPES.quickLinkSettings;

export const getHighlightOptions = (options: AboutOtherOption[]) =>
  options.filter(isHighlightOption);

export const getQuickLinkOptions = (options: AboutOtherOption[]) =>
  options.filter(isQuickLinkOption);

export const stripQuickLinkSettingsOptions = (options: AboutOtherOption[]) =>
  options.filter((opt) => !isQuickLinkSettingsOption(opt));

export const parseQuickLinkSettings = (
  options: AboutOtherOption[],
): QuickLinkSettingsPayload => {
  const meta = options.find(
    (opt) =>
      isQuickLinkSettingsOption(opt) || opt.id === QUICK_LINK_SETTINGS_OPTION_ID,
  );
  if (!meta?.value?.trim()) {
    return { enabled: true, hiddenIds: [] };
  }
  try {
    const parsed = JSON.parse(meta.value) as QuickLinkSettingsPayload;
    return {
      enabled: parsed.enabled !== false,
      hiddenIds: Array.isArray(parsed.hiddenIds) ? parsed.hiddenIds : [],
    };
  } catch {
    return { enabled: true, hiddenIds: [] };
  }
};

export const buildQuickLinkSettingsOption = (
  settings: QuickLinkSettingsPayload,
): AboutOtherOption => ({
  id: QUICK_LINK_SETTINGS_OPTION_ID,
  type: ABOUT_OPTION_TYPES.quickLinkSettings,
  value: JSON.stringify(settings),
  icon: "",
});

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

const buildQuickLinkIconById = (
  derivedQuickLinks: AboutOtherOption[],
  saved: AboutOtherOption[],
): Map<string, string> => {
  const iconById = new Map<string, string>();
  for (const link of derivedQuickLinks) {
    iconById.set(link.id, "");
  }
  for (const link of saved.filter(isQuickLinkOption)) {
    iconById.set(link.id, link.icon ?? "");
  }
  return iconById;
};

/** Gắn icon đã lưu vào quick-link tự sinh; giữ nguyên highlights. */
export const mergeOtherOptions = (
  highlights: AboutOtherOption[],
  derivedQuickLinks: AboutOtherOption[],
  saved: AboutOtherOption[],
): AboutOtherOption[] => {
  const iconById = buildQuickLinkIconById(derivedQuickLinks, saved);

  const mergedQuickLinks = derivedQuickLinks.map((link) => ({
    ...link,
    icon: iconById.get(link.id) ?? "",
  }));

  return [...highlights, ...mergedQuickLinks];
};

type SyncOtherOptionsInput = Pick<
  CompanyInformationContent,
  "intro" | "sections" | "otherOptions" | "showQuickLinks" | "hiddenQuickLinkIds"
>;

export const syncOtherOptions = (content: SyncOtherOptionsInput): AboutOtherOption[] => {
  const saved = stripQuickLinkSettingsOptions(content.otherOptions);
  const highlights = getHighlightOptions(saved);
  const showQuickLinks = content.showQuickLinks !== false;

  if (!showQuickLinks) {
    return highlights;
  }

  const hidden = new Set(content.hiddenQuickLinkIds ?? []);
  const derived = deriveQuickLinkOptions(content).filter((link) => !hidden.has(link.id));
  return mergeOtherOptions(highlights, derived, saved);
};

/** Gắn meta quick-link vào cuối otherOptions khi gửi API. */
export const attachQuickLinkSettings = (
  options: AboutOtherOption[],
  settings: QuickLinkSettingsPayload,
): AboutOtherOption[] => [
  ...stripQuickLinkSettingsOptions(options),
  buildQuickLinkSettingsOption(settings),
];

export const replaceHighlightOptions = (
  options: AboutOtherOption[],
  highlights: AboutOtherOption[],
): AboutOtherOption[] => {
  const quickLinks = getQuickLinkOptions(stripQuickLinkSettingsOptions(options));
  const settings = options.filter(isQuickLinkSettingsOption);
  return [...highlights, ...quickLinks, ...settings];
};

export const updateQuickLinkIcon = (
  options: AboutOtherOption[],
  linkId: string,
  icon: string,
): AboutOtherOption[] =>
  options.map((opt) =>
    isQuickLinkOption(opt) && opt.id === linkId ? { ...opt, icon } : opt,
  );

/** Cập nhật icon quick-link trong otherOptions thô (không ghi đè cả mảng đã sync). */
export const patchQuickLinkIcon = (
  otherOptions: AboutOtherOption[],
  linkId: string,
  icon: string,
): AboutOtherOption[] => {
  const existingIndex = otherOptions.findIndex(
    (opt) => isQuickLinkOption(opt) && opt.id === linkId,
  );
  if (existingIndex >= 0) {
    return otherOptions.map((opt, index) =>
      index === existingIndex ? { ...opt, icon } : opt,
    );
  }

  const highlights = getHighlightOptions(otherOptions);
  const quickLinks = getQuickLinkOptions(otherOptions);
  return [
    ...highlights,
    ...quickLinks,
    {
      id: linkId,
      type: ABOUT_OPTION_TYPES.quickLink,
      value: "",
      icon,
    },
  ];
};
