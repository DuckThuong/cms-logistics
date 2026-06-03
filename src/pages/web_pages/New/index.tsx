import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Space } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPage, getNewsContent } from "@/api/config/common.config";
import type { NewsChildDto, NewsContentDto } from "@/api/dtos/news.response";
import { CONTENT_ENDPOINTS } from "@/api/endpoints/common.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { mapResponseToNewsHub } from "@/common/utils/mapFromNewsResponse";
import { mapNewsChildCardToApi, mapSavedChildToNewsListItem } from "@/common/utils/mapToNewsApi";
import { saveNewsHubToApi } from "@/common/utils/saveNewsHub";
import { parseNumericId } from "@/common/utils/parseNumericId";
import { normalizeSeoUrl } from "@/common/utils/seoUrl";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { SeoSection } from "../CompanyInfomation/components/SeoSection";
import { NewsHubClientPreview } from "./components/NewsHubClientPreview";
import { NewsItemCardModal, type NewsItemModalMode } from "./components/NewsItemsEditor";
import { NewsListPanel } from "./components/NewsListPanel";
import { EMPTY_NEWS_HUB_CONTENT } from "./emptyNewsHubContent";
import type { NewsHubContent, NewsListItem } from "@/common/types/news";
import "../CompanyInfomation/style.scss";
import "./style.scss";

const { TextArea } = Input;

type ViewMode = "cms" | "client";

type SaveNewsHubVariables = {
  content: NewsHubContent;
  pageId: number | null;
};

