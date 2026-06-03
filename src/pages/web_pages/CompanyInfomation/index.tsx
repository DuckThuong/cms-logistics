import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Space } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  createPage,
  getAboutContent,
  updatePage,
} from "@/api/config/common.config";
import { CONTENT_ENDPOINTS } from "@/api/endpoints/common.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { normalizeCompanyInformationContent } from "@/common/contexts/companyInformationNormalize";
import type { CompanyInformationContent } from "@/common/types/companyInformation";
import { anchorFromTitle } from "@/common/utils/anchor";
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
import { mapResponseToCompanyInformation } from "@/common/utils/mapFromApiResponse";
import { mapCompanyInformationToAboutApi } from "@/common/utils/mapToAboutApi";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { CompanyInformationClientPreview } from "./components/CompanyInformationClientPreview";
import { ExtraFieldsEditor } from "./components/ExtraFieldsEditor";
import { HighlightListEditor } from "./components/HighlightListEditor";
import { ImageUploadField } from "./components/ImageUploadField";
import { QuickLinksAutoPanel } from "./components/QuickLinksAutoPanel";
import { ServicesRefusalsEditor } from "./components/ServicesRefusalsEditor";
import { PolicySectionsEditor } from "./components/PolicySectionsEditor";
import { SeoSection } from "./components/SeoSection";
import { EMPTY_COMPANY_INFORMATION_CONTENT } from "./emptyCompanyInformationContent";
import "./style.scss";

const { TextArea } = Input;

type ViewMode = "cms" | "client";

type SaveCompanyInformationVariables = {
  content: CompanyInformationContent;
  pageId: number | null;
};

export const CompanyInformationPage = () => {
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [content, setContent] = useState<CompanyInformationContent>(
    EMPTY_COMPANY_INFORMATION_CONTENT,
  );
  const [pageId, setPageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");

  const { data: aboutPage, isLoading } = useQuery({
    queryKey: [CONTENT_ENDPOINTS.GET_ABOUT_CONTENT],
    queryFn: () => getAboutContent(),
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
    if (!aboutPage) {
      return;
    }
    setContent(mapResponseToCompanyInformation(aboutPage));
    setPageId(aboutPage.id);
  }, [aboutPage]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const saveMutation = useMutation({
    mutationFn: async ({
      content: draft,
      pageId: currentPageId,
    }: SaveCompanyInformationVariables) => {
      const normalized = normalizeCompanyInformationContent(draft);
      const payload = mapCompanyInformationToAboutApi(normalized);
      const result =
        currentPageId != null
          ? await updatePage(currentPageId, payload)
          : await createPage(payload);
      return { result, normalized };
    },
    onSuccess: ({ result, normalized }, variables) => {
      setPageId(result.id);
      setContent(normalized);
      const wasUpdate = variables.pageId != null;
      showNotification(
        wasUpdate
          ? `Đã cập nhật thành công! Page ID: ${result.id}`
          : `Đã tạo mới thành công! Page ID: ${result.id}`,
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

  const handleSave = () => {
    saveMutation.mutate({ content, pageId });
  };

  const isSaving = saveMutation.isPending;
  if (viewMode === "client") {
    return (
      <div className="company-information-page company-information-page--client-view">
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
          values={highlightOptions}
          onChange={handleHighlightChange}
        />

        <QuickLinksAutoPanel
          title="Quick Links"
          values={quickLinkOptions}
          onIconChange={handleQuickLinkIconChange}
        />

        <PolicySectionsEditor
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
