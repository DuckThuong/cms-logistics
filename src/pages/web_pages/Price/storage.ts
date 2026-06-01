import { PRICE_DETAIL_DEFAULTS, PRICE_HUB_DEFAULTS } from "./constants";
import { mapPriceDetailToApi } from "./mapToPriceApi";
import { migratePriceDetail, migratePriceHub } from "./migrateContent";
import type { PriceDetailStorageRecord } from "./apiTypes";
import type { PriceDetailContent, PriceHubContent, PriceListItem } from "./types";

export const PRICE_HUB_STORAGE_KEY = "cms.price.hub";

export const priceDetailStorageKey = (id: string) => `cms.price.detail.${id}`;

export const loadPriceHub = (): PriceHubContent => {
  const raw = localStorage.getItem(PRICE_HUB_STORAGE_KEY);
  if (!raw) {
    return migratePriceHub(PRICE_HUB_DEFAULTS);
  }
  try {
    return migratePriceHub(JSON.parse(raw) as PriceHubContent);
  } catch {
    return migratePriceHub(PRICE_HUB_DEFAULTS);
  }
};

export const savePriceHub = (hub: PriceHubContent) => {
  localStorage.setItem(PRICE_HUB_STORAGE_KEY, JSON.stringify(hub));
};

const emptyDetail = (id: string): PriceDetailContent => ({
  id,
  name: "",
  url: "",
  shortDescription: "",
  description: [],
  content: "",
  otherOptions: [],
  sections: [],
  updatedAt: new Date().toISOString(),
});

const parseStoredDetail = (raw: string): PriceDetailContent => {
  const parsed = JSON.parse(raw) as PriceDetailContent | PriceDetailStorageRecord;
  if (parsed && typeof parsed === "object" && "cms" in parsed) {
    return migratePriceDetail(parsed.cms);
  }
  return migratePriceDetail(parsed as PriceDetailContent);
};

export const loadPriceDetail = (id: string): PriceDetailContent => {
  const raw = localStorage.getItem(priceDetailStorageKey(id));
  const fallback = PRICE_DETAIL_DEFAULTS[id];
  if (!raw) {
    return migratePriceDetail(fallback ?? emptyDetail(id));
  }
  try {
    return parseStoredDetail(raw);
  } catch {
    return migratePriceDetail(fallback ?? emptyDetail(id));
  }
};

export const loadPriceDetailApi = (id: string, listItem?: PriceListItem) => {
  const cms = loadPriceDetail(id);
  return mapPriceDetailToApi(cms, { listItem });
};

export const savePriceDetail = (
  detail: PriceDetailContent,
  listItem?: PriceListItem,
) => {
  const cms = migratePriceDetail(detail);
  const record: PriceDetailStorageRecord = {
    cms,
    api: mapPriceDetailToApi(cms, { listItem }),
  };
  localStorage.setItem(priceDetailStorageKey(detail.id), JSON.stringify(record));
  return record;
};
