import { normalizeAnchorHash, toAnchorId } from "@/common/utils/anchor";
import type { CompanyInformationContent, QuickLinkItem } from "./types";

type DeriveQuickLinksInput = Pick<
  CompanyInformationContent,
  "introTitle" | "introAnchor" | "policySections" | "sections"
>;

export const deriveQuickLinks = (content: DeriveQuickLinksInput): QuickLinkItem[] => {
  const links: QuickLinkItem[] = [];

  const introLabel = content.introTitle.trim();
  if (introLabel) {
    const introFallback = toAnchorId(introLabel) || "gioi-thieu";
    links.push({
      id: "intro",
      label: introLabel,
      anchor: normalizeAnchorHash(content.introAnchor ?? "", introFallback),
    });
  }

  for (const section of content.policySections) {
    const label = section.title.trim();
    if (!label) {
      continue;
    }
    const fallback = toAnchorId(section.id) || section.id;
    links.push({
      id: section.id,
      label,
      anchor: normalizeAnchorHash(section.anchor ?? "", fallback),
    });
  }

  for (const section of content.sections) {
    const label = section.title.trim();
    if (!label) {
      continue;
    }
    const fallback = toAnchorId(label) || section.id;
    links.push({
      id: section.id,
      label,
      anchor: normalizeAnchorHash(section.anchor, fallback),
    });
  }

  return links;
};
