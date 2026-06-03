import { EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Space } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getPriceContent } from "@/api/config/common.config";
import { CONTENT_ENDPOINTS } from "@/api/endpoints/common.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { migratePriceDetail } from "@/common/contexts/priceMigrate";
import { mapResponseToPriceDetail } from "@/common/utils/mapFromPriceResponse";
import { savePricePageToApi } from "@/common/utils/savePricePage";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { PriceDetailClientPreview } from "./components/PriceDetailClientPreview";
import { PriceIntroEditor } from "./components/PriceIntroEditor";
import { PriceOtherOptionsEditor } from "./components/PriceOtherOptionsEditor";
import { PriceSectionListEditor } from "./components/PriceSectionListEditor";
import { EMPTY_PRICE_PAGE_CONTENT } from "./emptyPricePageContent";
import type { PriceDetailContent } from "@/common/types/price";
import "../CompanyInfomation/style.scss";
import "./style.scss";

type ViewMode = "cms" | "client";

type SavePricePageVariables = {
  content: PriceDetailContent;
  pageId: number | null;
};

export const PriceListPage = () => {
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [content, setContent] = useState<PriceDetailContent>(EMPTY_PRICE_PAGE_CONTENT);
  const [pageId, setPageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");

  const { data: pricePage, isLoading } = useQuery({
    queryKey: [CONTENT_ENDPOINTS.GET_PRICE_CONTENT],
    queryFn: () => getPriceContent(),
    throwOnError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
      return false;
    },
  });

  useEffect(() => {
    if (!pricePage) {
      return;
    }
    setPageId(pricePage.id);
    setContent(migratePriceDetail(mapResponseToPriceDetail(pricePage)));
  }, [pricePage]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const saveMutation = useMutation({
    mutationFn: ({ content: draft, pageId: currentPageId }: SavePricePageVariables) =>
      savePricePageToApi(draft, currentPageId),
    onSuccess: ({ content: saved, pageId: nextPageId }, variables) => {
      setPageId(nextPageId);
      setContent(saved);
      const wasUpdate = variables.pageId != null;
      showNotification(
        wasUpdate
          ? `Đã cập nhật bảng giá! Page ID: ${nextPageId}`
          : `Đã tạo trang bảng giá! Page ID: ${nextPageId}`,
        NOTI_SUCCESS,
      );
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
  });

  const updateField = <K extends keyof PriceDetailContent>(
    field: K,
    value: PriceDetailContent[K],
  ) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const previewContent = useMemo(
    () => migratePriceDetail(content),
    [content],
  );

  const handleSave = () => {
    saveMutation.mutate({ content, pageId });
  };

  const isSaving = saveMutation.isPending;

  if (viewMode === "client") {
    return (
      <div className="company-information-page company-information-page--client-view">
        <PriceDetailClientPreview
          content={previewContent}
          hubName={content.name || "Bảng giá"}
        />
        <div className="company-information-page__bottom-actions">
          <Button onClick={() => setViewMode("cms")}>Quay lại chỉnh sửa</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSaving}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-information-page">
      <div className="company-information-page__header">
        <div className="company-information-page__header-text">
          <h1 className="company-information-page__title">Bảng giá</h1>
          <p className="company-information-page__subtitle">
            Một trang PRICE trên API (<code>url=price</code>) — khớp dữ liệu import: tiêu đề,
            intro, banner, sections (text + bảng).
            {pageId != null && (
              <>
                {" "}
                Page ID: <strong>{pageId}</strong>
              </>
            )}
          </p>
        </div>
      </div>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <section className="company-information-page__section-card">
          <h3>Thông tin trang</h3>
          <Form layout="vertical">
            <div className="company-information-page__inline-grid">
              <Form.Item label="Tiêu đề hiển thị (shortDescription)">
                <Input
                  value={content.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  placeholder="Bảng giá dịch vụ"
                />
              </Form.Item>
              <Form.Item
                label="URL API (url)"
                tooltip="Giữ 'price' để FE gọi GET by-url?url=price"
              >
                <Input
                  value={content.url}
                  onChange={(e) => updateField("url", e.target.value)}
                  placeholder="price"
                />
              </Form.Item>
            </div>
            <Form.Item label="Tên nội bộ (name)">
              <Input
                value={content.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Ngày cập nhật (updatedAt)">
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                value={content.updatedAt ? dayjs(content.updatedAt) : null}
                onChange={(date) =>
                  updateField("updatedAt", date?.toISOString() ?? new Date().toISOString())
                }
              />
            </Form.Item>
          </Form>
        </section>

        <PriceIntroEditor
          values={content.description}
          onChange={(next) => updateField("description", next)}
        />

        <PriceOtherOptionsEditor
          values={content.otherOptions}
          onChange={(next) => updateField("otherOptions", next)}
        />

        <PriceSectionListEditor
          values={content.sections}
          onChange={(next) => updateField("sections", next)}
        />
      </Space>

      <div className="company-information-page__bottom-actions">
        <Button icon={<EyeOutlined />} onClick={() => setViewMode("client")}>
          Xem trước Client
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isSaving}
          onClick={handleSave}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default PriceListPage;
