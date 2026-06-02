import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import {
  ABOUT_OPTION_TYPES,
  type AboutOtherOption,
} from "@/common/types/companyInformation";
import { IconStringField } from "./IconStringField";
import { SectionCardHeader } from "./SectionCardHeader";

type HighlightListEditorProps = {
  values: AboutOtherOption[];
  onChange: (nextValues: AboutOtherOption[]) => void;
};

const newId = () => `hl-${Math.random().toString(36).slice(2, 10)}`;

export const HighlightListEditor = ({ values, onChange }: HighlightListEditorProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<{ id: string; value: string; icon: string }>();

  const openModal = () => {
    form.resetFields();
    form.setFieldsValue({ id: newId(), icon: "" });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const fields = await form.validateFields();
    onChange([
      ...values,
      {
        id: fields.id.trim(),
        type: ABOUT_OPTION_TYPES.highlight,
        value: fields.value.trim(),
        icon: fields.icon?.trim() ?? "",
      },
    ]);
    setModalOpen(false);
  };

  const updateItem = (index: number, nextItem: AboutOtherOption) => {
    const nextValues = [...values];
    nextValues[index] = nextItem;
    onChange(nextValues);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  return (
    <section className="company-information-page__section-card">
      <SectionCardHeader
        title="Điểm nổi bật (otherOptions — options)"
        onAddClick={openModal}
        addTooltip="Thêm điểm nổi bật"
      />

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
                  value={item.id}
                  placeholder="ID"
                  onChange={(event) =>
                    updateItem(index, { ...item, id: event.target.value })
                  }
                />
                <Input
                  value={item.value}
                  placeholder="Nhãn hiển thị (value)"
                  onChange={(event) =>
                    updateItem(index, { ...item, value: event.target.value })
                  }
                />
              </div>
              <Form.Item label="Icon" className="company-information-page__grid-field">
                <IconStringField
                  value={item.icon}
                  onChange={(icon) => updateItem(index, { ...item, icon })}
                />
              </Form.Item>
            </div>
          ))}
        </Space>
      )}

      <Modal
        title="Thêm điểm nổi bật"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Thêm"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: "Vui lòng nhập ID" }]}
          >
            <Input placeholder="vd: hl-experience" />
          </Form.Item>
          <Form.Item
            name="value"
            label="Nhãn hiển thị (value)"
            rules={[{ required: true, message: "Vui lòng nhập nhãn" }]}
          >
            <Input placeholder="10+ năm kinh nghiệm" />
          </Form.Item>
          <Form.Item name="icon" label="Icon (URL hoặc emoji)">
            <Input placeholder="https://... hoặc 🚚" />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};
