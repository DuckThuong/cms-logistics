import { toAnchorId } from "@/common/utils/anchor";
import { COMPANY_INFORMATION_DEFAULTS } from "./constants";
import { deriveQuickLinks } from "./deriveQuickLinks";
import type {
  CompanyInformationContent,
  ContentSectionItem,
  QuickLinkItem,
  TitledContentSection,
} from "./types";

const stripAnchorHash = (value: string) => value.trim().replace(/^#/, "");

const normalizePolicySection = (
  section: TitledContentSection & { icon?: string },
): TitledContentSection => {
  const { icon: _icon, ...rest } = section;
  void _icon;
  const fromInput = toAnchorId(stripAnchorHash(rest.anchor ?? ""));
  const fallback = toAnchorId(rest.id) || rest.id;
  return {
    ...rest,
    anchor: fromInput || fallback,
    content: rest.content?.length ? [...rest.content] : [""],
  };
};

const normalizeIntroAnchor = (
  introAnchor: string | undefined,
  introTitle: string | undefined,
): string => {
  const fromInput = toAnchorId(stripAnchorHash(introAnchor ?? ""));
  const fallback = toAnchorId(introTitle ?? "") || "gioi-thieu";
  return fromInput || fallback;
};

type LegacyContent = Partial<
  Omit<CompanyInformationContent, "policySections" | "sections">
> & {
  introIcon?: string;
  servicesTitle?: string;
  services?: string[];
  refusalsTitle?: string;
  refusals?: string[];
  policySections?: Array<TitledContentSection & { icon?: string }>;
  sections?: Array<ContentSectionItem & { icon?: string }>;
};

/** Chuyển icon cũ (intro/section) sang quickLinks nếu chưa có */
const migrateLegacyQuickLinkIcons = (
  raw: LegacyContent,
  derived: QuickLinkItem[],
): QuickLinkItem[] => {
  const iconById = new Map((raw.quickLinks ?? []).map((link) => [link.id, link.icon ?? ""]));

  if (raw.introIcon?.trim() && !iconById.get("intro")) {
    iconById.set("intro", raw.introIcon.trim());
  }

  for (const section of raw.policySections ?? []) {
    if (section.icon?.trim() && !iconById.get(section.id)) {
      iconById.set(section.id, section.icon.trim());
    }
  }

  for (const section of raw.sections ?? []) {
    const sectionId = section.id;
    if (section.icon?.trim() && !iconById.get(sectionId)) {
      iconById.set(sectionId, section.icon.trim());
    }
  }

  return derived.map((link) => ({
    ...link,
    icon: iconById.get(link.id) ?? "",
  }));
};

const ensureHighlightIcons = (data: CompanyInformationContent): CompanyInformationContent => ({
  ...data,
  highlights: (data.highlights ?? []).map((item) => ({
    ...item,
    icon: item.icon ?? "",
  })),
});

const newPolicyId = () => `policy-${Math.random().toString(36).slice(2, 10)}`;

export const migrateCompanyInformationContent = (
  raw: LegacyContent,
): CompanyInformationContent => {
  const withQuickLinks = (data: CompanyInformationContent): CompanyInformationContent => {
    const normalized = ensureHighlightIcons(data);
    const derived = deriveQuickLinks(normalized);
    const quickLinks = migrateLegacyQuickLinkIcons(raw, derived);
    return {
      ...normalized,
      quickLinks,
    };
  };

  if (Array.isArray(raw.policySections)) {
    const { introIcon: _legacyIntroIcon, ...restRaw } = raw;
    void _legacyIntroIcon;
    return withQuickLinks({
      ...COMPANY_INFORMATION_DEFAULTS,
      ...restRaw,
      introAnchor: normalizeIntroAnchor(raw.introAnchor, raw.introTitle),
      policySections: raw.policySections.map(normalizePolicySection),
    });
  }

  const policySections: TitledContentSection[] = [];

  if (raw.servicesTitle || raw.services?.length) {
    policySections.push(
      normalizePolicySection({
        id: "policy-services",
        title: raw.servicesTitle ?? "",
        anchor: "dich-vu",
        content: raw.services?.length ? [...raw.services] : [""],
      }),
    );
  }

  if (raw.refusalsTitle || raw.refusals?.length) {
    policySections.push(
      normalizePolicySection({
        id: "policy-refusals",
        title: raw.refusalsTitle ?? "",
        anchor: "tu-choi",
        content: raw.refusals?.length ? [...raw.refusals] : [""],
      }),
    );
  }

  const {
    servicesTitle: _legacyServicesTitle,
    services: _legacyServices,
    refusalsTitle: _legacyRefusalsTitle,
    refusals: _legacyRefusals,
    introIcon: _legacyIntroIcon,
    ...rest
  } = raw;

  void _legacyServicesTitle;
  void _legacyServices;
  void _legacyRefusalsTitle;
  void _legacyRefusals;
  void _legacyIntroIcon;

  return withQuickLinks({
    ...COMPANY_INFORMATION_DEFAULTS,
    ...rest,
    introAnchor: normalizeIntroAnchor(raw.introAnchor, raw.introTitle),
    policySections,
  });
};
