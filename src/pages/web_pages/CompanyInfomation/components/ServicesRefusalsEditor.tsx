import { anchorFromTitle } from "@/common/utils/anchor";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import type { AboutSection } from "@/common/types/companyInformation";
import type { AboutContentDescriptionType } from "@/common/utils/companyInformationSection";
import {
  ABOUT_CONTENT_DESCRIPTION_TYPES,
  DEFAULT_DESCRIPTION_TYPE,
  emptyDescriptionItem,
} from "@/common/utils/companyInformationSection";

const DESCRIPTION_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "text-bullet", label: "Text bullet" },
] as const;

type ServicesRefusalsEditorProps = {
  title?: string;
  sections?: AboutSection[];
  values?: AboutSection[];
  onChange: (sections: AboutSection[]) => void;
};

const newSectionId = () => `content-${Math.random().toString(36).slice(2, 10)}`;

const createEmptySection = (sortIndex: number): AboutSection => ({
  id: newSectionId(),
  sortIndex,
  kind: "content",
  active: true,
  title: "",
  anchor: "",
  description: [emptyDescriptionItem()],
  images: [],
});

export const ServicesRefusalsEditor = ({
  title,
  sections: sectionsProp,
  values,
  onChange,
}: ServicesRefusalsEditorProps) => {
  const sections = values ?? sectionsProp ?? [];

  const updateSection = (index: number, nextSection: AboutSection) => {
    const next = [...sections];
    next[index] = nextSection;
    onChange(next);
  };

  const removeSection = (index: number) => {
    onChange(sections.filter((_, idx) => idx !== index));
  };

  const addSection = () => {
    const maxSort = sections.reduce((max, section) => Math.max(max, section.sortIndex), 1);
    onChange([...sections, createEmptySection(maxSort + 1)]);
  };

  const getDescriptionItems = (section: AboutSection) =>
    section.description.length > 0 ? section.description : [emptyDescriptionItem()];

  const updateContentRow = (sectionIndex: number, rowIndex: number, text: string) => {
    const section = sections[sectionIndex];
    const items = [...getDescriptionItems(section)];
    const current = items[rowIndex] ?? emptyDescriptionItem();
    items[rowIndex] = { ...current, text };
    updateSection(sectionIndex, { ...section, description: items });
  };

  const updateContentRowType = (
    sectionIndex: number,
    rowIndex: number,
    type: AboutContentDescriptionType,
  ) => {
    const section = sections[sectionIndex];
    const items = [...getDescriptionItems(section)];
    const current = items[rowIndex] ?? emptyDescriptionItem();
    items[rowIndex] = { ...current, type };
    updateSection(sectionIndex, { ...section, description: items });
  };

  const addContentRow = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, {
      ...section,
      description: [...getDescriptionItems(section), emptyDescriptionItem()],
    });
  };

  const removeContentRow = (sectionIndex: number, rowIndex: number) => {
    const section = sections[sectionIndex];
    const items = getDescriptionItems(section);
    if (items.length <= 1) {
      updateSection(sectionIndex, { ...section, description: [emptyDescriptionItem()] });
      return;
    }
    updateSection(sectionIndex, {
      ...section,
      description: items.filter((_, idx) => idx !== rowIndex),
    });
  };

  return (
    <section className="company-information-page__section-card">
      <h3 className="company-information-page__section-card-title">
        {title ?? "Dịch vụ & Từ chối cung cấp (sections — policy)"}
      </h3>

      {sections.length === 0 ? (
        <div className="company-information-page__empty-add">
          <Button type="primary" icon={<PlusOutlined />} onClick={addSection}>
            Thêm section
          </Button>
        </div>
      ) : (
        <>
          {sections.map((section, sectionIndex) => (
            <div
              className="company-information-page__policy-section"
              key={section.id}
            >
              <div className="company-information-page__group-actions">
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeSection(sectionIndex)}
                  aria-label="Xóa section"
                  disabled={section.kind === "closing"}
                />
              </div>

              <Form layout="vertical">
                {section.kind === "closing" ? (
                  <p className="company-information-page__section-hint">
                    Đoạn kết — section cuối trong <code>sections</code> (FE lấy theo sortIndex
                    lớn nhất). Để trống tiêu đề, chỉnh 2 dòng nội dung bên dưới.
                  </p>
                ) : (
                  <div className="company-information-page__inline-grid">
                    <Form.Item label="Tiêu đề">
                      <Input
                        value={section.title}
                        placeholder="VD: Terms of Service"
                        onChange={(e) => {
                          const title = e.target.value;
                          updateSection(sectionIndex, {
                            ...section,
                            title,
                            anchor: anchorFromTitle(title),
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="Anchor (tự động)">
                      <Input value={section.anchor} disabled />
                    </Form.Item>
                  </div>
                )}

                <div className="company-information-page__group-row">
                  <span className="company-information-page__group-label">
                    Nội dung (mỗi dòng hiển thị trên FE)
                  </span>
                  <div className="company-information-page__content-rows">
                    {getDescriptionItems(section).map((item, rowIndex) => (
                      <div
                        className="company-information-page__content-row"
                        key={`${section.id}-row-${rowIndex}`}
                      >
                        <Select
                          className="company-information-page__content-type-select"
                          value={
                            ABOUT_CONTENT_DESCRIPTION_TYPES.includes(
                              item.type as AboutContentDescriptionType,
                            )
                              ? (item.type as AboutContentDescriptionType)
                              : DEFAULT_DESCRIPTION_TYPE
                          }
                          options={[...DESCRIPTION_TYPE_OPTIONS]}
                          onChange={(type) =>
                            updateContentRowType(
                              sectionIndex,
                              rowIndex,
                              type as AboutContentDescriptionType,
                            )
                          }
                        />
                        <Input
                          value={item.text}
                          placeholder={`Dòng ${rowIndex + 1}`}
                          onChange={(e) =>
                            updateContentRow(sectionIndex, rowIndex, e.target.value)
                          }
                        />
                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => removeContentRow(sectionIndex, rowIndex)}
                          aria-label="Xóa dòng"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="company-information-page__add-content-action">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => addContentRow(sectionIndex)}
                    >
                      Thêm dòng
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          ))}

          <div className="company-information-page__footer-actions">
            <Button type="primary" icon={<PlusOutlined />} onClick={addSection}>
              Thêm section
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
