import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Space, Tag, Tooltip } from "antd";
import type { PriceDetailSection, PriceSectionDescription } from "../types";
import { PriceTableGridEditor } from "./PriceTableGridEditor";

const newDescId = () => `desc-${Math.random().toString(36).slice(2, 10)}`;

const emptyTextDesc = (): PriceSectionDescription => ({
  id: newDescId(),
  type: "text",
  icon: "",
  text: "",
  boldParts: [],
  headers: null,
  cellRows: null,
});

const emptyTableDesc = (): PriceSectionDescription => ({
  id: newDescId(),
  type: "table",
  icon: "",
  text: "",
  boldParts: [],
  headers: ["Cột 1", "Cột 2"],
  cellRows: [
    [
      { text: "", colspan: null, rowspan: null, startRow: 0 },
      { text: "", colspan: null, rowspan: null, startRow: 0 },
    ],
  ],
});

const getSectionMode = (section: PriceDetailSection): "text" | "table" => {
  const first = section.description[0];
  return first?.type === "table" ? "table" : "text";
};

type PriceSectionCardProps = {
  section: PriceDetailSection;
  onChange: (next: PriceDetailSection) => void;
  onRemove: () => void;
};

export const PriceSectionCard = ({ section, onChange, onRemove }: PriceSectionCardProps) => {
  const mode = getSectionMode(section);

  const updateTitle = (title: string) => {
    onChange({ ...section, title });
  };

  const updateDescription = (index: number, patch: Partial<PriceSectionDescription>) => {
    const description = [...section.description];
    description[index] = { ...description[index], ...patch };
    onChange({ ...section, description });
  };

  const removeDescription = (index: number) => {
    onChange({
      ...section,
      description: section.description.filter((_, i) => i !== index),
    });
  };

  const addTextBlock = () => {
    onChange({
      ...section,
      description: [...section.description, emptyTextDesc()],
    });
  };

  const addTableBlock = () => {
    onChange({
      ...section,
      description: [...section.description, emptyTableDesc()],
    });
  };

  return (
    <article className="price-section-card">
      <header className="price-section-card__header">
        <div className="price-section-card__header-main">
          <Input
            value={section.title}
            placeholder="Tiêu đề section"
            onChange={(e) => updateTitle(e.target.value)}
            className="price-section-card__title-input"
          />
          <Space size={6} wrap>
            <Tag>#{section.sortIndex}</Tag>
            <Tag color={mode === "table" ? "blue" : "default"}>
              {mode === "table" ? "Bảng" : "Văn bản"}
            </Tag>
            {!section.active ? <Tag color="default">Ẩn</Tag> : null}
          </Space>
        </div>
        <Tooltip title="Xóa section">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            aria-label="Xóa section"
            onClick={onRemove}
          />
        </Tooltip>
      </header>

      <div className="price-section-card__body">
        {section.description.length === 0 ? (
          <p className="company-information-page__empty-hint">
            Section chỉ có tiêu đề (vd. disclaimer *** hoặc TRÂN TRỌNG).
          </p>
        ) : null}

        {mode === "text"
          ? section.description.map((desc, index) => (
              <div key={desc.id} className="price-section-card__block">
                <div className="price-section-card__block-label">
                  <span>Đoạn văn bản {index + 1}</span>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    disabled={section.description.length <= 1}
                    onClick={() => removeDescription(index)}
                  />
                </div>
                <Input.TextArea
                  rows={4}
                  value={desc.text}
                  placeholder="Nhập HTML hoặc văn bản..."
                  onChange={(e) => updateDescription(index, { text: e.target.value })}
                />
                <Input
                  size="small"
                  placeholder="In đậm: cụm1, cụm2"
                  value={(desc.boldParts ?? []).join(", ")}
                  onChange={(e) =>
                    updateDescription(index, {
                      boldParts: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            ))
          : section.description.map((desc, index) => (
              <div key={desc.id} className="price-section-card__block">
                <div className="price-section-card__block-label">
                  <span>Bảng {section.description.length > 1 ? index + 1 : ""}</span>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    disabled={section.description.length <= 1}
                    onClick={() => removeDescription(index)}
                  />
                </div>
                <PriceTableGridEditor
                  headers={desc.headers}
                  cellRows={desc.cellRows}
                  onChange={(headers, cellRows) =>
                    updateDescription(index, { headers, cellRows })
                  }
                />
              </div>
            ))}

        {mode === "text" ? (
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            className="company-information-page__add-section-btn"
            onClick={addTextBlock}
          >
            Thêm đoạn văn bản
          </Button>
        ) : (
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            className="company-information-page__add-section-btn"
            onClick={addTableBlock}
          >
            Thêm bảng
          </Button>
        )}
      </div>
    </article>
  );
};
