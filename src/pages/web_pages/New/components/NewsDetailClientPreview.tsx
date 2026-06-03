import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import type { NewsDetailContent } from "@/common/types/news";
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
            {section.descriptions.map((desc) => (
              <div
                key={desc.id}
                className="svc-client-preview__html"
                dangerouslySetInnerHTML={{ __html: desc.text }}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};
