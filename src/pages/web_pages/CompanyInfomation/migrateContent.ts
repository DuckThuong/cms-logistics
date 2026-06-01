import { toAnchorId } from "@/common/utils/anchor";
import { COMPANY_INFORMATION_DEFAULTS } from "./constants";
import { deriveQuickLinks } from "./deriveQuickLinks";
import type { CompanyInformationContent, TitledContentSection } from "./types";

const stripAnchorHash = (value: string) => value.trim().replace(/^#/, "");

const normalizePolicySection = (section: TitledContentSection): TitledContentSection => {
  const fromInput = toAnchorId(stripAnchorHash(section.anchor ?? ""));
  const fallback = toAnchorId(section.id) || section.id;
  return {
    ...section,
    anchor: fromInput || fallback,
    content: section.content?.length ? [...section.content] : [""],
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

type LegacyContent = Partial<CompanyInformationContent> & {
  servicesTitle?: string;
  services?: string[];
  refusalsTitle?: string;
  refusals?: string[];
  policySections?: TitledContentSection[];
};

const newPolicyId = () => `policy-${Math.random().toString(36).slice(2, 10)}`;

export const migrateCompanyInformationContent = (
  raw: LegacyContent,
): CompanyInformationContent => {
  const withQuickLinks = (data: CompanyInformationContent): CompanyInformationContent => ({
    ...data,
    quickLinks: deriveQuickLinks(data),
  });

  if (Array.isArray(raw.policySections)) {
    return withQuickLinks({
      ...COMPANY_INFORMATION_DEFAULTS,
      ...raw,
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
    ...rest
  } = raw;

  void _legacyServicesTitle;
  void _legacyServices;
  void _legacyRefusalsTitle;
  void _legacyRefusals;

  return withQuickLinks({
    ...COMPANY_INFORMATION_DEFAULTS,
    ...rest,
    introAnchor: normalizeIntroAnchor(raw.introAnchor, raw.introTitle),
    policySections,
  });
};
