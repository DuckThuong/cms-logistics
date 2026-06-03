import { CalendarOutlined, HomeOutlined, StarFilled } from "@ant-design/icons";
import { Breadcrumb, Tag } from "antd";
import type { NewsHubContent } from "@/common/types/news";
import { splitNewsHeroTitle } from "@/common/utils/newsHeroTitle";
import "../../Service/components/ServiceHubClientPreview.scss";

type NewsHubClientPreviewProps = {
  content: NewsHubContent;
};

export const NewsHubClientPreview = ({ content }: NewsHubClientPreviewProps) => {
  const { leading, highlight } = splitNewsHeroTitle(content.heroTitle);
  const featured = content.children.filter((c) => c.active && c.sortIndex === 1);
  const grid = content.children.filter((c) => c.active && c.sortIndex > 1);

  return (
    <div className="svc-client-preview svc-client-preview--hub">
      <div className="svc-client-preview__hero">
        <div className="svc-client-preview__hero-bg" aria-hidden />
        <div className="svc-client-preview__hero-inner">
          <Breadcrumb
            className="svc-client-preview__breadcrumb"
            items={[
              { title: <><HomeOutlined /> Trang chủ</> },
              { title: "Tin tức" },
            ]}
          />
          {content.shortDescription ? (
            <Tag className="svc-client-preview__badge" icon={<StarFilled />}>
              {content.shortDescription}
            </Tag>
          ) : null}
          <h1 className="svc-client-preview__title">
            {leading}
            {highlight ? (
              <>
                {" "}
                <span style={{ color: "#ff6a00" }}>{highlight}</span>
              </>
            ) : null}
          </h1>
          {content.heroSubtitle ? (
            <p className="svc-client-preview__subtitle">{content.heroSubtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="svc-client-preview__body">
        {featured.map((child) => (
          <div
            key={child.id}
            className="svc-client-preview__card svc-client-preview__card--featured"
          >
            {child.image ? (
              <img src={child.image} alt="" className="svc-client-preview__card-image" />
            ) : null}
            <div className="svc-client-preview__card-overlay">
              <span className="svc-client-preview__card-tag">{child.name}</span>
              <h2 className="svc-client-preview__card-title">{child.shortDescription}</h2>
              {child.publishDate ? (
                <span className="svc-client-preview__card-tag">
                  <CalendarOutlined /> {child.publishDate}
                </span>
              ) : null}
            </div>
          </div>
        ))}

        <div className="svc-client-preview__grid">
          {grid.map((child) => (
            <div key={child.id} className="svc-client-preview__card">
              {child.image ? (
                <img src={child.image} alt="" className="svc-client-preview__card-image" />
              ) : null}
              <div className="svc-client-preview__card-overlay">
                <span className="svc-client-preview__card-tag">{child.name}</span>
                <h2 className="svc-client-preview__card-title">{child.shortDescription}</h2>
                {child.publishDate ? (
                  <span className="svc-client-preview__card-tag">
                    <CalendarOutlined /> {child.publishDate}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
