import { slugify } from "@/common/utils/seoUrl";
import { Form, Input, InputNumber, Modal, Switch } from "antd";
import { useEffect } from "react";
import type { PriceListItem } from "@/common/types/price";

export type PriceItemModalMode = "create" | "edit";

type PriceItemCardModalProps = {
  open: boolean;
  mode: PriceItemModalMode;
  initialValues: PriceListItem | null;
  nextSortIndex: number;
  onClose: () => void;
  onSave: (item: PriceListItem, mode: PriceItemModalMode) => void;
};

const newId = () => `price-${Math.random().toString(36).slice(2, 10)}`;

export const PriceItemCardModal = ({
  open,
  mode,
  initialValues,
  nextSortIndex,
  onClose,
  onSave,
}: PriceItemCardModalProps) => {
  const [form] = Form.useForm<PriceListItem>();

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      form.setFieldsValue({
        id: newId(),
        name: "Bảng giá",
        shortDescription: "",
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
      title={mode === "create" ? "Thêm mục bảng giá" : "Sửa mục menu"}
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
          label="Tên hiển thị (shortDescription)"
          rules={[{ required: true, message: "Nhập tên" }]}
        >
          <Input placeholder="Giá Order Hàng TQ" />
        </Form.Item>
        <Form.Item name="name" label="Nhãn (name)">
          <Input placeholder="Bảng giá" />
        </Form.Item>
        <Form.Item name="url" label="Slug URL">
          <Input
            placeholder="bang-gia-dich-vu-order-hang-trung-quoc"
            addonBefore="/bang-gia/"
          />
        </Form.Item>
        <Form.Item name="sortIndex" label="Thứ tự">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="active" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
