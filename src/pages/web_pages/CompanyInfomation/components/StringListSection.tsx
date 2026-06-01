import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import { SectionCardHeader } from "./SectionCardHeader";

type StringListSectionProps = {
  title: string;
  values: string[];
  placeholder: string;
  onChange: (nextValues: string[]) => void;
  addModalTitle?: string;
  addTooltip?: string;
};

export const StringListSection = ({
  title,
  values,
  placeholder,
  onChange,
  addModalTitle,
  addTooltip,
}: StringListSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<{ value: string }>();

  const handleUpdate = (index: number, nextValue: string) => {
    const nextValues = [...values];
    nextValues[index] = nextValue;
    onChange(nextValues);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  };

  const openModal = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const { value } = await form.validateFields();
    onChange([...values, value.trim()]);
    setModalOpen(false);
  };

  return (
    <div className="company-information-page__list-subsection">
      <SectionCardHeader
        title={title}
        onAddClick={openModal}
        addTooltip={addTooltip ?? "Thêm dòng"}
      />

      {values.length === 0 ? (
        <p className="company-information-page__empty-hint">Chưa có mục nào.</p>
      ) : (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {values.map((value, index) => (
            <div
              className="company-information-page__inline-field"
              key={`${title}-${index}`}
            >
              <Input
                value={value}
                onChange={(event) => handleUpdate(index, event.target.value)}
                placeholder={`${placeholder} ${index + 1}`}
              />
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(index)}
                aria-label={`Xóa mục ${index + 1}`}
              />
            </div>
          ))}
        </Space>
      )}

      <Modal
        title={addModalTitle ?? `Thêm — ${title}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Thêm"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="value"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input placeholder={placeholder} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
