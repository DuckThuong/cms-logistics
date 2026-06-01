import { anchorFromTitle } from "@/common/utils/anchor";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import type { ContentSectionItem } from "../types";
import { ImageUploadField } from "./ImageUploadField";
import { SectionCardHeader } from "./SectionCardHeader";

type SectionsEditorProps = {
  title: string;
  values: ContentSectionItem[];
  onChange: (nextValues: ContentSectionItem[]) => void;
};

const newId = () => `sec-${Math.random().toString(36).slice(2, 10)}`;

export const SectionsEditor = ({ title, values, onChange }: SectionsEditorProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<ContentSectionItem>();

  const updateItem = (index: number, nextItem: ContentSectionItem) => {
    const nextValues = [...values];
    nextValues[index] = nextItem;
    onChange(nextValues);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  const openModal = () => {
    form.resetFields();
    form.setFieldsValue({
      id: newId(),
      anchor: "",
      title: "",
      description: "",
      content: "",
      imageUrl: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const fields = await form.validateFields();
    onChange([
      ...values,
      {
        id: fields.id.trim(),
        anchor: fields.anchor.trim(),
        title: fields.title.trim(),
        description: fields.description?.trim() ?? "",
        content: fields.content?.trim() ?? "",
        imageUrl: fields.imageUrl?.trim() ?? "",
      },
    ]);
    setModalOpen(false);
  };

  return (
    <section className="company-information-page__section-card">
      <SectionCardHeader title={title} onAddClick={openModal} addTooltip="Thêm khối nội dung" />

      {values.length === 0 ? (
        <p className="company-information-page__empty-hint">Chưa có khối nào.</p>
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
                  aria-label="Xóa khối"
                />
              </div>

              <div className="company-information-page__field-pair">
                <div className="company-information-page__inline-grid">
                  <Form.Item label="Tiêu đề khối" className="company-information-page__grid-field">
                    <Input
                      value={item.title}
                      placeholder="Tiêu đề khối"
                      onChange={(event) => {
                        const nextTitle = event.target.value;
                        updateItem(index, {
                          ...item,
                          title: nextTitle,
                          anchor: anchorFromTitle(nextTitle),
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Liên kết nhanh"
                    className="company-information-page__grid-field"
                  >
                    <Input
                      value={item.anchor}
                      placeholder="gioi-thieu-tong-quan"
                      onChange={(event) =>
                        updateItem(index, { ...item, anchor: event.target.value })
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              <Input.TextArea
                value={item.description}
                rows={2}
                placeholder="Mô tả ngắn"
                onChange={(event) =>
                  updateItem(index, { ...item, description: event.target.value })
                }
              />

              <Input.TextArea
                value={item.content}
                rows={5}
                placeholder="Nội dung chi tiết (có thể nhiều dòng)"
                onChange={(event) =>
                  updateItem(index, { ...item, content: event.target.value })
                }
              />

              <ImageUploadField
                label="Ảnh minh hoạ (tuỳ chọn)"
                value={item.imageUrl}
                onChange={(nextValue) => updateItem(index, { ...item, imageUrl: nextValue })}
              />
            </div>
          ))}
        </Space>
      )}

      <Modal
        title={`Thêm khối — ${title}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Thêm"
        cancelText="Hủy"
        destroyOnClose
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ("title" in changedValues) {
              form.setFieldValue(
                "anchor",
                anchorFromTitle(String(changedValues.title ?? "")),
              );
            }
          }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <div className="company-information-page__inline-grid">
            <Form.Item
              name="title"
              label="Tiêu đề khối"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Tiêu đề khối" />
            </Form.Item>
            <Form.Item
              name="anchor"
              label="Liên kết nhanh"
              rules={[{ required: true, message: "Vui lòng nhập liên kết nhanh" }]}
            >
              <Input placeholder="gioi-thieu-tong-quan" />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Mô tả ngắn">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn" />
          </Form.Item>
          <Form.Item name="content" label="Nội dung chi tiết">
            <Input.TextArea rows={4} placeholder="Nội dung chi tiết" />
          </Form.Item>
          <Form.Item name="imageUrl" label="Ảnh minh hoạ (tuỳ chọn)">
            <ImageUploadField />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};
