import type { AboutResponseDto } from "@/api/dtos/about.response";
import type { CompanyInformationContent, AboutSection, AboutSectionKind } from "@/common/types/companyInformation";
import { INTRO_API_SORT_INDEX } from "@/common/utils/companyInformationSection";

/**
 * Parse section title từ API format (JSON string hoặc plain text) → plain text.
 * API lưu title dạng: `[{"icon":"","text":"Tiêu đề","type":"text"}]`
 */
const parseSectionTitle = (raw: string): string => {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any) => item.text ?? "").join(" ");
    }
  } catch {
    // plain text
  }
  return raw;
};

/**
 * Xác định kind của section dựa vào sortIndex và cấu trúc.
 * - sortIndex = INTRO_API_SORT_INDEX (1) → intro section (không đưa vào sections[])
 * - Có images và description dạng checklist → policy
 * - Có body hoặc description dạng custom → content
 * - Mặc định → content
 */
const detectSectionKind = (
  section: any,
  index: number,
  totalSections: number,
): AboutSectionKind | "intro" => {
  if (section.sortIndex === INTRO_API_SORT_INDEX) return "intro";

  // Closing section: thường là section cuối, title rỗng, description có 2 dòng
  if (index === totalSections - 1 && !section.title && section.description?.length <= 2) {
    return "closing";
  }

  // Policy sections: có images hoặc description dạng checklist
  if (section.images?.length > 0) {
    return "policy";
  }

  return "content";
};

/**
 * Chuyển đổi AboutResponseDto (từ API) → CompanyInformationContent (cho CMS editor).
 */
export const mapResponseToCompanyInformation = (
  response: AboutResponseDto,
): CompanyInformationContent => {
  const sections = response.sections ?? [];

  // Tìm intro section (sortIndex = 1)
  const introApiSection = sections.find((s) => s.sortIndex === INTRO_API_SORT_INDEX);

  const intro = {
    title: introApiSection ? parseSectionTitle(introApiSection.title) : "",
    anchor: introApiSection?.title ? parseSectionTitle(introApiSection.title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") : "gioi-thieu",
    content: introApiSection?.description?.[0]?.text ?? response.content ?? "",
    imageUrl: introApiSection?.images?.[0] ?? "",
  };

  // Các sections còn lại (không phải intro)
  const bodySections = sections.filter((s) => s.sortIndex !== INTRO_API_SORT_INDEX);

  const mappedSections: AboutSection[] = bodySections.map((s, index) => {
    const kind = detectSectionKind(s, index, bodySections.length);

    return {
      id: String(s.id),
      sortIndex: s.sortIndex,
      kind: kind === "intro" || kind === "closing" ? (kind as any) : kind,
      active: s.active ?? true,
      title: kind === "closing" ? "" : parseSectionTitle(s.title),
      anchor: parseSectionTitle(s.title)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
      description: (s.description ?? []).map((d) => ({
        icon: d.icon ?? "",
        text: d.text ?? "",
        type: d.type ?? "text",
      })),
      images: s.images ?? [],
    };
  });

  // Map otherOptions
  const otherOptions = (response.otherOptions ?? []).map((opt, idx) => ({
    id: `opt-${idx}`,
    icon: opt.icon ?? "",
    type: (opt.type as any) ?? "options",
    value: opt.value ?? "",
  }));

  return {
    seoUrl: response.url ?? "/about",
    pageTag: response.shortDescription ?? "",
    pageTitle: response.name ?? "",
    pageSubtitle: response.content ?? "",
    headerExtras: [],
    intro,
    otherOptions,
    sections: mappedSections,
  };
};
