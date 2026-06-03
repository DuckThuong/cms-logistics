import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Space } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServiceContent } from "@/api/config/common.config";
import { CONTENT_ENDPOINTS } from "@/api/endpoints/common.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { EMPTY_SERVICE_HUB_CONTENT } from "./emptyServiceHubContent";
import { mapResponseToServiceHub } from "@/common/utils/mapFromServiceResponse";
import { saveServiceHubToApi } from "@/common/utils/saveServiceHub";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { SeoSection } from "../CompanyInfomation/components/SeoSection";
import { ImageUploadField } from "../CompanyInfomation/components/ImageUploadField";
import { ServiceHubClientPreview } from "./components/ServiceHubClientPreview";
import { ServiceItemCardModal, type ServiceItemModalMode } from "./components/ServiceItemsEditor";
import { ServiceListPanel } from "./components/ServiceListPanel";
import type { ServiceHubContent, ServiceListItem } from "@/common/types/service";
import "../CompanyInfomation/style.scss";
import "./style.scss";

const { TextArea } = Input;

type ViewMode = "cms" | "client";

type SaveServiceHubVariables = {
  content: ServiceHubContent;
  pageId: number | null;
};

export const ServiceListPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [content, setContent] = useState<ServiceHubContent>(EMPTY_SERVICE_HUB_CONTENT);
  const [pageId, setPageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState<ServiceItemModalMode>("create");
  const [editingItem, setEditingItem] = useState<ServiceListItem | null>(null);

  const { data: servicePage, isLoading } = useQuery({
    queryKey: [CONTENT_ENDPOINTS.GET_SERIVICE_CONTENT],
    queryFn: () => getServiceContent(),
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
    if (!servicePage) {
      return;
    }
    setContent(mapResponseToServiceHub(servicePage));
    setPageId(servicePage.id);
  }, [servicePage]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const saveMutation = useMutation({
    mutationFn: ({ content: draft, pageId: currentPageId }: SaveServiceHubVariables) =>
      saveServiceHubToApi(draft, currentPageId),
    onSuccess: ({ content: saved, pageId: nextPageId }, variables) => {
      setPageId(nextPageId);
      setContent(saved);
      const wasUpdate = variables.pageId != null;
      showNotification(
        wasUpdate
          ? `Đã cập nhật hub dịch vụ! Page ID: ${nextPageId}`
          : `Đã tạo hub dịch vụ! Page ID: ${nextPageId}`,
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

  const normalizedSeoUrl = useMemo(
    () => normalizeSeoUrl(content.seoUrl),
    [content.seoUrl],
  );

  const updateField = <K extends keyof ServiceHubContent>(
    field: K,
    value: ServiceHubContent[K],
  ) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const contentForPreview = useMemo(
    () => ({ ...content, seoUrl: normalizedSeoUrl }),
    [content, normalizedSeoUrl],
  );

  const handleSave = () => {
    saveMutation.mutate({ content, pageId });
  };

  const isSaving = saveMutation.isPending;

  const goToDetail = (item: ServiceListItem) => {
    navigate(`${ROUTER_PATH.SERVICE}/${encodeURIComponent(item.id)}`);
  };

  const openCreateCard = () => {
    setCardModalMode("create");
    setEditingItem(null);
    setCardModalOpen(true);
  };

  const openEditCard = (item: ServiceListItem) => {
    setCardModalMode("edit");
    setEditingItem(item);
    setCardModalOpen(true);
  };

  const handleCardSave = (item: ServiceListItem, mode: ServiceItemModalMode) => {
    if (mode === "create") {
      updateField(
        "children",
        [...content.children, item].sort((a, b) => a.sortIndex - b.sortIndex),
      );
      return;
    }
    updateField(
      "children",
      content.children
        .map((child) => (child.id === item.id ? item : child))
        .sort((a, b) => a.sortIndex - b.sortIndex),
    );
  };

  const hubConfigPanel = (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <SeoSection
        seoUrl={content.seoUrl}
        onSeoUrlChange={(value) => updateField("seoUrl", value)}
      />
      <section className="company-information-page__section-card">
        <h3>Thông tin SEO URL</h3>
        <p className="company-information-page__seo-result">{normalizedSeoUrl}</p>
        <small>URL hub dịch vụ trên frontend (vd. /dich-vu).</small>
      </section>
      <section className="company-information-page__section-card">
        <h3>Header trang hub</h3>
        <Form layout="vertical">
          <Form.Item label="Nhãn (shortDescription / badge)">
            <Input
              value={content.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              placeholder="Dịch vụ"
            />
          </Form.Item>
          <Form.Item label="Tiêu đề (name)">
            <Input
              value={content.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Dịch vụ"
            />
          </Form.Item>
          <Form.Item label="Mô tả (content)">
            <TextArea
              value={content.content}
              rows={3}
              onChange={(e) => updateField("content", e.target.value)}
            />
          </Form.Item>
        </Form>
      </section>
      <section className="company-information-page__section-card">
        <h3>Banner ứng dụng</h3>
        <Form layout="vertical">
          <Form.Item label="Nhãn hiển thị">
            <Input
              value={content.appBannerLabel}
              onChange={(e) => updateField("appBannerLabel", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Icon / ảnh banner">
            <ImageUploadField
              value={content.appBannerUrl}
              onChange={(v) => updateField("appBannerUrl", v)}
            />
          </Form.Item>
        </Form>
      </section>
    </Space>
  );

  if (viewMode === "client") {
    return (
      <div className="company-information-page company-information-page--client-view">
        <ServiceHubClientPreview content={contentForPreview} />
        <div className="company-information-page__bottom-actions">
          <Button icon={<ArrowLeftOutlined />} onClick={() => setViewMode("cms")}>
            Quay lại chỉnh sửa
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
  }

  return (
    <div className="company-information-page">
      <div className="company-information-page__header">
        <div className="company-information-page__header-text">
          <h1 className="company-information-page__title">Danh sách dịch vụ</h1>
          <p className="company-information-page__subtitle">
            Quản lý các dịch vụ hiển thị trên trang /dich-vu. Chọn một dịch vụ để chỉnh nội dung
            chi tiết.
          </p>
        </div>
      </div>

      <ServiceListPanel
        items={content.children}
        onEditDetail={goToDetail}
        onEditCard={openEditCard}
        onAdd={openCreateCard}
        hubConfigPanel={hubConfigPanel}
      />

      <ServiceItemCardModal
        open={cardModalOpen}
        mode={cardModalMode}
        initialValues={editingItem}
        nextSortIndex={content.children.length + 1}
        onClose={() => setCardModalOpen(false)}
        onSave={handleCardSave}
      />

      <div className="company-information-page__bottom-actions">
        <Button icon={<EyeOutlined />} onClick={() => setViewMode("client")}>
          Xem trước Hub
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

export default ServiceListPage;
