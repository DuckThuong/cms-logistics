/** Parse section title từ API (JSON hoặc plain text) → plain text. */
export const parseSectionTitle = (raw: string): string => {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: { text?: string }) => item.text ?? "").join(" ");
    }
  } catch {
    // plain text
  }
  return raw;
};

/** JSON title khớp FE `retractTitle`. */
export const buildSectionTitle = (text: string) =>
  JSON.stringify([{ icon: "", text, type: "text" }]);
