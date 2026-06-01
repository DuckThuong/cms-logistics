import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { Alert, Breadcrumb, Card, Space, Typography } from "antd";
import { PriceSectionPreviewBlock } from "./PriceSectionPreviewBlock";
import type { PriceDetailContent } from "../types";
import "./PriceDetailClientPreview.scss";

type PriceDetailClientPreviewProps = {
  content: PriceDetailContent;
  hubName?: string;
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const PriceDetailClientPreview = ({
  content,
  hubName = "Bảng giá",
}: PriceDetailClientPreviewProps) => {
  const sections = content.sections
    .filter((s) => s.active)
    .sort((a, b) => a.sortIndex - b.sortIndex);
  const updatedLabel = formatDate(content.updatedAt);

  return (
    <div className="price-client-preview">
      <section className="price-client-preview__hero">
        <div className="price-client-preview__hero-bg" aria-hidden />
        <div className="price-client-preview__hero-inner">
          <Breadcrumb
            className="price-client-preview__breadcrumb"
            items={[
              { title: <><HomeOutlined /> Trang chủ</> },
              { title: hubName },
              { title: content.shortDescription || content.name },
            ]}
          />
          <Typography.Title level={1} className="price-client-preview__title">
            {content.shortDescription || content.name}
          </Typography.Title>
          {updatedLabel ? (
            <Typography.Paragraph className="price-client-preview__updated">
              <CalendarOutlined /> Cập nhật: {updatedLabel}
            </Typography.Paragraph>
          ) : null}
        </div>
      </section>

      <div className="price-client-preview__body">
        {content.otherOptions.map((opt) => (
          <Alert
            key={opt.id}
            type="info"
            showIcon
            className="price-client-preview__banner"
            icon={
              opt.icon ? <img src={opt.icon} alt="" width={24} height={24} /> : undefined
            }
            message={opt.value}
          />
        ))}

        {content.description.map((line) => (
          <Typography.Paragraph key={line} type="secondary" className="price-client-preview__intro">
            {line}
          </Typography.Paragraph>
        ))}

        <Space direction="vertical" size="large" className="price-client-preview__sections">
          {sections.map((section) => (
            <Card key={section.id} variant="borderless" className="price-client-preview__card">
              <PriceSectionPreviewBlock section={section} />
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
};
