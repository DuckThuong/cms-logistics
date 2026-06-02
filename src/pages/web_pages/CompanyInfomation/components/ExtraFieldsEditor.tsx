import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import type { ExtraFieldItem } from "@/common/types/companyInformation";
import { SectionCardHeader } from "./SectionCardHeader";

type ExtraFieldsEditorProps = {
  title: string;
  values: ExtraFieldItem[];
  onChange: (nextValues: ExtraFieldItem[]) => void;
};

const newId = () => `extra-${Math.random().toString(36).slice(2, 10)}`;

export const ExtraFieldsEditor = ({ title, values, onChange }: ExtraFieldsEditorProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<{ id: string; title: string; description: string }>();

  const updateItem = (index: number, nextItem: ExtraFieldItem) => {
    const nextValues = [...values];
    nextValues[index] = nextItem;
    onChange(nextValues);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  const openModal = () => {
    form.resetFields();
    form.setFieldsValue({ id: newId() });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const fields = await form.validateFields();
    onChange([
      ...values,
      {
        id: fields.id.trim(),
        title: fields.title.trim(),
        description: fields.description?.trim() ?? "",
      },
    ]);
    setModalOpen(false);
  };

  return (
    <section className="company-information-page__section-card">
      <SectionCardHeader title={title} onAddClick={openModal} addTooltip="Thêm mục bổ sung" />

      {values.length === 0 ? (
        <p className="company-information-page__empty-hint">Chưa có mục nào.</p>
      ) : (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {values.map((item, index) => (
            <div className="company-information-page__group" key={item.id}>
              <div className="company-information-page__group-actions">
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(index)}
                  aria-label="Xóa mục"
                />
              </div>

              <div className="company-information-page__inline-grid">
                <Input
                  value={item.title}
                  placeholder="Tiêu đề"
                  onChange={(event) =>
                    updateItem(index, { ...item, title: event.target.value })
                  }
                />
                <Input
                  value={item.id}
                  placeholder="Mã (unique)"
                  onChange={(event) =>
                    updateItem(index, { ...item, id: event.target.value })
                  }
                />
              </div>
              <Input.TextArea
                value={item.description}
                rows={3}
                placeholder="Mô tả / nội dung"
                onChange={(event) =>
                  updateItem(index, { ...item, description: event.target.value })
                }
              />
            </div>
          ))}
        </Space>
      )}

      <Modal
        title={`Thêm — ${title}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Thêm"
        cancelText="Hủy"
        destroyOnClose
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Tiêu đề" />
          </Form.Item>
          <Form.Item
            name="id"
            label="Mã (unique)"
            rules={[{ required: true, message: "Vui lòng nhập mã" }]}
          >
            <Input placeholder="Mã unique" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả / nội dung">
            <Input.TextArea rows={3} placeholder="Mô tả / nội dung" />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};
