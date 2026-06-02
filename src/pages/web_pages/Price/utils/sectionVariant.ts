import type { PriceDetailSection } from "@/common/types/price";

export type SectionVariant =
  | "main-title"
  | "tagline"
  | "disclaimer"
  | "numbered"
  | "closing"
  | "heading";

export const getPriceSectionVariant = (section: PriceDetailSection): SectionVariant => {
  const title = section.title.trim();

  if (title.includes("TRÂN TRỌNG")) return "closing";
  if (title.startsWith("***")) return "disclaimer";
  if (section.sortIndex === 1) return "main-title";
  if (section.sortIndex === 2) return "tagline";
  if (/^\d+\./.test(title)) return "numbered";

  return "heading";
};
