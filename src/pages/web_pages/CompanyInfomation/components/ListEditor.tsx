import { Button, Input, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

type ListEditorProps = {
  title: string;
  values: string[];
  placeholder: string;
  onChange: (nextValues: string[]) => void;
};

export const ListEditor = ({
  title,
  values,
  placeholder,
  onChange,
}: ListEditorProps) => {
  const handleUpdate = (index: number, nextValue: string) => {
    const nextValues = [...values];
    nextValues[index] = nextValue;
    onChange(nextValues);
  };

  const handleAdd = () => {
    onChange([...values, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <section className="company-information-page__section-card">
      <h3>{title}</h3>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {values.map((value, index) => (
          <div className="company-information-page__inline-field" key={`${title}-${index}`}>
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

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="company-information-page__add-btn"
        >
          Thêm dòng
        </Button>
      </Space>
    </section>
  );
};
