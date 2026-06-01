import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { anchorFromTitle } from "@/common/utils/anchor";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { COMPANY_INFORMATION_DEFAULTS } from "./constants";
import { migrateCompanyInformationContent } from "./migrateContent";
import { CompanyInformationClientPreview } from "./components/CompanyInformationClientPreview";
import { ExtraFieldsEditor } from "./components/ExtraFieldsEditor";
import { HighlightListEditor } from "./components/HighlightListEditor";
import { ImageUploadField } from "./components/ImageUploadField";
import { QuickLinksAutoPanel } from "./components/QuickLinksAutoPanel";
import { ServicesRefusalsEditor } from "./components/ServicesRefusalsEditor";
import { deriveQuickLinks, mergeQuickLinkIcons } from "./deriveQuickLinks";
import { SectionsEditor } from "./components/SectionsEditor";
import { SeoSection } from "./components/SeoSection";
import type { CompanyInformationContent } from "./types";
import "./style.scss";

const { TextArea } = Input;

type ViewMode = "cms" | "client";

export const CompanyInformationPage = () => {
  const [content, setContent] = useState<CompanyInformationContent>(
    COMPANY_INFORMATION_DEFAULTS,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const savedData = localStorage.getItem("cms.company-information.about");
    if (!savedData) {
      return;
    }
    try {
      const parsedData = JSON.parse(savedData) as CompanyInformationContent;
      setContent(migrateCompanyInformationContent(parsedData));
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

  const derivedQuickLinks = useMemo(
    () => mergeQuickLinkIcons(deriveQuickLinks(content), content.quickLinks),
    [
      content.introTitle,
      content.introAnchor,
      content.policySections,
      content.sections,
      content.quickLinks,
    ],
  );

  const handleQuickLinkIconChange = (linkId: string, icon: string) => {
    const merged = mergeQuickLinkIcons(deriveQuickLinks(content), content.quickLinks);
    updateField(
      "quickLinks",
      merged.map((link) => (link.id === linkId ? { ...link, icon } : link)),
    );
  };

  const contentForPreview = useMemo(
    () => ({ ...content, seoUrl: normalizedSeoUrl, quickLinks: derivedQuickLinks }),
    [content, normalizedSeoUrl, derivedQuickLinks],
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: CompanyInformationContent = {
        ...content,
        seoUrl: normalizeSeoUrl(content.seoUrl),
        quickLinks: mergeQuickLinkIcons(deriveQuickLinks(content), content.quickLinks),
      };
      localStorage.setItem("cms.company-information.about", JSON.stringify(payload));
      setContent(payload);
      messageApi.success("Đã lưu nội dung Company Information (kèm SEO URL).");
    } finally {
      setIsSaving(false);
    }
  };

  if (viewMode === "client") {
    return (
      <div className="company-information-page company-information-page--client-view">
        {contextHolder}
        <CompanyInformationClientPreview content={contentForPreview} />
        <div className="company-information-page__bottom-actions">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setViewMode("cms")}
          >
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
            Trang Giới thiệu (About)
          </h1>
          <p className="company-information-page__subtitle">
            Quản trị nội dung hiển thị ở frontend và cấu hình đường dẫn SEO.
          </p>
        </div>
      </div>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <SeoSection
          seoUrl={content.seoUrl}
          onSeoUrlChange={(value) => updateField("seoUrl", value)}
        />

        <section className="company-information-page__section-card">
          <h3>Thông tin SEO URL</h3>
          <p className="company-information-page__seo-result">{normalizedSeoUrl}</p>
          <small>Giá trị này sẽ được dùng làm URL cho trang About ở frontend.</small>
        </section>

        <section className="company-information-page__section-card">
          <h3>Nội dung Banner</h3>
          <Form layout="vertical">
            <Form.Item label="Nhãn">
              <Input
                value={content.pageTag}
                onChange={(event) => updateField("pageTag", event.target.value)}
              />
            </Form.Item>
            <Form.Item label="Tiêu đề">
              <Input
                value={content.pageTitle}
                onChange={(event) => updateField("pageTitle", event.target.value)}
              />
            </Form.Item>
            <Form.Item label="Mô tả">
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
            <div className="company-information-page__inline-grid">
              <Form.Item label="Tiêu đề">
                <Input
                  value={content.introTitle}
                  onChange={(event) => {
                    const nextTitle = event.target.value;
                    setContent((prev) => ({
                      ...prev,
                      introTitle: nextTitle,
                      introAnchor: anchorFromTitle(nextTitle),
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item label="Liên kết nhanh">
                <Input
                  value={content.introAnchor}
                  placeholder="gioi-thieu-tong-quan"
                  onChange={(event) =>
                    updateField("introAnchor", event.target.value)
                  }
                />
              </Form.Item>
            </div>
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

        <HighlightListEditor
          values={content.highlights}
          onChange={(nextValues) => updateField("highlights", nextValues)}
        />

        <ServicesRefusalsEditor
          sections={content.policySections}
          onChange={(nextSections) => updateField("policySections", nextSections)}
        />

        <SectionsEditor
          title="Các khối nội dung tuỳ biến"
          values={content.sections}
          onChange={(nextValues) => updateField("sections", nextValues)}
        />

        <QuickLinksAutoPanel
          links={derivedQuickLinks}
          onIconChange={handleQuickLinkIconChange}
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

export default CompanyInformationPage;
