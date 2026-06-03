import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Space } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createPage,
  getServiceById,
  getServiceContent,
  updatePage,
} from "@/api/config/common.config";
import type { ServiceChildDto } from "@/api/dtos/service.response";
import { CONTENT_ENDPOINTS } from "@/api/endpoints/common.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { normalizeServiceDetailContent } from "@/common/contexts/serviceNormalize";
import { mapResponseToServiceDetail, mapResponseToServiceHub } from "@/common/utils/mapFromServiceResponse";
import { mapServiceDetailToApi, mapSavedChildToListItem } from "@/common/utils/mapToServiceApi";
import { parseNumericId } from "@/common/utils/parseNumericId";
import { slugify } from "@/common/utils/seoUrl";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { ImageUploadField } from "../../CompanyInfomation/components/ImageUploadField";
import { ServiceDetailClientPreview } from "../components/ServiceDetailClientPreview";
import { ServiceSectionsEditor } from "../components/ServiceSectionsEditor";
import type { ServiceDetailContent } from "@/common/types/service";
import "../../CompanyInfomation/style.scss";

type ViewMode = "cms" | "client";

type SaveServiceDetailVariables = {
  content: ServiceDetailContent;
  pageId: number;
  hubPageId: number;
};

export const ServiceDetailEditorPage = () => {
  const { serviceId = "" } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [content, setContent] = useState<ServiceDetailContent | null>(null);
  const [hubName, setHubName] = useState("Dịch vụ");
  const [listLabel, setListLabel] = useState("");
  const [hubPageId, setHubPageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cms");

  const numericId = parseNumericId(serviceId);

  const { data: hubPage } = useQuery({
    queryKey: [CONTENT_ENDPOINTS.GET_SERIVICE_CONTENT],
    queryFn: () => getServiceContent(),
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
    () => (hubPage ? mapResponseToServiceHub(hubPage) : null),
    [hubPage],
  );

  const listItem = useMemo(
    () => hubContent?.children.find((c) => c.id === serviceId || String(parseNumericId(c.id)) === String(numericId)),
    [hubContent, serviceId, numericId],
  );

  const { data: detailPage, isLoading } = useQuery({
    queryKey: [CONTENT_ENDPOINTS.GET_SERVICE_BY_ID, numericId],
    queryFn: () => getServiceById(numericId),
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
    setHubName(hubPage.name ?? "Dịch vụ");
  }, [hubPage]);

  useEffect(() => {
    if (!serviceId) {
      return;
    }
    if (numericId <= 0) {
      showNotification(
        "Dịch vụ chưa có trên server. Hãy lưu hub trước khi chỉnh chi tiết.",
        NOTI_ERROR,
      );
      navigate(ROUTER_PATH.SERVICE);
      return;
    }
    if (!detailPage || !hubContent) {
      return;
    }
    if (!listItem) {
      showNotification("Không tìm thấy dịch vụ trong danh sách hub.", NOTI_ERROR);
      navigate(ROUTER_PATH.SERVICE);
      return;
    }

    const mapped = mapResponseToServiceDetail(detailPage);
    setListLabel(listItem.shortDescription ?? mapped.name);
    setContent(
      normalizeServiceDetailContent({
        ...mapped,
        id: String(detailPage.id),
        name: mapped.name || listItem.shortDescription || "",
        url: mapped.url || listItem.url || "",
        image: mapped.image || listItem.image || "",
      }),
    );
  }, [
    serviceId,
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
    }: SaveServiceDetailVariables) => {
      const normalized = normalizeServiceDetailContent(draft);
      const payload = mapServiceDetailToApi(normalized, {
        parentId,
        listItem: listItem ?? undefined,
      });
      const result =
        pageId > 0
          ? await updatePage<ServiceChildDto>(pageId, payload)
          : await createPage<ServiceChildDto>(payload);
      return {
        normalized,
        result: mapSavedChildToListItem(result),
      };
    },
    onSuccess: ({ normalized }) => {
      setContent(normalized);
      showNotification(
        `Đã cập nhật nội dung chi tiết: ${normalized.name || listLabel}.`,
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

  const updateField = <K extends keyof ServiceDetailContent>(
    field: K,
    value: ServiceDetailContent[K],
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
    () => (content ? normalizeServiceDetailContent(content) : null),
    [content],
  );

  const isSaving = saveMutation.isPending;

  if (!content) {
    return null;
  }

  if (viewMode === "client" && previewContent) {
    return (
      <div className="company-information-page company-information-page--client-view">
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
