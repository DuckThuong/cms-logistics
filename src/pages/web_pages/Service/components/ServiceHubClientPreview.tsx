import { AppstoreOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Tag } from "antd";
import type { ServiceHubContent } from "@/common/types/service";
import "./ServiceHubClientPreview.scss";

type ServiceHubClientPreviewProps = {
  content: ServiceHubContent;
};

export const ServiceHubClientPreview = ({ content }: ServiceHubClientPreviewProps) => {
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
              { title: content.name || "Dịch vụ" },
            ]}
          />
          {content.shortDescription ? (
            <Tag className="svc-client-preview__badge" icon={<AppstoreOutlined />}>
              {content.shortDescription}
            </Tag>
          ) : null}
          <h1 className="svc-client-preview__title">{content.name}</h1>
          {content.content ? (
            <p className="svc-client-preview__subtitle">{content.content}</p>
          ) : null}
        </div>
      </div>

      <div className="svc-client-preview__body">
        {content.appBannerUrl ? (
          <a className="svc-client-preview__app-banner" href="#preview">
            <img
              src={content.appBannerUrl}
              alt=""
              className="svc-client-preview__app-icon"
            />
            <strong>{content.appBannerLabel || "Công Ty Logistics"}</strong>
          </a>
        ) : null}

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
