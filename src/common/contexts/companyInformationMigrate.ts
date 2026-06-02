import { COMPANY_INFORMATION_DEFAULTS } from "@/common/constants/companyInformation";
import { normalizeCompanyInformationContent } from "@/common/contexts/companyInformationNormalize";
import {
  ABOUT_OPTION_TYPES,
  type AboutIntro,
  type AboutOtherOption,
  type AboutSection,
  type CompanyInformationContent,
} from "@/common/types/companyInformation";
import { toAnchorId } from "@/common/utils/anchor";
import { deriveQuickLinkOptions, mergeOtherOptions } from "@/common/utils/companyInformationOtherOptions";
import {
  filterSectionsByKind,
  linesToDescription,
  reindexSections,
} from "@/common/utils/companyInformationSection";

const stripAnchorHash = (value: string) => value.trim().replace(/^#/, "");

type LegacyHighlight = { id: string; label: string; icon?: string };
type LegacyQuickLink = { id: string; label?: string; anchor: string; icon?: string };
type LegacyPolicySection = {
  id: string;
  title: string;
  anchor?: string;
  content: string[];
  icon?: string;
};
type LegacyContentSection = {
  id: string;
  anchor: string;
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  icon?: string;
};

type LegacyContent = Partial<CompanyInformationContent> & {
  introTitle?: string;
  introAnchor?: string;
  introContent?: string;
  introImageUrl?: string;
  introIcon?: string;
  highlights?: LegacyHighlight[];
  quickLinks?: LegacyQuickLink[];
  policySections?: LegacyPolicySection[];
  sections?: LegacyContentSection[];
  closingLineOne?: string;
  closingLineTwo?: string;
  servicesTitle?: string;
  services?: string[];
  refusalsTitle?: string;
  refusals?: string[];
};

const isNewFormat = (raw: LegacyContent): raw is CompanyInformationContent =>
  Boolean(raw.intro && Array.isArray(raw.otherOptions) && !("highlights" in raw));

const normalizeIntroAnchor = (anchor: string | undefined, title: string | undefined): string => {
  const fromInput = toAnchorId(stripAnchorHash(anchor ?? ""));
  const fallback = toAnchorId(title ?? "") || "gioi-thieu";
  return fromInput || fallback;
};

const legacyHighlightsToOptions = (highlights: LegacyHighlight[]): AboutOtherOption[] =>
  highlights.map((item) => ({
    id: item.id,
    type: ABOUT_OPTION_TYPES.highlight,
    value: item.label ?? "",
    icon: item.icon ?? "",
  }));

const legacyPolicyToSection = (section: LegacyPolicySection, sortIndex: number): AboutSection => ({
  id: section.id,
  sortIndex,
  kind: "policy",
  active: true,
  title: section.title ?? "",
  anchor: normalizeIntroAnchor(section.anchor, section.title),
  description: linesToDescription(section.content?.length ? section.content : [""]),
  images: [],
});

const legacyContentToSection = (section: LegacyContentSection, sortIndex: number): AboutSection => ({
  id: section.id,
  sortIndex,
  kind: "content",
  active: true,
  title: section.title ?? "",
  anchor: normalizeIntroAnchor(section.anchor, section.title),
  description: section.description?.trim()
    ? linesToDescription([section.description])
    : [],
  body: section.content?.trim() ?? "",
  images: section.imageUrl?.trim() ? [section.imageUrl.trim()] : [],
});

const migrateLegacyIconsToQuickLinks = (
  raw: LegacyContent,
  derived: AboutOtherOption[],
): AboutOtherOption[] => {
  const iconById = new Map(
    (raw.quickLinks ?? []).map((link) => [link.id, link.icon ?? ""]),
  );

  if (raw.introIcon?.trim()) {
    iconById.set("intro", raw.introIcon.trim());
  }

  for (const section of raw.policySections ?? []) {
    if (section.icon?.trim()) {
      iconById.set(section.id, section.icon.trim());
    }
  }

  for (const section of raw.sections ?? []) {
    if (section.icon?.trim()) {
      iconById.set(section.id, section.icon.trim());
    }
  }

  return derived.map((link) => ({
    ...link,
    icon: iconById.get(link.id) ?? link.icon ?? "",
  }));
};

const buildFromLegacy = (raw: LegacyContent): CompanyInformationContent => {
  const intro: AboutIntro = {
    title: raw.introTitle ?? raw.intro?.title ?? COMPANY_INFORMATION_DEFAULTS.intro.title,
    anchor: normalizeIntroAnchor(
      raw.introAnchor ?? raw.intro?.anchor,
      raw.introTitle ?? raw.intro?.title,
    ),
    content: raw.introContent ?? raw.intro?.content ?? "",
    imageUrl: raw.introImageUrl ?? raw.intro?.imageUrl ?? "",
  };

  const policySections: AboutSection[] = [];

  if (Array.isArray(raw.policySections)) {
    raw.policySections.forEach((section, index) => {
      policySections.push(legacyPolicyToSection(section, index + 2));
    });
  } else {
    if (raw.servicesTitle || raw.services?.length) {
      policySections.push(
        legacyPolicyToSection(
          {
            id: "policy-services",
            title: raw.servicesTitle ?? "",
            anchor: "dich-vu",
            content: raw.services?.length ? raw.services : [""],
          },
          2,
        ),
      );
    }
    if (raw.refusalsTitle || raw.refusals?.length) {
      policySections.push(
        legacyPolicyToSection(
          {
            id: "policy-refusals",
            title: raw.refusalsTitle ?? "",
            anchor: "tu-choi",
            content: raw.refusals?.length ? raw.refusals : [""],
          },
          policySections.length + 2,
        ),
      );
    }
  }

  const contentSections = (raw.sections ?? [])
    .filter((section) => !("kind" in section))
    .map((section, index) =>
      legacyContentToSection(section as LegacyContentSection, policySections.length + 2 + index),
    );

  const closingLines: [string, string] = [
    raw.closingLineOne ?? "",
    raw.closingLineTwo ?? "",
  ];
  const closingSection: AboutSection[] =
    closingLines[0].trim() || closingLines[1].trim()
      ? [
          {
            id: "closing",
            sortIndex: 999,
            kind: "closing",
            active: true,
            title: "",
            anchor: "",
            description: linesToDescription(closingLines),
            images: [],
          },
        ]
      : filterSectionsByKind(COMPANY_INFORMATION_DEFAULTS.sections, "closing");

  const sections = reindexSections([
    ...policySections,
    ...contentSections,
    ...closingSection,
  ]);

  const highlights = legacyHighlightsToOptions(
    raw.highlights ?? COMPANY_INFORMATION_DEFAULTS.otherOptions.filter(
      (opt) => opt.type === ABOUT_OPTION_TYPES.highlight,
    ),
  );

  const derivedQuickLinks = migrateLegacyIconsToQuickLinks(
    raw,
    deriveQuickLinkOptions({ intro, sections }),
  );

  const otherOptions = mergeOtherOptions(
    highlights,
    derivedQuickLinks,
    raw.quickLinks?.map((link) => ({
      id: link.id,
      type: ABOUT_OPTION_TYPES.quickLink,
      value: link.label?.trim() || stripAnchorHash(link.anchor),
      icon: link.icon ?? "",
    })) ?? [],
  );

  return {
    ...COMPANY_INFORMATION_DEFAULTS,
    ...raw,
    intro,
    sections,
    otherOptions,
  };
};

export const migrateCompanyInformationContent = (
  raw: LegacyContent,
): CompanyInformationContent => {
  if (isNewFormat(raw)) {
    return normalizeCompanyInformationContent(raw);
  }
  return normalizeCompanyInformationContent(buildFromLegacy(raw));
};
