import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { ensureDescription } from "@/common/contexts/priceMigrate";
import type { PriceDetailSection } from "@/common/types/price";
import {
  PriceAddSectionModal,
  type PriceAddSectionFormValues,
} from "./PriceAddSectionModal";
import { PriceSectionCard } from "./PriceSectionCard";

const newSectionId = () => `sec-${Math.random().toString(36).slice(2, 10)}`;

const createSection = (values: PriceAddSectionFormValues): PriceDetailSection => {
  const initialDesc =
    values.type === "table"
      ? ensureDescription({
          id: `desc-${Math.random().toString(36).slice(2, 10)}`,
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
        })
      : ensureDescription({
          id: `desc-${Math.random().toString(36).slice(2, 10)}`,
          type: "text",
          icon: "",
          text: "",
          boldParts: [],
          headers: null,
          cellRows: null,
        });

  return {
    id: newSectionId(),
    title: values.title.trim(),
    sortIndex: values.sortIndex,
    active: true,
    description: [initialDesc],
  };
};

type PriceSectionListEditorProps = {
  values: PriceDetailSection[];
  onChange: (next: PriceDetailSection[]) => void;
};

export const PriceSectionListEditor = ({ values, onChange }: PriceSectionListEditorProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = [...values].sort((a, b) => a.sortIndex - b.sortIndex);
  const nextSortIndex = sorted.length > 0 ? Math.max(...sorted.map((s) => s.sortIndex)) + 1 : 1;

  const handleAdd = (formValues: PriceAddSectionFormValues) => {
    onChange([...values, createSection(formValues)].sort((a, b) => a.sortIndex - b.sortIndex));
  };

  const updateSection = (index: number, next: PriceDetailSection) => {
    const copy = [...values];
    const targetId = sorted[index].id;
    const realIndex = copy.findIndex((s) => s.id === targetId);
    if (realIndex === -1) return;
    copy[realIndex] = next;
    onChange(copy);
  };

  const removeSection = (index: number) => {
    const targetId = sorted[index].id;
    onChange(values.filter((s) => s.id !== targetId));
  };

  return (
    <section className="company-information-page__section-card price-section-list">
      <h3 className="price-section-list__title">Nội dung sections</h3>
      <p className="company-information-page__quick-links-hint">
        Thêm từng khối: chọn <strong>Văn bản</strong> (nhiều đoạn HTML) hoặc{" "}
        <strong>Bảng</strong> (lưới có gộp ô). Thứ tự hiển thị theo sortIndex.
      </p>

      {sorted.length === 0 ? (
        <p className="company-information-page__empty-hint">
          Chưa có section. Bấm nút bên dưới để thêm khối đầu tiên.
        </p>
      ) : (
        <div className="price-section-list__items">
          {sorted.map((section, index) => (
            <PriceSectionCard
              key={section.id}
              section={section}
              onChange={(next) => updateSection(index, next)}
              onRemove={() => removeSection(index)}
            />
          ))}
        </div>
      )}

      <div className="price-section-list__add">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Thêm section
        </Button>
      </div>

      <PriceAddSectionModal
        open={modalOpen}
        nextSortIndex={nextSortIndex}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
      />
    </section>
  );
};
