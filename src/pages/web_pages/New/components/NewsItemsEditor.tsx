import { slugify } from "@/common/utils/seoUrl";
import { Form, Input, InputNumber, Modal, Switch } from "antd";
import { useEffect } from "react";
import { ImageUploadField } from "../../CompanyInfomation/components/ImageUploadField";
import type { NewsListItem } from "@/common/types/news";

export type NewsItemModalMode = "create" | "edit";

type NewsItemCardModalProps = {
  open: boolean;
  mode: NewsItemModalMode;
  initialValues: NewsListItem | null;
  nextSortIndex: number;
  confirmLoading?: boolean;
  onClose: () => void;
  onSave: (item: NewsListItem, mode: NewsItemModalMode) => void | Promise<void>;
};

const newId = () => `news-local-${crypto.randomUUID()}`;

export const NewsItemCardModal = ({
  open,
  mode,
  initialValues,
  nextSortIndex,
  confirmLoading = false,
  onClose,
  onSave,
}: NewsItemCardModalProps) => {
  const [form] = Form.useForm<NewsListItem>();

  useEffect(() => {
    if (!open) {
      return;
    }
    if (mode === "create") {
      form.setFieldsValue({
        id: newId(),
        name: "Tin tức",
        shortDescription: "",
        image: "",
        url: "",
        publishDate: "",
        sortIndex: nextSortIndex,
        active: true,
      });
      return;
    }
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, mode, initialValues, nextSortIndex, form]);

  const handleSubmit = async () => {
    const fields = await form.validateFields();
    try {
      await onSave(
        {
          id: fields.id.trim(),
          name: fields.name.trim(),
          shortDescription: fields.shortDescription.trim(),
          image: fields.image?.trim() ?? "",
          url: fields.url.trim() || slugify(fields.shortDescription || fields.name),
          publishDate: fields.publishDate?.trim() ?? "",
          sortIndex: fields.sortIndex,
          active: fields.active ?? true,
        },
        mode,
      );
      onClose();
    } catch {
      // Giữ modal mở khi lưu API thất bại
    }
  };

  return (
    <Modal
      title={mode === "create" ? "Thêm bài viết" : "Sửa thẻ tin (hub)"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      okText="Lưu"
      cancelText="Huỷ"
      destroyOnClose
      width={640}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="shortDescription"
          label="Tiêu đề card (shortDescription)"
          rules={[{ required: true, message: "Nhập tiêu đề" }]}
        >
          <Input placeholder="Bảng giá vận chuyển..." />
        </Form.Item>
        <Form.Item name="name" label="Nhãn tag (name)">
          <Input placeholder="Tin tức" />
        </Form.Item>
        <Form.Item name="publishDate" label="Ngày hiển thị (otherOptions text)">
          <Input placeholder="07-07-2025" />
        </Form.Item>
        <Form.Item name="url" label="Slug URL chi tiết">
          <Input placeholder="bang-gia-van-chuyen" addonBefore="/tin-tuc/" />
        </Form.Item>
        <Form.Item name="sortIndex" label="Thứ tự (sortIndex = 1 → nổi bật)">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="active" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="image" label="Ảnh card">
          <ImageUploadField />
        </Form.Item>
      </Form>
    </Modal>
  );
};
