import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Switch } from "antd";
import { useState, type ReactNode } from "react";
import { SectionCardHeader } from "../../CompanyInfomation/components/SectionCardHeader";
import type { ServiceDetailSection, ServiceSectionDescription } from "@/common/types/service";
import type { AboutContentDescriptionType } from "@/common/utils/companyInformationSection";
import {
  ABOUT_CONTENT_DESCRIPTION_TYPES,
  DEFAULT_DESCRIPTION_TYPE,
} from "@/common/utils/companyInformationSection";
import {
  isServiceDescriptionBold,
  serviceDescriptionHeadersForBold,
} from "@/common/utils/serviceDescriptionHeaders";

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const DESCRIPTION_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "text-bullet", label: "Text bullet" },
] as const;

const emptyDescription = (): ServiceSectionDescription => ({
  id: newId("desc"),
  text: "",
  type: DEFAULT_DESCRIPTION_TYPE,
  headers: null,
});

type BoldHeaderSwitchProps = {
  value?: string[] | null;
  onChange?: (value: string[] | null) => void;
};

const BoldHeaderSwitch = ({ value, onChange }: BoldHeaderSwitchProps) => (
  <Switch
    checked={isServiceDescriptionBold(value)}
    checkedChildren="Đậm"
    unCheckedChildren="Thường"
    onChange={(checked) => onChange?.(serviceDescriptionHeadersForBold(checked))}
  />
);

type ServiceSectionsEditorProps = {
  values: ServiceDetailSection[];
  onChange: (nextValues: ServiceDetailSection[]) => void;
};

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
      descriptions: [emptyDescription()],
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
      descriptions: (fields.descriptions ?? []).map((desc) => ({
        id: desc.id?.trim() || newId("desc"),
        text: desc.text ?? "",
        type: desc.type?.trim() || DEFAULT_DESCRIPTION_TYPE,
        headers: desc.headers?.length ? desc.headers : null,
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

  const resolveDescriptionType = (type?: string): AboutContentDescriptionType =>
    ABOUT_CONTENT_DESCRIPTION_TYPES.includes(type as AboutContentDescriptionType)
      ? (type as AboutContentDescriptionType)
      : DEFAULT_DESCRIPTION_TYPE;

  const handleRemoveSection = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  return (
    <section className="company-information-page__section-card">
      <SectionCardHeader
        title="Các khối nội dung "
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
                    label={`Nội dung ${descIndex + 1}`}
                    className="company-information-page__content-field"
                  >
                    <div className="company-information-page__content-rows">
                      <div className="company-information-page__content-row">
                        <Select
                          className="company-information-page__content-type-select"
                          value={resolveDescriptionType(desc.type)}
                          options={[...DESCRIPTION_TYPE_OPTIONS]}
                          onChange={(type) => {
                            const nextDescriptions = [...section.descriptions];
                            nextDescriptions[descIndex] = {
                              ...desc,
                              type: type as AboutContentDescriptionType,
                            };
                            updateDescriptions(sectionIndex, nextDescriptions);
                          }}
                        />
                        <Input
                          value={desc.text}
                          placeholder={`Dòng ${descIndex + 1}`}
                          onChange={(event) => {
                            const nextDescriptions = [...section.descriptions];
                            nextDescriptions[descIndex] = {
                              ...desc,
                              text: event.target.value,
                            };
                            updateDescriptions(sectionIndex, nextDescriptions);
                          }}
                        />
                        <BoldHeaderSwitch
                          value={desc.headers}
                          onChange={(headers) => {
                            const nextDescriptions = [...section.descriptions];
                            nextDescriptions[descIndex] = { ...desc, headers };
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
                      emptyDescription(),
                    ]);
                  }}
                >
                  Thêm dòng nội dung
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
                    style={{ display: "flex", marginBottom: 8, width: "100%" }}
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
                      name={[field.name, "type"]}
                      label="Loại"
                      initialValue={DEFAULT_DESCRIPTION_TYPE}
                      style={{ marginBottom: 0, width: 140 }}
                    >
                      <Select options={[...DESCRIPTION_TYPE_OPTIONS]} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "text"]}
                      label="Nội dung"
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input placeholder="Nhập nội dung" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "headers"]}
                      label="In đậm"
                      style={{ marginBottom: 0 }}
                    >
                      <BoldHeaderSwitch />
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
                  onClick={() => add(emptyDescription())}
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
