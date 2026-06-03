import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Switch } from "antd";
import { useState, type ReactNode } from "react";
import { SectionCardHeader } from "../../CompanyInfomation/components/SectionCardHeader";
import { ImageUploadField } from "../../CompanyInfomation/components/ImageUploadField";
import type { NewsDetailSection, NewsSectionDescription } from "@/common/types/news";
import {
  isNewsTextImgType,
  NEWS_DESCRIPTION_TYPE_OPTIONS,
  NEWS_TEXT_IMG_TYPE,
  type NewsDescriptionType,
} from "@/common/constants/newsDescriptionTypes";
import { DEFAULT_DESCRIPTION_TYPE } from "@/common/utils/companyInformationSection";
import {
  isServiceDescriptionBold,
  serviceDescriptionHeadersForBold,
} from "@/common/utils/serviceDescriptionHeaders";

const { TextArea } = Input;

const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const emptyDescription = (type: NewsDescriptionType = DEFAULT_DESCRIPTION_TYPE): NewsSectionDescription => ({
  id: newId("desc"),
  text: "",
  type,
  img: "",
  headers: null,
});

const resolveDescriptionType = (type?: string): NewsDescriptionType => {
  const found = NEWS_DESCRIPTION_TYPE_OPTIONS.find((opt) => opt.value === type);
  return found?.value ?? DEFAULT_DESCRIPTION_TYPE;
};

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

type DescriptionRowEditorProps = {
  desc: NewsSectionDescription;
  descIndex: number;
  sectionIndex: number;
  descriptions: NewsSectionDescription[];
  onUpdate: (sectionIndex: number, descriptions: NewsSectionDescription[]) => void;
};

const DescriptionRowEditor = ({
  desc,
  descIndex,
  sectionIndex,
  descriptions,
  onUpdate,
}: DescriptionRowEditorProps) => {
  const descType = resolveDescriptionType(desc.type);
  const isTextImg = isNewsTextImgType(descType);

  const patchDesc = (patch: Partial<NewsSectionDescription>) => {
    const nextDescriptions = [...descriptions];
    nextDescriptions[descIndex] = { ...desc, ...patch };
    onUpdate(sectionIndex, nextDescriptions);
  };

  return (
    <Form.Item
      label={
        isTextImg
          ? `Ảnh + chú thích ${descIndex + 1} (text-img)`
          : `Nội dung ${descIndex + 1}`
      }
      className="company-information-page__content-field"
    >
      <div className="company-information-page__content-rows">
        <div
          className="company-information-page__content-row"
          style={isTextImg ? { flexWrap: "wrap", alignItems: "flex-start" } : undefined}
        >
          <Select
            className="company-information-page__content-type-select"
            value={descType}
            options={[...NEWS_DESCRIPTION_TYPE_OPTIONS]}
            onChange={(type) => {
              const nextType = type as NewsDescriptionType;
              patchDesc({
                type: nextType,
                img: isNewsTextImgType(nextType) ? desc.img ?? "" : "",
              });
            }}
          />
          {isTextImg ? (
            <div style={{ flex: "1 1 100%", width: "100%" }}>
              <Form.Item label="Đường dẫn ảnh (img)" style={{ marginBottom: 8 }}>
                <ImageUploadField
                  value={desc.img ?? ""}
                  onChange={(img) => patchDesc({ img })}
                />
              </Form.Item>
              <Form.Item label="Chú thích (text)" style={{ marginBottom: 0 }}>
                <TextArea
                  value={desc.text}
                  rows={2}
                  placeholder="Mô tả ảnh hiển thị dưới hình"
                  onChange={(event) => patchDesc({ text: event.target.value })}
                />
              </Form.Item>
            </div>
          ) : (
            <Input
              value={desc.text}
              placeholder={`Dòng ${descIndex + 1}`}
              onChange={(event) => patchDesc({ text: event.target.value })}
            />
          )}
          {!isTextImg ? (
            <BoldHeaderSwitch
              value={desc.headers}
              onChange={(headers) => patchDesc({ headers })}
            />
          ) : null}
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            disabled={descriptions.length <= 1}
            onClick={() => {
              onUpdate(
                sectionIndex,
                descriptions.filter((_, i) => i !== descIndex),
              );
            }}
          />
        </div>
      </div>
    </Form.Item>
  );
};

type NewsSectionsEditorProps = {
  values: NewsDetailSection[];
  onChange: (nextValues: NewsDetailSection[]) => void;
};

