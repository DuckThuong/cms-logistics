import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Space, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { COMPANY_INFORMATION_DEFAULTS } from "./constants";
import { CompanyInformationPreview } from "./components/CompanyInformationPreview";
import { ExtraFieldsEditor } from "./components/ExtraFieldsEditor";
import { ImageUploadField } from "./components/ImageUploadField";
import { ListEditor } from "./components/ListEditor";
import { SectionsEditor } from "./components/SectionsEditor";
import { SeoSection } from "./components/SeoSection";
import type { CompanyInformationContent } from "./types";
import "./style.scss";

const { TextArea } = Input;

export const CompanyInformationPage = () => {
  const [content, setContent] = useState<CompanyInformationContent>(
    COMPANY_INFORMATION_DEFAULTS,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const savedData = localStorage.getItem("cms.company-information.about");
    if (!savedData) {
      return;
    }
    try {
      const parsedData = JSON.parse(savedData) as CompanyInformationContent;
      setContent(parsedData);
    } catch {
      messageApi.warning("Không thể đọc dữ liệu đã lưu trước đó.");
    }
  }, [messageApi]);

  const normalizedSeoUrl = useMemo(
    () => normalizeSeoUrl(content.seoUrl),
    [content.seoUrl],
  );

  const updateField = <K extends keyof CompanyInformationContent>(
    field: K,
    value: CompanyInformationContent[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: CompanyInformationContent = {
        ...content,
        seoUrl: normalizeSeoUrl(content.seoUrl),
      };
      localStorage.setItem("cms.company-information.about", JSON.stringify(payload));
      setContent(payload);
      messageApi.success("Đã lưu nội dung Company Information (kèm SEO URL).");
    } finally {
      setIsSaving(false);
    }
  };

  const addHighlight = () => {
    updateField("highlights", [
      ...content.highlights,
      { id: `hl-${Math.random().toString(36).slice(2, 10)}`, label: "" },
    ]);
  };

  const removeHighlight = (index: number) => {
    updateField(
      "highlights",
      content.highlights.filter((_, idx) => idx !== index),
    );
  };

  const addQuickLink = () => {
    updateField("quickLinks", [
      ...content.quickLinks,
      {
        id: `ql-${Math.random().toString(36).slice(2, 10)}`,
        label: "",
        anchor: "#",
      },
    ]);
  };

  const removeQuickLink = (index: number) => {
    updateField(
      "quickLinks",
      content.quickLinks.filter((_, idx) => idx !== index),
    );
  };

  return (
    <div className="company-information-page">
      {contextHolder}
      <div className="company-information-page__header">
        <div>
          <h1>Trang Giới thiệu (About)</h1>
          <p>Quản trị nội dung hiển thị ở frontend và cấu hình đường dẫn SEO.</p>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSaving}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <SeoSection
              seoUrl={content.seoUrl}
              onSeoUrlChange={(value) => updateField("seoUrl", value)}
            />

            <section className="company-information-page__section-card">
              <h3>Header trang</h3>
              <Form layout="vertical">
                <Form.Item label="Nhãn (Tag)">
                  <Input
                    value={content.pageTag}
                    onChange={(event) => updateField("pageTag", event.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Tiêu đề chính">
                  <Input
                    value={content.pageTitle}
                    onChange={(event) => updateField("pageTitle", event.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Mô tả ngắn (Subtitle)">
                  <TextArea
                    value={content.pageSubtitle}
                    rows={3}
                    onChange={(event) =>
                      updateField("pageSubtitle", event.target.value)
                    }
                  />
                </Form.Item>
              </Form>
            </section>

            <ExtraFieldsEditor
              title="Nội dung bổ sung ở Header"
              values={content.headerExtras}
              onChange={(nextValues) => updateField("headerExtras", nextValues)}
            />

            <section className="company-information-page__section-card">
              <h3>Khối Giới thiệu</h3>
              <Form layout="vertical">
                <Form.Item label="Tiêu đề">
                  <Input
                    value={content.introTitle}
                    onChange={(event) => updateField("introTitle", event.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Nội dung">
                  <TextArea
                    value={content.introContent}
                    rows={4}
                    onChange={(event) =>
                      updateField("introContent", event.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Ảnh minh hoạ">
                  <ImageUploadField
                    value={content.introImageUrl}
                    onChange={(nextValue) => updateField("introImageUrl", nextValue)}
                  />
                </Form.Item>
              </Form>
            </section>

            <section className="company-information-page__section-card">
              <h3>Tiêu đề các khối mặc định</h3>
              <Form layout="vertical">
                <Form.Item label="Tiêu đề khối Dịch vụ">
                  <Input
                    value={content.servicesTitle}
                    onChange={(event) =>
                      updateField("servicesTitle", event.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Tiêu đề khối Từ chối">
                  <Input
                    value={content.refusalsTitle}
                    onChange={(event) =>
                      updateField("refusalsTitle", event.target.value)
                    }
                  />
                </Form.Item>
              </Form>
            </section>

            <section className="company-information-page__section-card">
              <div className="company-information-page__section-header">
                <h3>Điểm nổi bật</h3>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addHighlight}>
                  Thêm mục
                </Button>
              </div>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {content.highlights.map((item, index) => (
                  <div className="company-information-page__group" key={item.id}>
                    <div className="company-information-page__group-actions">
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => removeHighlight(index)}
                      />
                    </div>
                    <div className="company-information-page__inline-grid">
                    <Input
                      value={item.id}
                      placeholder="ID"
                      onChange={(event) => {
                        const nextItems = [...content.highlights];
                        nextItems[index] = { ...nextItems[index], id: event.target.value };
                        updateField("highlights", nextItems);
                      }}
                    />
                    <Input
                      value={item.label}
                      placeholder="Nhãn hiển thị"
                      onChange={(event) => {
                        const nextItems = [...content.highlights];
                        nextItems[index] = {
                          ...nextItems[index],
                          label: event.target.value,
                        };
                        updateField("highlights", nextItems);
                      }}
                    />
                  </div>
                  </div>
                ))}
              </Space>
            </section>

            <section className="company-information-page__section-card">
              <div className="company-information-page__section-header">
                <h3>Liên kết nhanh</h3>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addQuickLink}>
                  Thêm mục
                </Button>
              </div>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {content.quickLinks.map((item, index) => (
                  <div className="company-information-page__group" key={item.id}>
                    <div className="company-information-page__group-actions">
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => removeQuickLink(index)}
                      />
                    </div>
                    <div className="company-information-page__inline-grid">
                    <Input
                      value={item.label}
                      placeholder="Label"
                      onChange={(event) => {
                        const nextItems = [...content.quickLinks];
                        nextItems[index] = {
                          ...nextItems[index],
                          label: event.target.value,
                        };
                        updateField("quickLinks", nextItems);
                      }}
                    />
                    <Input
                      value={item.anchor}
                      placeholder="#anchor"
                      onChange={(event) => {
                        const nextItems = [...content.quickLinks];
                        nextItems[index] = {
                          ...nextItems[index],
                          anchor: event.target.value,
                        };
                        updateField("quickLinks", nextItems);
                      }}
                    />
                  </div>
                  </div>
                ))}
              </Space>
            </section>

            <ListEditor
              title="Danh sách dịch vụ"
              values={content.services}
              placeholder="Nội dung dịch vụ"
              onChange={(nextValues) => updateField("services", nextValues)}
            />

            <ListEditor
              title="Danh sách từ chối cung cấp dịch vụ"
              values={content.refusals}
              placeholder="Nội dung từ chối"
              onChange={(nextValues) => updateField("refusals", nextValues)}
            />

            <SectionsEditor
              title="Các khối nội dung tuỳ biến"
              values={content.sections}
              onChange={(nextValues) => updateField("sections", nextValues)}
            />

            <section className="company-information-page__section-card">
              <h3>Lời kết</h3>
              <Form layout="vertical">
                <Form.Item label="Dòng 1">
                  <Input
                    value={content.closingLineOne}
                    onChange={(event) =>
                      updateField("closingLineOne", event.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Dòng 2">
                  <Input
                    value={content.closingLineTwo}
                    onChange={(event) =>
                      updateField("closingLineTwo", event.target.value)
                    }
                  />
                </Form.Item>
              </Form>
            </section>
          </Space>
        </Col>

        <Col xs={24} xl={10}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <CompanyInformationPreview content={{ ...content, seoUrl: normalizedSeoUrl }} />

            <section className="company-information-page__section-card">
              <h3>Thông tin SEO URL</h3>
              <p className="company-information-page__seo-result">{normalizedSeoUrl}</p>
              <small>Giá trị này sẽ được dùng làm URL cho trang About ở frontend.</small>
            </section>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyInformationPage;
