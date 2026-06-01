import { Button, Input, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ExtraFieldItem } from "../types";

type ExtraFieldsEditorProps = {
  title: string;
  values: ExtraFieldItem[];
  onChange: (nextValues: ExtraFieldItem[]) => void;
};

const newId = () => `extra-${Math.random().toString(36).slice(2, 10)}`;

export const ExtraFieldsEditor = ({ title, values, onChange }: ExtraFieldsEditorProps) => {
  const updateItem = (index: number, nextItem: ExtraFieldItem) => {
    const nextValues = [...values];
    nextValues[index] = nextItem;
    onChange(nextValues);
  };

  const handleAdd = () => {
    onChange([
      ...values,
      {
        id: newId(),
        title: "",
        description: "",
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
          Thêm mục
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
    </section>
  );
};

