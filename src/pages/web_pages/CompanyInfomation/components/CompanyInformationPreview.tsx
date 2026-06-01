import { Tag } from "antd";
import type { CompanyInformationContent } from "../types";

type CompanyInformationPreviewProps = {
  content: CompanyInformationContent;
};

export const CompanyInformationPreview = ({
  content,
}: CompanyInformationPreviewProps) => {
  return (
    <section className="company-information-page__section-card">
      <h3>Preview nhanh</h3>
      <div className="company-information-page__preview">
        <Tag color="orange">{content.pageTag}</Tag>
        <h2>{content.pageTitle}</h2>
        <p>{content.pageSubtitle}</p>

        {content.headerExtras?.length ? (
          <div className="company-information-page__preview-block">
            <strong>Header extras</strong>
            <ul>
              {content.headerExtras.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <div>{item.description}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="company-information-page__preview-block">
          <strong>{content.introTitle}</strong>
          <p>{content.introContent}</p>
        </div>

        <div className="company-information-page__preview-block">
          <strong>{content.servicesTitle}</strong>
          <ul>
            {content.services.map((item, index) => (
              <li key={`service-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="company-information-page__preview-block company-information-page__preview-block--warning">
          <strong>{content.refusalsTitle}</strong>
          <ul>
            {content.refusals.map((item, index) => (
              <li key={`refusal-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        {content.sections?.length ? (
          <div className="company-information-page__preview-block">
            <strong>Extra sections</strong>
            <ul>
              {content.sections.map((sec) => (
                <li key={sec.id}>
                  <strong>{sec.title}</strong> <span>{sec.anchor}</span>
                  <div>{sec.description}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};