export const NewsListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [content, setContent] = useState<NewsHubContent>(EMPTY_NEWS_HUB_CONTENT);
  const [pageId, setPageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState<NewsItemModalMode>("create");
  const [editingItem, setEditingItem] = useState<NewsListItem | null>(null);
  const [cardSaving, setCardSaving] = useState(false);

  const { data: newsPage, isLoading } = useQuery({
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

  /** Id trang Hub (header /tin-tuc) — dùng làm parentId khi tạo bài viết con. */
  const hubPageId = useMemo(
    () => newsPage?.id ?? pageId ?? null,
    [newsPage?.id, pageId],
  );

  useEffect(() => {
    if (!newsPage) {
      return;
    }
    setContent(mapResponseToNewsHub(newsPage));
    setPageId(newsPage.id);
  }, [newsPage]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const saveMutation = useMutation({
    mutationFn: ({ content: draft, pageId: currentPageId }: SaveNewsHubVariables) =>
      saveNewsHubToApi(draft, currentPageId),
    onSuccess: ({ content: saved, pageId: nextPageId }, variables) => {
      setPageId(nextPageId);
      setContent(saved);
      queryClient.setQueryData<NewsContentDto>(
        [CONTENT_ENDPOINTS.GET_NEWS_CONTENT],
        (old) => (old ? { ...old, id: nextPageId } : old),
      );
      const wasUpdate = variables.pageId != null;
      showNotification(
        wasUpdate
          ? `Đã cập nhật hub tin tức! Page ID: ${nextPageId}`
          : `Đã tạo hub tin tức! Page ID: ${nextPageId}`,
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

  const updateField = <K extends keyof NewsHubContent>(
    field: K,
    value: NewsHubContent[K],
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

  const goToDetail = (item: NewsListItem) => {
    navigate(`${ROUTER_PATH.NEWS}/${encodeURIComponent(item.id)}`);
  };

  const openCreateCard = () => {
    setCardModalMode("create");
    setEditingItem(null);
    setCardModalOpen(true);
  };

  const openEditCard = (item: NewsListItem) => {
    setCardModalMode("edit");
    setEditingItem(item);
    setCardModalOpen(true);
  };

  const mergeChildIntoList = (item: NewsListItem, mode: NewsItemModalMode) => {
    setContent((prev) => {
      const children =
        mode === "create"
          ? [...prev.children, item]
          : prev.children.map((child) => (child.id === item.id ? item : child));
      return {
        ...prev,
        children: children.sort((a, b) => a.sortIndex - b.sortIndex),
      };
    });
  };

  const patchHubQueryChild = (saved: NewsChildDto) => {
    queryClient.setQueryData<NewsContentDto>(
      [CONTENT_ENDPOINTS.GET_NEWS_CONTENT],
      (old) => {
        if (!old) {
          return old;
        }
        const children = [...(old.children ?? [])];
        const index = children.findIndex((c) => c.id === saved.id);
        if (index >= 0) {
          children[index] = saved;
        } else {
          children.push(saved);
        }
        return { ...old, children };
      },
    );
  };

  const ensureHubPageId = async (): Promise<number> => {
    if (hubPageId != null && hubPageId > 0) {
      return hubPageId;
    }
    const { pageId: newHubPageId, content: savedHub } = await saveNewsHubToApi(
      { ...content, children: [] },
      null,
    );
    setPageId(newHubPageId);
    setContent((prev) => ({ ...savedHub, children: prev.children }));
    queryClient.setQueryData<NewsContentDto>(
      [CONTENT_ENDPOINTS.GET_NEWS_CONTENT],
      (old) => (old ? { ...old, id: newHubPageId } : old),
    );
    showNotification(
      `Đã tạo header Hub (ID: ${newHubPageId}). Đang tạo bài viết...`,
      NOTI_SUCCESS,
    );
    return newHubPageId;
  };

  const handleCardSave = async (item: NewsListItem, mode: NewsItemModalMode) => {
    if (mode === "create" && parseNumericId(item.id) <= 0) {
      setCardSaving(true);
      try {
        const parentHubId = await ensureHubPageId();
        const payload = mapNewsChildCardToApi(item, parentHubId, []);
        const saved = await createPage<NewsChildDto>(payload);
        const savedItem = mapSavedChildToNewsListItem(saved);
        mergeChildIntoList(savedItem, "create");
        patchHubQueryChild(saved);
        showNotification(
          `Đã tạo bài viết (ID: ${saved.id}, parentId: ${parentHubId}).`,
          NOTI_SUCCESS,
        );
      } catch (error) {
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
        throw error;
      } finally {
        setCardSaving(false);
      }
      return;
    }

    mergeChildIntoList(item, mode);
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
        <small>URL hub tin tức trên frontend (vd. /tin-tuc).</small>
      </section>
      <section className="company-information-page__section-card">
        <h3>Hero trang hub</h3>
        <Form layout="vertical">
          <Form.Item label="Badge (shortDescription)">
            <Input
              value={content.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              placeholder="Tin tức"
            />
          </Form.Item>
          <Form.Item label="Tiêu đề hero (description[0])">
            <Input
              value={content.heroTitle}
              onChange={(e) => updateField("heroTitle", e.target.value)}
              placeholder="Cập nhật tin tức logistics"
            />
          </Form.Item>
          <Form.Item label="Phụ đề hero (otherOptions[0])">
            <TextArea
              value={content.heroSubtitle}
              rows={2}
              onChange={(e) => updateField("heroSubtitle", e.target.value)}
            />
          </Form.Item>
        </Form>
      </section>
    </Space>
  );

  if (viewMode === "client") {
    return (
      <div className="company-information-page company-information-page--client-view">
        <NewsHubClientPreview content={contentForPreview} />
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
          <h1 className="company-information-page__title">Danh sách tin tức</h1>
          <p className="company-information-page__subtitle">
            Quản lý các bài viết hiển thị trên trang /tin-tuc. Chọn một bài để chỉnh nội dung
            chi tiết.
          </p>
        </div>
      </div>

      <NewsListPanel
        items={content.children}
        onEditDetail={goToDetail}
        onEditCard={openEditCard}
        onAdd={openCreateCard}
        hubConfigPanel={hubConfigPanel}
      />

      <NewsItemCardModal
        open={cardModalOpen}
        mode={cardModalMode}
        initialValues={editingItem}
        nextSortIndex={content.children.length + 1}
        confirmLoading={cardSaving}
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

export default NewsListPage;
