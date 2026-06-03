/** Lấy id page số từ id CMS (vd. "11", "svc-11"). Id tạm (news-local-...) trả về 0. */
export const parseNumericId = (id: string): number => {
  const trimmed = id.trim();
  if (!trimmed) {
    return 0;
  }
  if (/^\d+$/.test(trimmed)) {
    const n = Number.parseInt(trimmed, 10);
    return Number.isNaN(n) ? 0 : n;
  }
  const legacy = trimmed.match(/^(?:svc|service|news|price)-(\d+)$/i);
  if (legacy) {
    const n = Number.parseInt(legacy[1], 10);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
};
