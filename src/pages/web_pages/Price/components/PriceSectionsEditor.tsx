import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
} from "antd";
import { useState, type ReactNode } from "react";
import { SectionCardHeader } from "../../CompanyInfomation/components/SectionCardHeader";
import { PriceTableGridEditor } from "./PriceTableGridEditor";
import "../style.scss";
import type {
  PriceDetailSection,
  PriceSectionDescription,
} from "../types";
import { ensureDescription } from "../migrateContent";

type PriceSectionsEditorProps = {
  values: PriceDetailSection[];
  onChange: (next: PriceDetailSection[]) => void;
};

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const emptyDescription = (type: "text" | "table"): PriceSectionDescription =>
  type === "table"
    ? {
        id: newId("desc"),
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
      }
    : {
        id: newId("desc"),
        type: "text",
        icon: "",
        text: "",
        boldParts: [],
        headers: null,
        cellRows: null,
      };

export const PriceSectionsEditor = ({ values, onChange }: PriceSectionsEditorProps) => {
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sectionForm] = Form.useForm<PriceDetailSection>();

  const openCreateSection = () => {
    setEditingIndex(null);
    sectionForm.setFieldsValue({
      id: newId("sec"),
      title: "",
      sortIndex: values.length + 1,
      active: true,
      description: [emptyDescription("text")],
    });
    setSectionModalOpen(true);
  };

  const openEditSection = (index: number) => {
    setEditingIndex(index);
    sectionForm.setFieldsValue(values[index]);
    setSectionModalOpen(true);
  };

  const handleSectionSubmit = async () => {
    const fields = await sectionForm.validateFields();
    const nextSection: PriceDetailSection = {
      id: fields.id.trim(),
      title: fields.title.trim(),
      sortIndex: fields.sortIndex,
      active: fields.active ?? true,
      description: (fields.description ?? []).map((desc) =>
        ensureDescription({
          ...desc,
          id: desc.id?.trim() || newId("desc"),
          type: desc.type === "table" ? "table" : "text",
        }),
      ),
    };

    if (editingIndex === null) {
      onChange([...values, nextSection].sort((a, b) => a.sortIndex - b.sortIndex));
    } else {
      const next = [...values];
      next[editingIndex] = nextSection;
      onChange(next.sort((a, b) => a.sortIndex - b.sortIndex));
    }
    setSectionModalOpen(false);
  };

  const updateSection = (index: number, patch: Partial<PriceDetailSection>) => {
    const next = [...values];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const updateDescription = (
    sectionIndex: number,
    descIndex: number,
    patch: Partial<PriceSectionDescription>,
  ) => {
    const section = values[sectionIndex];
    const description = [...section.description];
    description[descIndex] = { ...description[descIndex], ...patch };
    updateSection(sectionIndex, { description });
  };

  const handleRemoveSection = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <section className="company-information-page__section-card">
      <SectionCardHeader
        title="Các khối nội dung (sections)"
        onAddClick={openCreateSection}
        addTooltip="Thêm section"
      />
      <p className="company-information-page__quick-links-hint">
        Tiêu đề section quyết định kiểu hiển thị (sortIndex 1 = tiêu đề chính, *** = disclaimer,
        TRÂN TRỌNG = lời kết). Mô tả có thể là <strong>text</strong> hoặc <strong>table</strong>.
      </p>

      {values.length === 0 ? (
        <p className="company-information-page__empty-hint">Chưa có section.</p>
      ) : (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {values.map((section, sectionIndex) => (
            <div className="company-information-page__group" key={section.id}>
              <div className="company-information-page__group-actions">
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveSection(sectionIndex)}
                  aria-label="Xóa section"
                />
              </div>

              <div className="company-information-page__section-header">
                <h3>
                  {section.title || "(Chưa có tiêu đề)"}{" "}
                  <TagMuted>
                    #{section.sortIndex} · {section.active ? "Hiển thị" : "Ẩn"}
                  </TagMuted>
                </h3>
                <Button size="small" onClick={() => openEditSection(sectionIndex)}>
                  Sửa section
                </Button>
              </div>

              {section.description.map((desc, descIndex) => (
                <DescriptionEditor
                  key={desc.id}
                  desc={desc}
                  onChange={(patch) =>
                    updateDescription(sectionIndex, descIndex, patch)
                  }
                  onRemove={() => {
                    updateSection(sectionIndex, {
                      description: section.description.filter(
                        (_, i) => i !== descIndex,
                      ),
                    });
                  }}
                  canRemove={section.description.length > 1}
                />
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                className="company-information-page__add-section-btn"
                onClick={() => {
                  updateSection(sectionIndex, {
                    description: [
                      ...section.description,
                      emptyDescription("text"),
                    ],
                  });
                }}
              >
                Thêm mô tả
              </Button>
            </div>
          ))}
        </Space>
      )}

      <Modal
        title={editingIndex === null ? "Thêm section" : "Sửa section"}
        open={sectionModalOpen}
        onCancel={() => setSectionModalOpen(false)}
        onOk={handleSectionSubmit}
        okText="Lưu"
        cancelText="Huỷ"
        destroyOnClose
        width={800}
      >
        <Form form={sectionForm} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề section"
            rules={[{ required: true, message: "Nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="sortIndex" label="Thứ tự (sortIndex)">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.List name="description">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Form.Item key={field.key} label={`Mô tả #${field.name + 1}`}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Form.Item {...field} name={[field.name, "id"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, "type"]} label="Loại">
                        <Select
                          options={[
                            { value: "text", label: "Văn bản" },
                            { value: "table", label: "Bảng" },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, "text"]} label="Nội dung text">
                        <Input.TextArea rows={2} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "boldParts"]}
                        label="In đậm (phân tách bằng dấu phẩy)"
                        getValueFromEvent={(e: { target: { value: string } }) =>
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        }
                        getValueProps={(val: string[]) => ({
                          value: (val ?? []).join(", "),
                        })}
                      >
                        <Input placeholder="minh bạch, uy tín" />
                      </Form.Item>
                      <Button danger type="link" onClick={() => remove(field.name)}>
                        Xóa mô tả
                      </Button>
                    </Space>
                  </Form.Item>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add(emptyDescription("text"))}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm mô tả
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </section>
  );
};

const TagMuted = ({ children }: { children: ReactNode }) => (
  <span className="price-section-editor__tag-muted">{children}</span>
);

type DescriptionEditorProps = {
  desc: PriceSectionDescription;
  onChange: (patch: Partial<PriceSectionDescription>) => void;
  onRemove: () => void;
  canRemove: boolean;
};

const DescriptionEditor = ({
  desc,
  onChange,
  onRemove,
  canRemove,
}: DescriptionEditorProps) => {
  return (
    <div className="price-section-editor__desc">
      <div className="price-section-editor__desc-header">
        <Select
          size="small"
          value={desc.type}
          style={{ width: 120 }}
          onChange={(type: "text" | "table") => {
            if (type === "table") {
              onChange(emptyDescription("table"));
              return;
            }
            onChange({
              type: "text",
              headers: null,
              cellRows: null,
              text: desc.text,
            });
          }}
          options={[
            { value: "text", label: "Văn bản" },
            { value: "table", label: "Bảng" },
          ]}
        />
        <Button
          danger
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          disabled={!canRemove}
          onClick={onRemove}
        />
      </div>

      {desc.type === "text" ? (
        <>
          <Input.TextArea
            rows={3}
            value={desc.text}
            placeholder="Nội dung đoạn văn"
            onChange={(e) => onChange({ text: e.target.value })}
          />
          <Input
            size="small"
            placeholder="In đậm: cụm1, cụm2"
            value={(desc.boldParts ?? []).join(", ")}
            onChange={(e) =>
              onChange({
                boldParts: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </>
      ) : (
        <PriceTableGridEditor
          headers={desc.headers}
          cellRows={desc.cellRows}
          onChange={(nextHeaders, nextCellRows) =>
            onChange({ headers: nextHeaders, cellRows: nextCellRows })
          }
        />
      )}
    </div>
  );
};
