/** Khớp fe-logistics NewDetailPage — type description trong section tin tức */
export const NEWS_TEXT_IMG_TYPE = "text-img";

export const NEWS_DESCRIPTION_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "text-bullet", label: "Text bullet" },
  { value: "text-number", label: "Text số thứ tự" },
  { value: NEWS_TEXT_IMG_TYPE, label: "Ảnh + chú thích (text-img)" },
] as const;

export type NewsDescriptionType =
  (typeof NEWS_DESCRIPTION_TYPE_OPTIONS)[number]["value"];

export const isNewsTextImgType = (type?: string) => type === NEWS_TEXT_IMG_TYPE;
