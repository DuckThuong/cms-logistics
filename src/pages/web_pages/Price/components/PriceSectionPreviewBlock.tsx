import { Alert, Table, Typography } from "antd";
import { buildPriceAntdTable } from "../utils/buildPriceTable";
import { getPriceSectionVariant } from "../utils/sectionVariant";
import type { PriceDetailSection, PriceSectionDescription } from "@/common/types/price";

const { Title, Paragraph } = Typography;

const renderBoldText = (text: string, boldParts: string[]) => {
  if (!boldParts.length) {
    return <Paragraph className="price-preview__paragraph">{text}</Paragraph>;
  }

  let parts: Array<{ text: string; bold: boolean }> = [{ text, bold: false }];
  boldParts.forEach((phrase) => {
    if (!phrase) return;
    const next: Array<{ text: string; bold: boolean }> = [];
    parts.forEach((part) => {
      if (part.bold) {
        next.push(part);
        return;
      }
      const idx = part.text.indexOf(phrase);
      if (idx === -1) {
        next.push(part);
        return;
      }
      if (idx > 0) next.push({ text: part.text.slice(0, idx), bold: false });
      next.push({ text: phrase, bold: true });
      if (idx + phrase.length < part.text.length) {
        next.push({ text: part.text.slice(idx + phrase.length), bold: false });
      }
    });
    parts = next;
  });

  return (
    <Paragraph className="price-preview__paragraph">
      {parts.map((part, i) =>
        part.bold ? (
          <strong key={i}>{part.text}</strong>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </Paragraph>
  );
};

const renderDescription = (desc: PriceSectionDescription, index: number) => {
  if (desc.type === "table" && desc.headers?.length && desc.cellRows?.length) {
    const { columns, dataSource } = buildPriceAntdTable(desc.headers, desc.cellRows);
    return (
      <Table
        key={`table-${index}`}
        className="price-preview__table"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
      />
    );
  }

  if (desc.type === "text" && desc.text) {
    return (
      <div key={`text-${index}`}>{renderBoldText(desc.text, desc.boldParts ?? [])}</div>
    );
  }

  return null;
};

type PriceSectionPreviewBlockProps = {
  section: PriceDetailSection;
};

export const PriceSectionPreviewBlock = ({ section }: PriceSectionPreviewBlockProps) => {
  const variant = getPriceSectionVariant(section);
  const title = section.title;

  const renderTitle = () => {
    switch (variant) {
      case "main-title":
        return <Title level={2}>{title}</Title>;
      case "tagline":
        return <Paragraph className="price-preview__tagline">{title}</Paragraph>;
      case "disclaimer":
        return <Alert type="warning" showIcon message={title} />;
      case "closing":
        return <Title level={3}>{title}</Title>;
      case "numbered":
        return <Title level={4}>{title}</Title>;
      default:
        return <Title level={4}>{title}</Title>;
    }
  };

  const hasTitleOnly =
    variant === "disclaimer" && !section.description?.length;

  if (hasTitleOnly) {
    return <div className="price-preview__section">{renderTitle()}</div>;
  }

  return (
    <section className="price-preview__section">
      {variant !== "disclaimer" && renderTitle()}
      {section.description?.map((desc, index) => renderDescription(desc, index))}
    </section>
  );
};
