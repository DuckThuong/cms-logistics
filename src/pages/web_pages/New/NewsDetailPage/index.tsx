import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Space } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createPage,
  getNewsById,
  getNewsContent,
  updatePage,
} from "@/api/config/common.config";
import type { NewsChildDto } from "@/api/dtos/news.response";
import { CONTENT_ENDPOINTS } from "@/api/endpoints/common.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { normalizeNewsDetailContent } from "@/common/contexts/newsNormalize";
import { mapResponseToNewsDetail, mapResponseToNewsHub } from "@/common/utils/mapFromNewsResponse";
import { mapNewsDetailToApi, mapSavedChildToNewsListItem } from "@/common/utils/mapToNewsApi";
import { parseNumericId } from "@/common/utils/parseNumericId";
import { slugify } from "@/common/utils/seoUrl";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { ImageUploadField } from "../../CompanyInfomation/components/ImageUploadField";
import { NewsSectionsEditor } from "../components/NewsSectionsEditor";
import { NewsDetailClientPreview } from "../components/NewsDetailClientPreview";
import type { NewsDetailContent } from "@/common/types/news";
import "../../CompanyInfomation/style.scss";

type ViewMode = "cms" | "client";

type SaveNewsDetailVariables = {
  content: NewsDetailContent;
  pageId: number;
  hubPageId: number;
};

export const NewsDetailEditorPage = () => {
  const { newsId = "" } = useParams<{ newsId: string }>();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [content, setContent] = useState<NewsDetailContent | null>(null);
  const [hubLabel, setHubLabel] = useState("Tin tức");
  const [listLabel, setListLabel] = useState("");
  const [hubPageId, setHubPageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");

  const numericId = parseNumericId(newsId);

  const { data: hubPage } = useQuery({
    queryKey: [CONTENT_ENDPOINTS.GET_NEWS_CONTENT],
    queryFn: () => getNewsContent(),
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

  const hubContent = useMemo(
    () => (hubPage ? mapResponseToNewsHub(hubPage) : null),
    [hubPage],
  );

  const listItem = useMemo(
    () =>
      hubContent?.children.find(
        (c) => c.id === newsId || String(parseNumericId(c.id)) === String(numericId),
      ),
    [hubContent, newsId, numericId],
  );

  const { data: detailPage, isLoading } = useQuery({
    queryKey: [CONTENT_ENDPOINTS.GET_NEWS_BY_ID, numericId],
    queryFn: () => getNewsById(numericId),
    enabled: numericId > 0,
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
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (!hubPage) {
      return;
    }
    setHubPageId(hubPage.id);
    setHubLabel(hubPage.shortDescription || "Tin tức");
  }, [hubPage]);

  useEffect(() => {
    if (!newsId) {
      return;
    }
    if (numericId <= 0) {
      showNotification(
        "Bài viết chưa có trên server. Hãy lưu hub trước khi chỉnh chi tiết.",
        NOTI_ERROR,
      );
      navigate(ROUTER_PATH.NEWS);
      return;
    }
    if (!detailPage || !hubContent) {
      return;
    }
    if (!listItem) {
      showNotification("Không tìm thấy bài viết trong danh sách hub.", NOTI_ERROR);
      navigate(ROUTER_PATH.NEWS);
      return;
    }

    const mapped = mapResponseToNewsDetail(detailPage);
    setListLabel(listItem.shortDescription ?? mapped.shortDescription);
    setContent(
      normalizeNewsDetailContent({
        ...mapped,
        id: String(detailPage.id),
        shortDescription: mapped.shortDescription || listItem.shortDescription || "",
        url: mapped.url || listItem.url || "",
        image: mapped.image || listItem.image || "",
        publishDate: mapped.publishDate || listItem.publishDate || "",
      }),
    );
  }, [
    newsId,
    numericId,
    detailPage,
    hubContent,
    listItem,
    navigate,
    showNotification,
  ]);

  const saveMutation = useMutation({
    mutationFn: async ({
      content: draft,
      pageId,
      hubPageId: parentId,
    }: SaveNewsDetailVariables) => {
      const normalized = normalizeNewsDetailContent(draft);
      const payload = mapNewsDetailToApi(normalized, {
        parentId,
        listItem: listItem ?? undefined,
      });
      const result =
        pageId > 0
          ? await updatePage<NewsChildDto>(pageId, payload)
          : await createPage<NewsChildDto>(payload);
      return {
        normalized,
        result: mapSavedChildToNewsListItem(result),
      };
    },
    onSuccess: ({ normalized }) => {
      setContent(normalized);
      showNotification(
        `Đã cập nhật bài viết: ${normalized.shortDescription || listLabel}.`,
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

  const updateField = <K extends keyof NewsDetailContent>(
    field: K,
    value: NewsDetailContent[K],
  ) => {
    setContent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = () => {
    if (!content || hubPageId == null || numericId <= 0) {
      return;
    }
    saveMutation.mutate({
      content,
      pageId: numericId,
      hubPageId,
    });
  };

  const previewContent = useMemo(
    () => (content ? normalizeNewsDetailContent(content) : null),
    [content],
  );

  const isSaving = saveMutation.isPending;

  if (!content) {
    return null;
  }

  if (viewMode === "client" && previewContent) {
    return (
      <div className="company-information-page company-information-page--client-view">
        <NewsDetailClientPreview content={previewContent} hubLabel={hubLabel} />
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
          <h1 className="company-information-page__title">
            Chi tiết tin: {listLabel || content.shortDescription}
          </h1>
          <p className="company-information-page__subtitle">
            Khớp frontend <code>/tin-tuc/{content.url}</code> — tiêu đề và các section nội dung.
          </p>
        </div>
        <Button type="link">
          <Link to={ROUTER_PATH.NEWS}>← Danh sách tin tức</Link>
        </Button>
      </div>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <section className="company-information-page__section-card">
          <h3>Thông tin bài viết</h3>
          <Form layout="vertical">
            <div className="company-information-page__inline-grid">
              <Form.Item label="Nhãn breadcrumb hub (name)">
                <Input
                  value={content.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Tin tức"
                />
              </Form.Item>
              <Form.Item label="Tiêu đề bài (shortDescription)">
                <Input
                  value={content.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                />
              </Form.Item>
            </div>
            <div className="company-information-page__inline-grid">
              <Form.Item label="Slug URL">
                <Input
                  value={content.url}
                  addonBefore="/tin-tuc/"
                  onChange={(e) => updateField("url", e.target.value)}
                  onBlur={() => {
                    if (!content.url.trim()) {
                      updateField("url", slugify(content.shortDescription));
                    }
                  }}
                />
              </Form.Item>
              <Form.Item label="Ngày hiển thị">
                <Input
                  value={content.publishDate}
                  onChange={(e) => updateField("publishDate", e.target.value)}
                  placeholder="07-07-2025"
                />
              </Form.Item>
            </div>
            <Form.Item label="Ảnh (nếu cần)">
              <ImageUploadField
                value={content.image}
                onChange={(v) => updateField("image", v)}
              />
            </Form.Item>
          </Form>
        </section>

        <NewsSectionsEditor
          values={content.sections}
          onChange={(next) => updateField("sections", next)}
        />
      </Space>

      <div className="company-information-page__bottom-actions">
        <Button onClick={() => navigate(ROUTER_PATH.NEWS)} icon={<ArrowLeftOutlined />}>
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

export default NewsDetailEditorPage;
