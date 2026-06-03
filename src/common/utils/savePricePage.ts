import { createPage, updatePage } from "@/api/config/common.config";
import type { ServiceChildDto } from "@/api/dtos/priceResponse.dto";
import { migratePriceDetail } from "@/common/contexts/priceMigrate";
import type { PriceDetailContent } from "@/common/types/price";
import { mapResponseToPriceDetail } from "@/common/utils/mapFromPriceResponse";
import { mapPriceDetailToApi } from "@/common/utils/mapToPriceApi";

export type SavePricePageResult = {
  pageId: number;
  content: PriceDetailContent;
};

/** Lưu trang bảng giá đơn (url=price) — sections, banner, intro đầy đủ. */
export const savePricePageToApi = async (
  draft: PriceDetailContent,
  pageId: number | null,
): Promise<SavePricePageResult> => {
  const normalized = migratePriceDetail(draft);
  const payload = mapPriceDetailToApi(normalized, { parentId: null });
  const saved =
    pageId != null
      ? await updatePage<ServiceChildDto>(pageId, payload)
      : await createPage<ServiceChildDto>(payload);

  return {
    pageId: saved.id,
    content: mapResponseToPriceDetail(saved),
  };
};
