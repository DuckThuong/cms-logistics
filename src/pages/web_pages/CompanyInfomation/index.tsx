import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { anchorFromTitle } from "@/common/utils/anchor";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { COMPANY_INFORMATION_DEFAULTS } from "@/common/constants/companyInformation";
import { migrateCompanyInformationContent } from "@/common/contexts/companyInformationMigrate";
import { normalizeCompanyInformationContent } from "@/common/contexts/companyInformationNormalize";
import {
  getHighlightOptions,
  getQuickLinkOptions,
  replaceHighlightOptions,
  syncOtherOptions,
  updateQuickLinkIcon,
} from "@/common/utils/companyInformationOtherOptions";
import {
  filterSectionsByKind,
  getClosingLines,
  reindexSections,
  replaceSectionsByKind,
  upsertClosingSection,
} from "@/common/utils/companyInformationSection";
import { CompanyInformationClientPreview } from "./components/CompanyInformationClientPreview";
import { ExtraFieldsEditor } from "./components/ExtraFieldsEditor";
import { HighlightListEditor } from "./components/HighlightListEditor";
import { ImageUploadField } from "./components/ImageUploadField";
import { QuickLinksAutoPanel } from "./components/QuickLinksAutoPanel";
import { ServicesRefusalsEditor } from "./components/ServicesRefusalsEditor";
import { SectionsEditor } from "./components/SectionsEditor";
import { SeoSection } from "./components/SeoSection";
import { createPageWithSections } from "@/api/pagesApi";
import type { AboutPagePayloadDto } from "@/api/dtos/about.response";
import type { CompanyInformationContent } from "@/common/types/companyInformation";
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
      setContent(migrateCompanyInformationContent(parsedData as any));
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

  const policySections = useMemo(
    () => filterSectionsByKind(content.sections, "policy"),
    [content.sections],
  );

  const contentSections = useMemo(
    () => filterSectionsByKind(content.sections, "content"),
    [content.sections],
  );

  const [closingLineOne, closingLineTwo] = useMemo(
    () => getClosingLines(content.sections),
    [content.sections],
  );

  const syncedOtherOptions = useMemo(
    () => syncOtherOptions(content),
    [content.intro, content.sections, content.otherOptions],
  );

  const highlightOptions = useMemo(
    () => getHighlightOptions(syncedOtherOptions),
    [syncedOtherOptions],
  );

  const quickLinkOptions = useMemo(
    () => getQuickLinkOptions(syncedOtherOptions),
    [syncedOtherOptions],
  );

  const contentForPreview = useMemo(
    () =>
      normalizeCompanyInformationContent({
        ...content,
        seoUrl: normalizedSeoUrl,
        otherOptions: syncedOtherOptions,
      }),
    [content, normalizedSeoUrl, syncedOtherOptions],
  );

  const updatePolicySections = (nextPolicy: typeof policySections) => {
    updateField(
      "sections",
      reindexSections(replaceSectionsByKind(content.sections, "policy", nextPolicy)),
    );
  };

  const updateContentSections = (nextContent: typeof contentSections) => {
    updateField(
      "sections",
      reindexSections(replaceSectionsByKind(content.sections, "content", nextContent)),
    );
  };

  const updateClosing = (lineOne: string, lineTwo: string) => {
    updateField("sections", reindexSections(upsertClosingSection(content.sections, lineOne, lineTwo)));
  };

  const handleHighlightChange = (highlights: typeof highlightOptions) => {
    updateField("otherOptions", replaceHighlightOptions(content.otherOptions, highlights));
  };

  const handleQuickLinkIconChange = (linkId: string, icon: string) => {
    updateField(
      "otherOptions",
      updateQuickLinkIcon(syncOtherOptions(content), linkId, icon),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const normalized = normalizeCompanyInformationContent(content);

      // Map CompanyInformationContent → AboutPagePayloadDto
      const payload: AboutPagePayloadDto = {
        name: normalized.pageTitle || "Company Information",
        url: normalized.seoUrl || "/about",
        shortDescription: normalized.pageSubtitle || "",
        content: normalized.intro?.content || "",
        otherOptions: (normalized.otherOptions || []).map((opt) => ({
          icon: opt.icon || "",
          type: opt.type || "options",
          value: opt.value || "",
        })),
        sections: (normalized.sections || [])
          .filter((s) => s.active)
          .map((s, idx) => ({
            title: s.title || "",
            description: (s.description || []).map((d) => ({
              icon: d.icon || "",
              text: d.text || "",
            })),
            images: s.images || [],
            sortIndex: s.sortIndex ?? idx + 1,
            active: s.active ?? true,
          })),
      };

      // Gọi API tạo page + sections
      const result = await createPageWithSections(payload);

      // Lưu localStorage như backup
      localStorage.setItem("cms.company-information.about", JSON.stringify(normalized));
      setContent(normalized);
      messageApi.success(`Đã lưu thành công! Page ID: ${result.id}`);
    } catch (error: any) {
      console.error("Save failed:", error);
      messageApi.error(error?.response?.data?.message || "Lưu thất bại. Vui lòng thử lại.");
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
            <Form.Item label="Nhãn (shortDescription)">
              <Input
                value={content.pageTag}
                onChange={(event) => updateField("pageTag", event.target.value)}
              />
            </Form.Item>
            <Form.Item label="Tiêu đề (name)">
              <Input
                value={content.pageTitle}
                onChange={(event) => updateField("pageTitle", event.target.value)}
              />
            </Form.Item>
            <Form.Item label="Mô tả (content)">
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
          <h3>Khối Giới thiệu (intro)</h3>
          <Form layout="vertical">
            <div className="company-information-page__inline-grid">
              <Form.Item label="Tiêu đề">
                <Input
                  value={content.intro.title}
                  onChange={(event) => {
                    const nextTitle = event.target.value;
                    setContent((prev) => ({
                      ...prev,
                      intro: {
                        ...prev.intro,
                        title: nextTitle,
                        anchor: anchorFromTitle(nextTitle),
                      },
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item label="Anchor">
                <Input value={content.intro.anchor} disabled />
              </Form.Item>
            </div>
            <Form.Item label="Nội dung">
              <TextArea
                value={content.intro.content}
                rows={4}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    intro: { ...prev.intro, content: event.target.value },
                  }))
                }
              />
            </Form.Item>
            <ImageUploadField
              label="Ảnh giới thiệu"
              value={content.intro.imageUrl}
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, imageUrl: url },
                }))
              }
            />
          </Form>
        </section>

        <HighlightListEditor
          title="Điểm nổi bật (Highlights)"
          values={highlightOptions}
          onChange={handleHighlightChange}
        />

        <QuickLinksAutoPanel
          title="Quick Links"
          values={quickLinkOptions}
          onIconChange={handleQuickLinkIconChange}
        />

        <SectionsEditor
          title="Khối Chính sách (Policy)"
          values={policySections}
          onChange={updatePolicySections}
        />

        <ServicesRefusalsEditor
          title="Dịch vụ & Từ chối"
          values={contentSections}
          onChange={updateContentSections}
        />

        <section className="company-information-page__section-card">
          <h3>Đoạn kết (Closing)</h3>
          <Form layout="vertical">
            <Form.Item label="Dòng 1">
              <Input
                value={closingLineOne}
                onChange={(event) => updateClosing(event.target.value, closingLineTwo)}
              />
            </Form.Item>
            <Form.Item label="Dòng 2">
              <Input
                value={closingLineTwo}
                onChange={(event) => updateClosing(closingLineOne, event.target.value)}
              />
            </Form.Item>
          </Form>
        </section>

        <div className="company-information-page__actions">
          <Button
            icon={<EyeOutlined />}
            onClick={() => setViewMode("client")}
          >
            Xem trước
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
      </Space>
    </div>
  );
};

export default CompanyInformationPage;
