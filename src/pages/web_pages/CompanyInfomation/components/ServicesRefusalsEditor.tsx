import { anchorFromTitle } from "@/common/utils/anchor";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import type { AboutSection } from "@/common/types/companyInformation";
import { descriptionToLines, linesToDescription } from "@/common/utils/companyInformationSection";

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
  description: linesToDescription([""]),
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

  const updateContentRow = (sectionIndex: number, rowIndex: number, value: string) => {
    const section = sections[sectionIndex];
    const lines = descriptionToLines(section.description);
    lines[rowIndex] = value;
    updateSection(sectionIndex, {
      ...section,
      description: linesToDescription(lines),
    });
  };

  const addContentRow = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, {
      ...section,
      description: linesToDescription([...descriptionToLines(section.description), ""]),
    });
  };

  const removeContentRow = (sectionIndex: number, rowIndex: number) => {
    const section = sections[sectionIndex];
    const lines = descriptionToLines(section.description);
    if (lines.length <= 1) {
      updateSection(sectionIndex, { ...section, description: linesToDescription([""]) });
      return;
    }
    updateSection(sectionIndex, {
      ...section,
      description: linesToDescription(lines.filter((_, idx) => idx !== rowIndex)),
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
                />
              </div>

              <Form layout="vertical">
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

                <div className="company-information-page__group-row">
                  <span className="company-information-page__group-label">
                    Nội dung (mỗi dòng hiển thị trên FE)
                  </span>
                  {descriptionToLines(section.description).map((line, rowIndex) => (
                    <div className="company-information-page__group-row-item" key={rowIndex}>
                      <Input
                        value={line}
                        placeholder={`Dòng ${rowIndex + 1}`}
                        onChange={(e) => updateContentRow(sectionIndex, rowIndex, e.target.value)}
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
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => addContentRow(sectionIndex)}
                  >
                    Thêm dòng
                  </Button>
                </div>
              </Form>
            </div>
          ))}

          <div className="company-information-page__footer-actions">
            <Button type="primary" icon={<PlusOutlined />} onClick={addSection}>
              Thêm section policy
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
