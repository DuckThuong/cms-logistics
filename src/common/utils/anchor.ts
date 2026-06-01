/** Chuyển nhãn/slug thành id HTML hợp lệ (không có #). */
export const toAnchorId = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Slug từ tiêu đề → `gioi-thieu-tong-quan` (không có #) */
export const anchorFromTitle = (title: string): string => toAnchorId(title);

export const normalizeAnchorHash = (value: string, fallback: string): string => {
  const trimmed = value.trim();
  const base = trimmed || fallback;
  return base.startsWith("#") ? base : `#${base}`;
};
