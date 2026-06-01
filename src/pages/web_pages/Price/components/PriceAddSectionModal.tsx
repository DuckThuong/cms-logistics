import { Form, Input, InputNumber, Modal, Select } from "antd";

export type SectionContentType = "text" | "table";

export type PriceAddSectionFormValues = {
  title: string;
  type: SectionContentType;
  sortIndex: number;
};

type PriceAddSectionModalProps = {
  open: boolean;
  nextSortIndex: number;
  onClose: () => void;
  onSubmit: (values: PriceAddSectionFormValues) => void;
};

export const PriceAddSectionModal = ({
  open,
  nextSortIndex,
  onClose,
  onSubmit,
}: PriceAddSectionModalProps) => {
  const [form] = Form.useForm<PriceAddSectionFormValues>();

  const handleOpen = () => {
    form.setFieldsValue({
      title: "",
      type: "text",
      sortIndex: nextSortIndex,
    });
  };

  return (
    <Modal
      title="Thêm section"
      open={open}
      afterOpenChange={(visible) => {
        if (visible) handleOpen();
      }}
      onCancel={onClose}
      onOk={async () => {
        const values = await form.validateFields();
        onSubmit(values);
        onClose();
      }}
      okText="Thêm"
      cancelText="Huỷ"
      destroyOnClose
      width={480}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề section"
          rules={[{ required: true, message: "Nhập tiêu đề" }]}
        >
          <Input placeholder="VD: 1. Phí dịch vụ order" />
        </Form.Item>
        <Form.Item name="type" label="Loại nội dung" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "text", label: "Văn bản (HTML)" },
              { value: "table", label: "Bảng giá" },
            ]}
          />
        </Form.Item>
        <Form.Item name="sortIndex" label="Thứ tự (tự động)">
          <InputNumber min={1} style={{ width: "100%" }} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};
