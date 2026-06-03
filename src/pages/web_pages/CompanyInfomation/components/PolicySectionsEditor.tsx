import { anchorFromTitle } from "@/common/utils/anchor";
import type { AboutSection } from "@/common/types/companyInformation";
import {
  DEFAULT_DESCRIPTION_TYPE,
  descriptionToLines,
  emptyDescriptionItem,
  linesToDescription,
} from "@/common/utils/companyInformationSection";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

type PolicySectionsEditorProps = {
  title?: string;
  values: AboutSection[];
  onChange: (sections: AboutSection[]) => void;
};

const newSectionId = () => `policy-${Math.random().toString(36).slice(2, 10)}`;

const createEmptySection = (sortIndex: number): AboutSection => ({
  id: newSectionId(),
  sortIndex,
  kind: "policy",
  active: true,
  title: "",
  anchor: "",
  description: [emptyDescriptionItem()],
  images: [],
});

export const PolicySectionsEditor = ({
  title = "Khối Chính sách (Policy)",
  values,
  onChange,
}: PolicySectionsEditorProps) => {
  const updateSection = (index: number, nextSection: AboutSection) => {
    const next = [...values];
    next[index] = nextSection;
    onChange(next);
  };

  const removeSection = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  const addSection = () => {
    const maxSort = values.reduce((max, section) => Math.max(max, section.sortIndex), 1);
    onChange([...values, createEmptySection(maxSort + 1)]);
  };

  const updateContentRow = (sectionIndex: number, rowIndex: number, text: string) => {
    const section = values[sectionIndex];
    const items = [...section.description];
    const current = items[rowIndex] ?? emptyDescriptionItem();
    items[rowIndex] = { ...current, text, type: current.type || DEFAULT_DESCRIPTION_TYPE };
    updateSection(sectionIndex, { ...section, description: items });
  };

  const addContentRow = (sectionIndex: number) => {
    const section = values[sectionIndex];
    updateSection(sectionIndex, {
      ...section,
      description: [...section.description, emptyDescriptionItem()],
    });
  };

  const removeContentRow = (sectionIndex: number, rowIndex: number) => {
    const section = values[sectionIndex];
    const lines = descriptionToLines(section.description);
    if (lines.length <= 1) {
      updateSection(sectionIndex, { ...section, description: linesToDescription([""]) });
      return;
    }
    updateSection(sectionIndex, {
      ...section,
      description: section.description.filter((_, idx) => idx !== rowIndex),
    });
  };

  return (
    <section className="company-information-page__section-card">
      <h3 className="company-information-page__section-card-title">{title}</h3>

      {values.length === 0 ? (
        <div className="company-information-page__footer-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={addSection}>
            Thêm khối chính sách
          </Button>
        </div>
      ) : (
        <>
          {values.map((section, sectionIndex) => (
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
                  aria-label="Xóa khối"
                />
              </div>

              <Form layout="vertical">
                <Form.Item label="Tiêu đề">
                  <Input
                    value={section.title}
                    placeholder="VD: Chính sách vận chuyển"
                    onChange={(e) => {
                      const nextTitle = e.target.value;
                      updateSection(sectionIndex, {
                        ...section,
                        title: nextTitle,
                        anchor: anchorFromTitle(nextTitle),
                      });
                    }}
                  />
                </Form.Item>

                <div className="company-information-page__group-row">
                  <span className="company-information-page__group-label">Nội dung</span>
                  <div className="company-information-page__content-rows">
                    {descriptionToLines(section.description).map((line, rowIndex) => (
                      <div
                        className="company-information-page__content-row"
                        key={`${section.id}-row-${rowIndex}`}
                      >
                        <Input
                          value={line}
                          placeholder={`Nội dung ${rowIndex + 1}`}
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
                      Thêm nội dung
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          ))}

          <div className="company-information-page__footer-actions">
            <Button type="dashed" icon={<PlusOutlined />} onClick={addSection}>
              Thêm khối chính sách
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
