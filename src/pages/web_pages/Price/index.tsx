import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { ROUTER_PATH } from "@/routers/Route";
import { SeoSection } from "../CompanyInfomation/components/SeoSection";
import { PriceItemCardModal, type PriceItemModalMode } from "./components/PriceItemCardModal";
import { PriceListPanel } from "./components/PriceListPanel";
import { PRICE_HUB_DEFAULTS } from "./constants";
import { migratePriceHub } from "./migrateContent";
import { loadPriceHub, savePriceHub } from "./storage";
import type { PriceHubContent, PriceListItem } from "./types";
import "../CompanyInfomation/style.scss";
import "./style.scss";

const { TextArea } = Input;

type ViewMode = "cms" | "client";

export const PriceListPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<PriceHubContent>(PRICE_HUB_DEFAULTS);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState<PriceItemModalMode>("create");
  const [editingItem, setEditingItem] = useState<PriceListItem | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setContent(loadPriceHub());
  }, []);

  const normalizedSeoUrl = useMemo(
    () => normalizeSeoUrl(content.seoUrl),
    [content.seoUrl],
  );

  const updateField = <K extends keyof PriceHubContent>(
    field: K,
    value: PriceHubContent[K],
  ) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = migratePriceHub({
        ...content,
        seoUrl: normalizeSeoUrl(content.seoUrl),
      });
      savePriceHub(payload);
      setContent(payload);
      messageApi.success("Đã lưu danh sách bảng giá.");
    } finally {
      setIsSaving(false);
    }
  };

  const goToDetail = (item: PriceListItem) => {
    navigate(`${ROUTER_PATH.PRICE}/${encodeURIComponent(item.id)}`);
  };

  const openCreateCard = () => {
    setCardModalMode("create");
    setEditingItem(null);
    setCardModalOpen(true);
  };

  const openEditCard = (item: PriceListItem) => {
    setCardModalMode("edit");
    setEditingItem(item);
    setCardModalOpen(true);
  };

  const handleCardSave = (item: PriceListItem, mode: PriceItemModalMode) => {
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
        <small>URL hub bảng giá trên frontend (vd. /bang-gia).</small>
      </section>
      <section className="company-information-page__section-card">
        <h3>Header trang hub</h3>
        <Form layout="vertical">
          <Form.Item label="Nhãn (shortDescription)">
            <Input
              value={content.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Tiêu đề (name)">
            <Input
              value={content.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Mô tả hub (content)">
            <TextArea
              value={content.content}
              rows={3}
              onChange={(e) => updateField("content", e.target.value)}
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
        <section className="company-information-page__section-card">
          <h3>Xem trước Hub</h3>
          <p>{content.name}</p>
          <p className="company-information-page__quick-links-hint">{content.content}</p>
          <ul>
            {content.children.map((child) => (
              <li key={child.id}>
                {child.shortDescription} — /bang-gia/{child.url}
              </li>
            ))}
          </ul>
        </section>
        <div className="company-information-page__bottom-actions">
          <Button icon={<ArrowLeftOutlined />} onClick={() => setViewMode("cms")}>
            Quay lại chỉnh sửa
          </Button>
          <Button type="primary" icon={<SaveOutlined />} loading={isSaving} onClick={handleSave}>
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
          <h1 className="company-information-page__title">Danh sách bảng giá</h1>
          <p className="company-information-page__subtitle">
            Quản lý các trang bảng giá trên /bang-gia. Chọn một mục để chỉnh sections, bảng và
            banner.
          </p>
        </div>
      </div>

      <PriceListPanel
        items={content.children}
        onEditDetail={goToDetail}
        onEditCard={openEditCard}
        onAdd={openCreateCard}
        hubConfigPanel={hubConfigPanel}
      />

      <PriceItemCardModal
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
        <Button type="primary" icon={<SaveOutlined />} loading={isSaving} onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default PriceListPage;
