import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { ROUTER_PATH } from "@/routers/Route";
import { SeoSection } from "../CompanyInfomation/components/SeoSection";
import { ImageUploadField } from "../CompanyInfomation/components/ImageUploadField";
import { ServiceHubClientPreview } from "./components/ServiceHubClientPreview";
import { ServiceItemCardModal, type ServiceItemModalMode } from "./components/ServiceItemsEditor";
import { ServiceListPanel } from "./components/ServiceListPanel";
import { SERVICE_HUB_DEFAULTS } from "@/common/constants/service";
import { migrateServiceHub } from "@/common/contexts/serviceMigrate";
import { loadServiceHub, saveServiceHub } from "./storage";
import type { ServiceHubContent, ServiceListItem } from "@/common/types/service";
import "../CompanyInfomation/style.scss";
import "./style.scss";

const { TextArea } = Input;

type ViewMode = "cms" | "client";

export const ServiceListPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<ServiceHubContent>(SERVICE_HUB_DEFAULTS);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState<ServiceItemModalMode>("create");
  const [editingItem, setEditingItem] = useState<ServiceListItem | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setContent(loadServiceHub());
  }, []);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = migrateServiceHub({
        ...content,
        seoUrl: normalizeSeoUrl(content.seoUrl),
      });
      saveServiceHub(payload);
      setContent(payload);
      messageApi.success("Đã lưu danh sách và cấu hình hub.");
    } finally {
      setIsSaving(false);
    }
  };

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
        {contextHolder}
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
      {contextHolder}
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
