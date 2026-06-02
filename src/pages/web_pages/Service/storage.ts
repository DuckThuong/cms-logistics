import { SERVICE_DETAIL_DEFAULTS, SERVICE_HUB_DEFAULTS } from "@/common/constants/service";
import { migrateServiceDetail, migrateServiceHub } from "@/common/contexts/serviceMigrate";
import type { ServiceDetailContent, ServiceHubContent } from "@/common/types/service";

export const SERVICE_HUB_STORAGE_KEY = "cms.service.hub";

export const serviceDetailStorageKey = (id: string) => `cms.service.detail.${id}`;

export const loadServiceHub = (): ServiceHubContent => {
  const raw = localStorage.getItem(SERVICE_HUB_STORAGE_KEY);
  if (!raw) {
    return migrateServiceHub(SERVICE_HUB_DEFAULTS);
  }
  try {
    return migrateServiceHub(JSON.parse(raw) as ServiceHubContent);
  } catch {
    return migrateServiceHub(SERVICE_HUB_DEFAULTS);
  }
};

export const saveServiceHub = (hub: ServiceHubContent) => {
  localStorage.setItem(SERVICE_HUB_STORAGE_KEY, JSON.stringify(hub));
};

export const loadServiceDetail = (id: string): ServiceDetailContent => {
  const raw = localStorage.getItem(serviceDetailStorageKey(id));
  const fallback = SERVICE_DETAIL_DEFAULTS[id];
  if (!raw) {
    return migrateServiceDetail(
      fallback ?? {
        id,
        name: "",
        url: "",
        image: "",
        sections: [],
      },
    );
  }
  try {
    return migrateServiceDetail(JSON.parse(raw) as ServiceDetailContent);
  } catch {
    return migrateServiceDetail(fallback ?? { id, name: "", url: "", image: "", sections: [] });
  }
};

export const saveServiceDetail = (detail: ServiceDetailContent) => {
  localStorage.setItem(serviceDetailStorageKey(detail.id), JSON.stringify(detail));
};
