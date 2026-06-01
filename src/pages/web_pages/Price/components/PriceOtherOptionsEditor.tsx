import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { ImageUploadField } from "../../CompanyInfomation/components/ImageUploadField";
import { SectionCardHeader } from "../../CompanyInfomation/components/SectionCardHeader";
import type { PriceOtherOption } from "../types";

type PriceOtherOptionsEditorProps = {
  values: PriceOtherOption[];
  onChange: (next: PriceOtherOption[]) => void;
};

const newId = () => `opt-${Math.random().toString(36).slice(2, 10)}`;

export const PriceOtherOptionsEditor = ({
  values,
  onChange,
}: PriceOtherOptionsEditorProps) => {
  const updateItem = (index: number, next: PriceOtherOption) => {
    const copy = [...values];
    copy[index] = next;
    onChange(copy);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([
      ...values,
      { id: newId(), icon: "", image: "", type: "info", value: "" },
    ]);
  };

  return (
    <section className="company-information-page__section-card">
      <SectionCardHeader
        title="Banner thông tin (otherOptions)"
        onAddClick={handleAdd}
        addTooltip="Thêm banner"
      />
      <p className="company-information-page__quick-links-hint">
        Khớp frontend <code>Alert</code> hiển thị phía trên nội dung bảng giá.
      </p>

      {values.length === 0 ? (
        <p className="company-information-page__empty-hint">Chưa có banner.</p>
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
                  aria-label="Xóa"
                />
              </div>
              <Form layout="vertical">
                <Form.Item label="Nội dung (value)">
                  <Input.TextArea
                    rows={2}
                    value={item.value}
                    onChange={(e) =>
                      updateItem(index, { ...item, value: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="Icon (URL ảnh)">
                  <ImageUploadField
                    value={item.icon}
                    onChange={(icon) => updateItem(index, { ...item, icon })}
                  />
                </Form.Item>
              </Form>
            </div>
          ))}
        </Space>
      )}

      {values.length === 0 ? (
        <div className="company-information-page__empty-add">
          <Button icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm banner
          </Button>
        </div>
      ) : null}
    </section>
  );
};
