import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Switch } from "antd";
import { useState, type ReactNode } from "react";
import { SectionCardHeader } from "../../CompanyInfomation/components/SectionCardHeader";
import type { ServiceDetailSection, ServiceSectionDescription } from "@/common/types/service";

type ServiceSectionsEditorProps = {
  values: ServiceDetailSection[];
  onChange: (nextValues: ServiceDetailSection[]) => void;
};

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const ServiceSectionsEditor = ({
  values,
  onChange,
}: ServiceSectionsEditorProps) => {
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sectionForm] = Form.useForm<ServiceDetailSection>();

  const openCreateSection = () => {
    setEditingIndex(null);
    sectionForm.resetFields();
    sectionForm.setFieldsValue({
      id: newId("sec"),
      title: "",
      sortIndex: values.length + 1,
      active: true,
      descriptions: [{ id: newId("desc"), text: "<p></p>" }],
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
    const nextSection: ServiceDetailSection = {
      id: fields.id.trim(),
      title: fields.title.trim(),
      sortIndex: fields.sortIndex,
      active: fields.active ?? true,
      descriptions: (fields.descriptions ?? []).map((desc, index) => ({
        id: desc.id?.trim() || newId("desc"),
        text: desc.text ?? "",
      })),
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

  const updateDescriptions = (
    sectionIndex: number,
    descriptions: ServiceSectionDescription[],
  ) => {
    const next = [...values];
    next[sectionIndex] = { ...next[sectionIndex], descriptions };
    onChange(next);
  };

  const handleRemoveSection = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  return (
    <section className="company-information-page__section-card">
      <SectionCardHeader
        title="Các khối nội dung (sections)"
        onAddClick={openCreateSection}
        addTooltip="Thêm section"
      />
      <p className="company-information-page__quick-links-hint">
        Mỗi section có tiêu đề và các đoạn HTML — khớp frontend{" "}
        <code>serviceContent.sections</code> / <code>description[].text</code>.
      </p>

      {values.length === 0 ? (
        <p className="company-information-page__empty-hint">Chưa có section nào.</p>
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

              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {section.descriptions.map((desc, descIndex) => (
                  <Form.Item
                    key={desc.id}
                    label={`Đoạn HTML ${descIndex + 1}`}
                    className="company-information-page__content-field"
                  >
                    <div className="company-information-page__content-rows">
                      <div className="company-information-page__content-row">
                        <Input.TextArea
                          value={desc.text}
                          rows={4}
                          onChange={(event) => {
                            const nextDescriptions = [...section.descriptions];
                            nextDescriptions[descIndex] = {
                              ...desc,
                              text: event.target.value,
                            };
                            updateDescriptions(sectionIndex, nextDescriptions);
                          }}
                        />
                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          disabled={section.descriptions.length <= 1}
                          onClick={() => {
                            updateDescriptions(
                              sectionIndex,
                              section.descriptions.filter((_, i) => i !== descIndex),
                            );
                          }}
                        />
                      </div>
                    </div>
                  </Form.Item>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  className="company-information-page__add-section-btn"
                  onClick={() => {
                    updateDescriptions(sectionIndex, [
                      ...section.descriptions,
                      { id: newId("desc"), text: "<p></p>" },
                    ]);
                  }}
                >
                  Thêm đoạn HTML
                </Button>
              </Space>
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
        width={720}
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
          <Form.Item name="sortIndex" label="Thứ tự">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.List name="descriptions">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    align="start"
                    style={{ display: "flex", marginBottom: 8 }}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "id"]}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "text"]}
                      label="HTML"
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input.TextArea rows={3} placeholder="<p>...</p>" />
                    </Form.Item>
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ id: newId("desc"), text: "<p></p>" })}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm đoạn
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
  <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>{children}</span>
);
