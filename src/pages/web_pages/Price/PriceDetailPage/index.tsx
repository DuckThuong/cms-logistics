import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Space, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { slugify } from "@/common/utils/seoUrl";
import { ROUTER_PATH } from "@/routers/Route";
import { PriceDetailClientPreview } from "../components/PriceDetailClientPreview";
import { PriceOtherOptionsEditor } from "../components/PriceOtherOptionsEditor";
import { PriceSectionListEditor } from "../components/PriceSectionListEditor";
import { migratePriceDetail } from "../migrateContent";
import { loadPriceDetail, loadPriceHub, savePriceDetail } from "../storage";
import type { PriceDetailContent, PriceListItem } from "../types";
import "../../CompanyInfomation/style.scss";
import "../style.scss";

type ViewMode = "cms" | "client";

export const PriceDetailEditorPage = () => {
  const { priceId = "" } = useParams<{ priceId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<PriceDetailContent | null>(null);
  const [hubName, setHubName] = useState("Bảng giá");
  const [listLabel, setListLabel] = useState("");
  const [listItem, setListItem] = useState<PriceListItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!priceId) return;

    const hub = loadPriceHub();
    const matchedItem = hub.children.find((c) => c.id === priceId);
    if (!matchedItem) {
      messageApi.warning("Không tìm thấy mục trong danh sách bảng giá.");
      navigate(ROUTER_PATH.PRICE);
      return;
    }

    setHubName(hub.name);
    setListLabel(matchedItem.shortDescription);
    setListItem(matchedItem);
    const detail = loadPriceDetail(priceId);
    setContent(
      migratePriceDetail({
        ...detail,
        id: priceId,
        name: detail.name || matchedItem.name,
        shortDescription: detail.shortDescription || matchedItem.shortDescription,
        url: detail.url || matchedItem.url,
        content: detail.content || matchedItem.name,
      }),
    );
  }, [priceId, navigate, messageApi]);

  const updateField = <K extends keyof PriceDetailContent>(
    field: K,
    value: PriceDetailContent[K],
  ) => {
    setContent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    try {
      const payload = migratePriceDetail({
        ...content,
        updatedAt: content.updatedAt || new Date().toISOString(),
      });
      const saved = savePriceDetail(payload, listItem ?? undefined);
      setContent(saved.cms);
      messageApi.success(`Đã lưu: ${payload.shortDescription || listLabel}.`);
    } finally {
      setIsSaving(false);
    }
  };

  const previewContent = useMemo(
    () => (content ? migratePriceDetail(content) : null),
    [content],
  );

  if (!content) {
    return null;
  }

  if (viewMode === "client" && previewContent) {
    return (
      <div className="company-information-page company-information-page--client-view">
        {contextHolder}
        <PriceDetailClientPreview content={previewContent} hubName={hubName} />
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
          <h1 className="company-information-page__title">
            Chi tiết bảng giá: {listLabel || content.shortDescription}
          </h1>
          <p className="company-information-page__subtitle">
            Chỉnh thông tin trang & banner, sau đó thêm từng section (văn bản hoặc bảng).
          </p>
        </div>
        <Button type="link">
          <Link to={ROUTER_PATH.PRICE}>← Danh sách bảng giá</Link>
        </Button>
      </div>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <section className="company-information-page__section-card">
          <h3>Thông tin trang</h3>
          <Form layout="vertical">
            <div className="company-information-page__inline-grid">
              <Form.Item label="Tiêu đề (shortDescription)">
                <Input
                  value={content.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Slug URL">
                <Input
                  value={content.url}
                  addonBefore="/bang-gia/"
                  onChange={(e) => updateField("url", e.target.value)}
                  onBlur={() => {
                    if (!content.url.trim()) {
                      updateField("url", slugify(content.shortDescription));
                    }
                  }}
                />
              </Form.Item>
            </div>
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
        <Button onClick={() => navigate(ROUTER_PATH.PRICE)} icon={<ArrowLeftOutlined />}>
          Quay lại danh sách
        </Button>
        <Button icon={<EyeOutlined />} onClick={() => setViewMode("client")}>
          Xem trước Client
        </Button>
        <Button type="primary" icon={<SaveOutlined />} loading={isSaving} onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default PriceDetailEditorPage;