export const NewsSectionsEditor = ({ values, onChange }: NewsSectionsEditorProps) => {
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sectionForm] = Form.useForm<NewsDetailSection>();

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

  const normalizeDescriptions = (
    descriptions: NewsSectionDescription[] | undefined,
  ): NewsSectionDescription[] =>
    (descriptions ?? []).map((desc) => ({
      id: desc.id?.trim() || newId("desc"),
      text: desc.text ?? "",
      type: desc.type?.trim() || DEFAULT_DESCRIPTION_TYPE,
      img: isNewsTextImgType(desc.type) ? desc.img?.trim() ?? "" : "",
      headers: desc.headers?.length ? desc.headers : null,
    }));

  const handleSectionSubmit = async () => {
    const fields = await sectionForm.validateFields();
    const nextSection: NewsDetailSection = {
      id: fields.id.trim(),
      title: fields.title.trim(),
      sortIndex: fields.sortIndex,
      active: fields.active ?? true,
      descriptions: normalizeDescriptions(fields.descriptions),
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
    descriptions: NewsSectionDescription[],
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
        title="Các khối nội dung"
        onAddClick={openCreateSection}
        addTooltip="Thêm section"
      />
      <p className="company-information-page__quick-links-hint">
        Khớp frontend <code>NewDetailPage</code>: loại <code>text-img</code> cần{" "}
        <strong>img</strong> (URL ảnh) và <strong>text</strong> (chú thích). Các loại khác
        dùng <code>text</code>, <code>text-bullet</code>, <code>text-number</code>.
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
                  <DescriptionRowEditor
                    key={desc.id}
                    desc={desc}
                    descIndex={descIndex}
                    sectionIndex={sectionIndex}
                    descriptions={section.descriptions}
                    onUpdate={updateDescriptions}
                  />
                ))}
                <Space wrap>
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
                  <Button
                    type="dashed"
                    onClick={() => {
                      updateDescriptions(sectionIndex, [
                        ...section.descriptions,
                        emptyDescription(NEWS_TEXT_IMG_TYPE),
                      ]);
                    }}
                  >
                    Thêm ảnh (text-img)
                  </Button>
                </Space>
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
        width={760}
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
                  <ModalDescriptionFields
                    key={field.key}
                    field={field}
                    form={sectionForm}
                    onRemove={() => remove(field.name)}
                  />
                ))}
                <Space wrap style={{ width: "100%" }}>
                  <Button
                    type="dashed"
                    onClick={() => add(emptyDescription())}
                    icon={<PlusOutlined />}
                  >
                    Thêm đoạn
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => add(emptyDescription(NEWS_TEXT_IMG_TYPE))}
                  >
                    Thêm text-img
                  </Button>
                </Space>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </section>
  );
};

type ModalDescriptionFieldsProps = {
  field: { key: React.Key; name: number };
  form: ReturnType<typeof Form.useForm<NewsDetailSection>>[0];
  onRemove: () => void;
};

const ModalDescriptionFields = ({
  field,
  form,
  onRemove,
}: ModalDescriptionFieldsProps) => {
  const descType = Form.useWatch(
    ["descriptions", field.name, "type"],
    form,
  ) as string | undefined;
  const isTextImg = isNewsTextImgType(descType);

  return (
    <div
      style={{
        marginBottom: 16,
        padding: 12,
        border: "1px solid #e8eaf0",
        borderRadius: 8,
      }}
    >
      <Space align="start" style={{ display: "flex", width: "100%" }} wrap>
        <Form.Item {...field} name={[field.name, "id"]} hidden>
          <Input />
        </Form.Item>
        <Form.Item
          {...field}
          name={[field.name, "type"]}
          label="Loại"
          initialValue={DEFAULT_DESCRIPTION_TYPE}
          style={{ marginBottom: 0, width: 160 }}
        >
          <Select options={[...NEWS_DESCRIPTION_TYPE_OPTIONS]} />
        </Form.Item>
        {isTextImg ? (
          <div style={{ flex: "1 1 100%" }}>
            <Form.Item
              {...field}
              name={[field.name, "img"]}
              label="Đường dẫn ảnh (img)"
              style={{ marginBottom: 8 }}
            >
              <ImageUploadField />
            </Form.Item>
            <Form.Item
              {...field}
              name={[field.name, "text"]}
              label="Chú thích (text)"
              style={{ marginBottom: 0 }}
            >
              <TextArea rows={2} placeholder="Mô tả dưới ảnh" />
            </Form.Item>
          </div>
        ) : (
          <>
            <Form.Item
              {...field}
              name={[field.name, "text"]}
              label="Nội dung"
              style={{ flex: 1, marginBottom: 0, minWidth: 200 }}
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
          </>
        )}
        <Button danger type="text" icon={<DeleteOutlined />} onClick={onRemove} />
      </Space>
    </div>
  );
};

const TagMuted = ({ children }: { children: ReactNode }) => (
  <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>{children}</span>
);
