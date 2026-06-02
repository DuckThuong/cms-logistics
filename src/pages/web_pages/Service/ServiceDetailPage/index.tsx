import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { slugify } from "@/common/utils/seoUrl";
import { ROUTER_PATH } from "@/routers/Route";
import { ImageUploadField } from "../../CompanyInfomation/components/ImageUploadField";
import { ServiceDetailClientPreview } from "../components/ServiceDetailClientPreview";
import { ServiceSectionsEditor } from "../components/ServiceSectionsEditor";
import { migrateServiceDetail } from "@/common/contexts/serviceMigrate";
import { loadServiceDetail, loadServiceHub, saveServiceDetail } from "../storage";
import type { ServiceDetailContent } from "@/common/types/service";
import "../../CompanyInfomation/style.scss";

type ViewMode = "cms" | "client";

export const ServiceDetailEditorPage = () => {
  const { serviceId = "" } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ServiceDetailContent | null>(null);
  const [hubName, setHubName] = useState("Dịch vụ");
  const [listLabel, setListLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!serviceId) {
      return;
    }
    const hub = loadServiceHub();
    const listItem = hub.children.find((c) => c.id === serviceId);
    if (!listItem) {
      messageApi.warning("Không tìm thấy dịch vụ trong danh sách hub.");
      navigate(ROUTER_PATH.SERVICE);
      return;
    }
    setHubName(hub.name);
    setListLabel(listItem.shortDescription);
    const detail = loadServiceDetail(serviceId);
    setContent(
      migrateServiceDetail({
        ...detail,
        id: serviceId,
        name: detail.name || listItem.shortDescription,
        url: detail.url || listItem.url,
        image: detail.image || listItem.image,
      }),
    );
  }, [serviceId, navigate, messageApi]);

  const updateField = <K extends keyof ServiceDetailContent>(
    field: K,
    value: ServiceDetailContent[K],
  ) => {
    setContent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!content) {
      return;
    }
    setIsSaving(true);
    try {
      const payload = migrateServiceDetail(content);
      saveServiceDetail(payload);
      setContent(payload);
      messageApi.success(`Đã lưu nội dung chi tiết: ${payload.name || listLabel}.`);
    } finally {
      setIsSaving(false);
    }
  };

  const previewContent = useMemo(
    () => (content ? migrateServiceDetail(content) : null),
    [content],
  );

  if (!content) {
    return null;
  }

  if (viewMode === "client" && previewContent) {
    return (
      <div className="company-information-page company-information-page--client-view">
        {contextHolder}
        <ServiceDetailClientPreview content={previewContent} hubName={hubName} />
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
          <h1 className="company-information-page__title">
            Chi tiết dịch vụ: {listLabel || content.name}
          </h1>
          <p className="company-information-page__subtitle">
            Khớp frontend <code>/dich-vu/{content.url}</code> — tiêu đề và các section HTML.
          </p>
        </div>
        <Button type="link">
          <Link to={ROUTER_PATH.SERVICE}>← Danh sách dịch vụ</Link>
        </Button>
      </div>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <section className="company-information-page__section-card">
          <h3>Thông tin trang chi tiết</h3>
          <Form layout="vertical">
            <div className="company-information-page__inline-grid">
              <Form.Item label="Tiêu đề (name)">
                <Input
                  value={content.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Slug URL">
                <Input
                  value={content.url}
                  addonBefore="/dich-vu/"
                  onChange={(e) => updateField("url", e.target.value)}
                  onBlur={() => {
                    if (!content.url.trim()) {
                      updateField("url", slugify(content.name));
                    }
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item label="Ảnh (nếu cần hiển thị riêng)">
              <ImageUploadField
                value={content.image}
                onChange={(v) => updateField("image", v)}
              />
            </Form.Item>
          </Form>
        </section>

        <ServiceSectionsEditor
          values={content.sections}
          onChange={(next) => updateField("sections", next)}
        />
      </Space>

      <div className="company-information-page__bottom-actions">
        <Button onClick={() => navigate(ROUTER_PATH.SERVICE)} icon={<ArrowLeftOutlined />}>
          Quay lại danh sách
        </Button>
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

export default ServiceDetailEditorPage;
