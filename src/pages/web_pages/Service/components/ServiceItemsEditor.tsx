import { slugify } from "@/common/utils/seoUrl";
import { Form, Input, InputNumber, Modal, Switch } from "antd";
import { useEffect } from "react";
import { ImageUploadField } from "../../CompanyInfomation/components/ImageUploadField";
import type { ServiceListItem } from "../types";

export type ServiceItemModalMode = "create" | "edit";

type ServiceItemCardModalProps = {
  open: boolean;
  mode: ServiceItemModalMode;
  initialValues: ServiceListItem | null;
  nextSortIndex: number;
  onClose: () => void;
  onSave: (item: ServiceListItem, mode: ServiceItemModalMode) => void;
};

const newId = () => `svc-${Math.random().toString(36).slice(2, 10)}`;

export const ServiceItemCardModal = ({
  open,
  mode,
  initialValues,
  nextSortIndex,
  onClose,
  onSave,
}: ServiceItemCardModalProps) => {
  const [form] = Form.useForm<ServiceListItem>();

  useEffect(() => {
    if (!open) {
      return;
    }
    if (mode === "create") {
      form.setFieldsValue({
        id: newId(),
        name: "Dịch vụ",
        shortDescription: "",
        image: "",
        url: "",
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
    onSave(
      {
        id: fields.id.trim(),
        name: fields.name.trim(),
        shortDescription: fields.shortDescription.trim(),
        image: fields.image?.trim() ?? "",
        url: fields.url.trim() || slugify(fields.shortDescription || fields.name),
        sortIndex: fields.sortIndex,
        active: fields.active ?? true,
      },
      mode,
    );
    onClose();
  };

  return (
    <Modal
      title={mode === "create" ? "Thêm dịch vụ" : "Sửa thẻ dịch vụ (hub)"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
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
          <Input placeholder="Đặt hàng Trung Quốc" />
        </Form.Item>
        <Form.Item name="name" label="Nhãn card (name)">
          <Input placeholder="Dịch vụ" />
        </Form.Item>
        <Form.Item name="url" label="Slug URL chi tiết">
          <Input placeholder="dat-hang-trung-quoc" addonBefore="/dich-vu/" />
        </Form.Item>
        <Form.Item name="sortIndex" label="Thứ tự (sortIndex)">
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
