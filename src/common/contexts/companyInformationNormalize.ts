import type { AboutIntro, AboutSection, CompanyInformationContent } from "@/common/types/companyInformation";
import { syncOtherOptions } from "@/common/utils/companyInformationOtherOptions";
import {
  DEFAULT_DESCRIPTION_TYPE,
  reindexSections,
} from "@/common/utils/companyInformationSection";
import { toAnchorId } from "@/common/utils/anchor";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";

const stripAnchorHash = (value: string) => value.trim().replace(/^#/, "");

const normalizeIntro = (intro: AboutIntro): AboutIntro => {
  const fromInput = toAnchorId(stripAnchorHash(intro.anchor ?? ""));
  const fallback = toAnchorId(intro.title ?? "") || "gioi-thieu";
  return {
    ...intro,
    anchor: fromInput || fallback,
    imageUrl: intro.imageUrl?.trim() ?? "",
  };
};

const normalizeSection = (section: AboutSection): AboutSection => {
  const fromInput = toAnchorId(stripAnchorHash(section.anchor ?? ""));
  const fallback = toAnchorId(section.id) || section.id;
  return {
    ...section,
    active: section.active ?? true,
    anchor: fromInput || fallback,
    description: (section.description ?? []).map((item) => ({
      icon: item.icon ?? "",
      text: item.text ?? "",
      type: item.type?.trim() || DEFAULT_DESCRIPTION_TYPE,
    })),
    images: section.images?.length ? [...section.images] : [],
    body: section.body?.trim() ?? "",
  };
};

/** Chuẩn hóa trước khi lưu localStorage / gửi API. */
export const normalizeCompanyInformationContent = (
  raw: CompanyInformationContent,
): CompanyInformationContent => {
  const intro = normalizeIntro(raw.intro);
  const sections = reindexSections((raw.sections ?? []).map(normalizeSection));

  return {
    ...raw,
    seoUrl: normalizeSeoUrl(raw.seoUrl),
    intro,
    sections,
    otherOptions: syncOtherOptions({ intro, sections, otherOptions: raw.otherOptions ?? [] }),
  };
};
