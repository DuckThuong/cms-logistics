import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import type { NewsDetailContent, NewsSectionDescription } from "@/common/types/news";
import { isNewsTextImgType } from "@/common/constants/newsDescriptionTypes";
import "../../Service/components/ServiceHubClientPreview.scss";
import "../../Service/components/ServiceDetailClientPreview.scss";

type NewsDetailClientPreviewProps = {
  content: NewsDetailContent;
  hubLabel?: string;
};

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "").trim();

const headingText = (title: string) => {
  const match = title.match(/^\d+\.\s*(.+)$/);
  return match?.[1]?.trim() || title;
};

const renderDescription = (desc: NewsSectionDescription, index: number) => {
  const type = desc.type ?? "text";

  if (isNewsTextImgType(type)) {
    return (
      <figure key={desc.id} className="svc-client-preview__figure">
        {desc.img ? (
          <img src={desc.img} alt={desc.text || "news-image"} style={{ maxWidth: "100%" }} />
        ) : null}
        {desc.text ? <figcaption>{desc.text}</figcaption> : null}
      </figure>
    );
  }

  if (type === "text-bullet") {
    return <p key={desc.id}>• {desc.text}</p>;
  }

  if (type === "text-number") {
    return (
      <p key={desc.id}>
        {index + 1}. {desc.text}
      </p>
    );
  }

  if (desc.text.includes("<")) {
    return (
      <div
        key={desc.id}
        className="svc-client-preview__html"
        dangerouslySetInnerHTML={{ __html: desc.text }}
      />
    );
  }

  return <p key={desc.id}>{desc.text}</p>;
};

export const NewsDetailClientPreview = ({
  content,
  hubLabel = "Tin tức",
}: NewsDetailClientPreviewProps) => {
  const activeSections = content.sections
    .filter((s) => s.active)
    .sort((a, b) => a.sortIndex - b.sortIndex);

  return (
    <div className="svc-client-preview svc-client-preview--detail">
      <div className="svc-client-preview__hero svc-client-preview__hero--compact">
        <div className="svc-client-preview__hero-bg" aria-hidden />
        <div className="svc-client-preview__hero-inner">
          <Breadcrumb
            className="svc-client-preview__breadcrumb"
            items={[
              { title: <><HomeOutlined /> Trang chủ</> },
              { title: hubLabel },
              { title: content.shortDescription || "Chi tiết" },
            ]}
          />
          <h1 className="svc-client-preview__title">{content.shortDescription}</h1>
          {content.publishDate ? (
            <p className="svc-client-preview__subtitle">
              <CalendarOutlined /> {content.publishDate}
            </p>
          ) : null}
        </div>
      </div>

      <div className="svc-client-preview__article">
        {activeSections.map((section) => (
          <section key={section.id} className="svc-client-preview__article-section">
            <h3>{headingText(section.title) || stripHtml(section.title)}</h3>
            {section.descriptions.map((desc, index) => renderDescription(desc, index))}
          </section>
        ))}
      </div>
    </div>
  );
};
