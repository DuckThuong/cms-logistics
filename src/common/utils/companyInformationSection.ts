import type { AboutSection, AboutSectionDescription, AboutSectionKind } from "@/common/types/companyInformation";

export const INTRO_API_SORT_INDEX = 1;

export const filterSectionsByKind = (
  sections: AboutSection[],
  kind: AboutSectionKind,
): AboutSection[] =>
  sections
    .filter((section) => section.kind === kind)
    .sort((a, b) => a.sortIndex - b.sortIndex);

export const DEFAULT_DESCRIPTION_TYPE = "text";

export const ABOUT_CONTENT_DESCRIPTION_TYPES = ["text", "text-bullet"] as const;

export type AboutContentDescriptionType =
  (typeof ABOUT_CONTENT_DESCRIPTION_TYPES)[number];

export const emptyDescriptionItem = (): AboutSectionDescription => ({
  icon: "",
  text: "",
  type: DEFAULT_DESCRIPTION_TYPE,
});

export const linesToDescription = (lines: string[]): AboutSectionDescription[] =>
  lines.map((text) => ({ icon: "", text, type: DEFAULT_DESCRIPTION_TYPE }));

export const descriptionToLines = (description: AboutSectionDescription[]): string[] =>
  description.length > 0 ? description.map((item) => item.text) : [""];

export const replaceSectionsByKind = (
  sections: AboutSection[],
  kind: AboutSectionKind,
  nextKindSections: AboutSection[],
): AboutSection[] => {
  const others = sections.filter((section) => section.kind !== kind);
  return [...others, ...nextKindSections];
};

/** Gán sortIndex: policy → content → closing (bắt đầu từ 2, sortIndex 1 dành cho intro trên API). */
export const reindexSections = (sections: AboutSection[]): AboutSection[] => {
  const policy = filterSectionsByKind(sections, "policy");
  const content = filterSectionsByKind(sections, "content");
  const closing = filterSectionsByKind(sections, "closing");

  let sortIndex = INTRO_API_SORT_INDEX + 1;
  const assign = (list: AboutSection[]) =>
    list.map((section) => ({ ...section, sortIndex: sortIndex++ }));

  return [...assign(policy), ...assign(content), ...assign(closing)];
};

export const getClosingLines = (sections: AboutSection[]): [string, string] => {
  const closing = filterSectionsByKind(sections, "closing")[0];
  if (!closing) {
    return ["", ""];
  }
  return [closing.description[0]?.text ?? "", closing.description[1]?.text ?? ""];
};

export const upsertClosingSection = (
  sections: AboutSection[],
  lineOne: string,
  lineTwo: string,
): AboutSection[] => {
  const withoutClosing = sections.filter((section) => section.kind !== "closing");
  if (!lineOne.trim() && !lineTwo.trim()) {
    return withoutClosing;
  }

  const existing = sections.find((section) => section.kind === "closing");
  const closingSection: AboutSection = {
    id: existing?.id ?? "closing",
    sortIndex: existing?.sortIndex ?? 999,
    kind: "closing",
    active: true,
    title: "",
    anchor: "",
    description: linesToDescription([lineOne, lineTwo]),
    images: [],
  };

  return [...withoutClosing, closingSection];
};
