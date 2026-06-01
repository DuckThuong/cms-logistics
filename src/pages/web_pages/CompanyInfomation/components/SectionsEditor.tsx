import { Button, Input, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ContentSectionItem } from "../types";
import { ImageUploadField } from "./ImageUploadField";

type SectionsEditorProps = {
  title: string;
  values: ContentSectionItem[];
  onChange: (nextValues: ContentSectionItem[]) => void;
};

const newId = () => `sec-${Math.random().toString(36).slice(2, 10)}`;

export const SectionsEditor = ({ title, values, onChange }: SectionsEditorProps) => {
  const updateItem = (index: number, nextItem: ContentSectionItem) => {
    const nextValues = [...values];
    nextValues[index] = nextItem;
    onChange(nextValues);
  };

  const handleAdd = () => {
    onChange([
      ...values,
      {
        id: newId(),
        anchor: "#",
        title: "",
        description: "",
        content: "",
        imageUrl: "",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  return (
    <section className="company-information-page__section-card">
      <div className="company-information-page__section-header">
        <h3>{title}</h3>
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm khối
        </Button>
      </div>

      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {values.map((item, index) => (
          <div className="company-information-page__group" key={item.id}>
            <div className="company-information-page__group-actions">
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(index)}
              />
            </div>

            <div className="company-information-page__inline-grid">
              <Input
                value={item.title}
                placeholder="Tiêu đề khối"
                onChange={(event) =>
                  updateItem(index, { ...item, title: event.target.value })
                }
              />
              <Input
                value={item.anchor}
                placeholder="#anchor (vd: #gioi-thieu)"
                onChange={(event) =>
                  updateItem(index, { ...item, anchor: event.target.value })
                }
              />
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
    </section>
  );
};

