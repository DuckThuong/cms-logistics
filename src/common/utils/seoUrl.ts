export type SeoUrlOptions = {
  /**
   * Nếu truyền title, sẽ tạo slug từ title.
   * Nếu truyền url, sẽ chuẩn hóa url (bắt đầu bằng '/', bỏ khoảng trắng, bỏ trùng dấu '/').
   */
  mode?: "from-title" | "normalize-url";
  /**
   * Prefix path, ví dụ: "/about" hoặc "/pages".
   * Khi mode="from-title", kết quả sẽ là `${prefix}/${slug}` (đã normalize).
   */
  prefix?: string;
  /** Giới hạn độ dài slug (không tính prefix). */
  maxSlugLength?: number;
};

const collapseSlashes = (value: string) => value.replace(/\/{2,}/g, "/");

const ensureLeadingSlash = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const trimTrailingSlashExceptRoot = (value: string) => {
  if (value === "/") return value;
  return value.replace(/\/+$/g, "");
};

export const normalizeSeoUrl = (url: string) => {
  const withSlash = ensureLeadingSlash(url);
  const collapsed = collapseSlashes(withSlash);
  return trimTrailingSlashExceptRoot(collapsed);
};

export const slugify = (input: string, maxLength = 80) => {
  const normalized = input
    .trim()
    .toLowerCase()
    // bỏ dấu tiếng Việt / unicode marks
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // đ/Đ
    .replace(/đ/g, "d")
    // các ký tự không hợp lệ -> '-'
    .replace(/[^a-z0-9]+/g, "-")
    // bỏ '-' ở đầu/cuối
    .replace(/^-+|-+$/g, "")
    // gom nhiều '-' liên tiếp
    .replace(/-+/g, "-");

  if (!normalized) return "";
  return normalized.length > maxLength ? normalized.slice(0, maxLength).replace(/-+$/g, "") : normalized;
};

/**
 * Helper chính để tạo SEO URL lưu DB.
 *
 * - mode="normalize-url": nhận input là url thô (người dùng nhập), trả ra url chuẩn.
 * - mode="from-title": nhận input là title, tạo slug, ghép với prefix (nếu có), rồi chuẩn hóa.
 */
export const buildSeoUrl = (input: string, options: SeoUrlOptions = {}) => {
  const mode = options.mode ?? "normalize-url";
  const prefix = options.prefix ? normalizeSeoUrl(options.prefix) : "";

  if (mode === "from-title") {
    const slug = slugify(input, options.maxSlugLength ?? 80);
    const combined = prefix ? `${prefix}/${slug}` : `/${slug}`;
    return normalizeSeoUrl(combined);
  }

  // normalize-url
  const base = normalizeSeoUrl(input);
  if (!prefix) return base;

  // Nếu user nhập "/about/abc" mà prefix="/about" thì giữ nguyên; nếu nhập "abc" thì ghép prefix.
  const baseNoSlash = base.startsWith("/") ? base.slice(1) : base;
  const prefixNoSlash = prefix.startsWith("/") ? prefix.slice(1) : prefix;
  if (baseNoSlash === prefixNoSlash || base.startsWith(prefix + "/")) return base;

  const combined = `${prefix}/${baseNoSlash}`;
  return normalizeSeoUrl(combined);
};
