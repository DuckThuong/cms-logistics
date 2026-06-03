/** Lấy số từ id CMS (vd. "11", "svc-11") — dùng khi gọi API theo id page. */
export const parseNumericId = (id: string): number => {
  const digits = id.replace(/\D/g, "");
  if (!digits) {
    return 0;
  }
  const n = Number.parseInt(digits, 10);
  return Number.isNaN(n) ? 0 : n;
};
