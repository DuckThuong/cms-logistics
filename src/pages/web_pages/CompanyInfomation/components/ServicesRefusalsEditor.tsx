import { anchorFromTitle } from "@/common/utils/anchor";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import type { TitledContentSection } from "../types";

type ServicesRefusalsEditorProps = {
  sections: TitledContentSection[];
  onChange: (sections: TitledContentSection[]) => void;
};

const newSectionId = () => `policy-${Math.random().toString(36).slice(2, 10)}`;

const createEmptySection = (): TitledContentSection => ({
  id: newSectionId(),
  title: "",
  anchor: "",
  content: [""],
});

export const ServicesRefusalsEditor = ({
  sections,
  onChange,
}: ServicesRefusalsEditorProps) => {
  const updateSection = (index: number, nextSection: TitledContentSection) => {
    const next = [...sections];
    next[index] = nextSection;
    onChange(next);
  };

  const removeSection = (index: number) => {
    onChange(sections.filter((_, idx) => idx !== index));
  };

  const addSection = () => {
    onChange([...sections, createEmptySection()]);
  };

  const updateContentRow = (sectionIndex: number, rowIndex: number, value: string) => {
    const section = sections[sectionIndex];
    const content = [...section.content];
    content[rowIndex] = value;
    updateSection(sectionIndex, { ...section, content });
  };

  const addContentRow = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, {
      ...section,
      content: [...section.content, ""],
    });
  };

  const removeContentRow = (sectionIndex: number, rowIndex: number) => {
    const section = sections[sectionIndex];
    if (section.content.length <= 1) {
      updateSection(sectionIndex, { ...section, content: [""] });
      return;
    }
    updateSection(sectionIndex, {
      ...section,
      content: section.content.filter((_, idx) => idx !== rowIndex),
    });
  };

  return (
    <section className="company-information-page__section-card">
      <h3 className="company-information-page__section-card-title">
        Dịch vụ & Từ chối cung cấp
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
                />
              </div>

              <Form layout="vertical">
                <div className="company-information-page__inline-grid">
                  <Form.Item label="Tiêu đề">
                    <Input
                      value={section.title}
                      placeholder="Tiêu đề section"
                      onChange={(event) => {
                        const nextTitle = event.target.value;
                        updateSection(sectionIndex, {
                          ...section,
                          title: nextTitle,
                          anchor: anchorFromTitle(nextTitle),
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Liên kết nhanh">
                    <Input
                      value={section.anchor}
                      placeholder="dich-vu-cung-cap"
                      onChange={(event) =>
                        updateSection(sectionIndex, {
                          ...section,
                          anchor: event.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </div>

                <Form.Item label="Nội dung" className="company-information-page__content-field">
                  <div className="company-information-page__content-rows">
                    {section.content.map((row, rowIndex) => (
                      <div
                        className="company-information-page__content-row"
                        key={`${section.id}-row-${rowIndex}`}
                      >
                        <Input
                          value={row}
                          placeholder="Nhập nội dung"
                          onChange={(event) =>
                            updateContentRow(sectionIndex, rowIndex, event.target.value)
                          }
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeContentRow(sectionIndex, rowIndex)}
                          aria-label="Xóa dòng"
                        />
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => addContentRow(sectionIndex)}
                          aria-label="Thêm dòng"
                        />
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Form>
            </div>
          ))}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addSection}
            className="company-information-page__add-section-btn"
          >
            Thêm section
          </Button>
        </>
      )}
    </section>
  );
};
