import { InfoCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import type { MouseEvent } from "react";
import type { CompanyInformationContent } from "../types";
import "./CompanyInformationClientPreview.scss";

type CompanyInformationClientPreviewProps = {
  content: CompanyInformationContent;
};

const toDomAnchorId = (anchor: string, fallback: string) => {
  const slug = anchor.trim().replace(/^#/, "");
  return slug || fallback;
};

const POLICY_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, anchorId: string) => {
  event.preventDefault();
  const target = document.getElementById(anchorId);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const CompanyInformationClientPreview = ({
  content,
}: CompanyInformationClientPreviewProps) => {
  const introAnchorId = toDomAnchorId(content.introAnchor, "gioi-thieu");

  return (
    <div className="ci-client-preview">
      <div className="ci-client-preview__hero">
        <div className="ci-client-preview__hero-bg" aria-hidden />
        <div className="ci-client-preview__hero-inner">
          <div className="ci-client-preview__hero-copy">
            {content.pageTag ? (
              <Tag className="ci-client-preview__badge" icon={<InfoCircleOutlined />}>
                {content.pageTag}
              </Tag>
            ) : null}
            <h1 className="ci-client-preview__title">{content.pageTitle}</h1>
            {content.pageSubtitle ? (
              <p className="ci-client-preview__subtitle">{content.pageSubtitle}</p>
            ) : null}

            {content.highlights.length > 0 ? (
              <ul className="ci-client-preview__highlights">
                {content.highlights.map((item) => (
                  <li key={item.id} className="ci-client-preview__highlight">
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {content.quickLinks.length > 0 ? (
            <nav className="ci-client-preview__quick-nav" aria-label="Điều hướng nhanh">
              <span className="ci-client-preview__quick-nav-label">Xem nhanh</span>
              <ul className="ci-client-preview__quick-links">
                {content.quickLinks.map((link) => {
                  const anchorId = toDomAnchorId(link.anchor, link.id);
                  return (
                    <li key={link.id}>
                      <a
                        href={`#${anchorId}`}
                        className="ci-client-preview__quick-link"
                        onClick={(event) => scrollToSection(event, anchorId)}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>

      <div className="ci-client-preview__body">
        <section
          id={introAnchorId}
          className="ci-client-preview__intro ci-client-preview__anchor-target"
        >
          <div className="ci-client-preview__intro-text">
            <p>
              {content.introTitle ? <strong>{content.introTitle} </strong> : null}
              {content.introContent}
            </p>
          </div>
          {content.introImageUrl ? (
            <div className="ci-client-preview__intro-image">
              <img src={content.introImageUrl} alt={content.introTitle || "Giới thiệu"} />
            </div>
          ) : null}
        </section>

        {content.policySections.map((section, index) => {
          const anchorId = toDomAnchorId(section.anchor, section.id);
          const lines = section.content.filter((line) => line.trim());
          if (!section.title.trim() && lines.length === 0) {
            return null;
          }

          return (
            <section
              key={section.id}
              id={anchorId}
              className={`ci-client-preview__section ci-client-preview__anchor-target ${
                index > 0 ? "ci-client-preview__section--warning" : ""
              }`}
            >
              <h2 className="ci-client-preview__section-title">
                <span>{POLICY_ROMAN[index] ?? index + 1}.</span> {section.title}
              </h2>
              {lines.length > 0 ? (
                <ul className="ci-client-preview__list">
                  {lines.map((line, lineIndex) => (
                    <li
                      key={`${section.id}-${lineIndex}`}
                      className={`ci-client-preview__list-item ${
                        index > 0 ? "ci-client-preview__list-item--warning" : ""
                      }`}
                    >
                      <span className="ci-client-preview__list-icon">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}

        {content.sections.map((section) => {
          const anchorId = toDomAnchorId(section.anchor, section.id);
          if (!section.title.trim() && !section.description && !section.content) {
            return null;
          }

          return (
            <section
              key={section.id}
              id={anchorId}
              className="ci-client-preview__section ci-client-preview__section--custom ci-client-preview__anchor-target"
            >
              <h2 className="ci-client-preview__section-title">{section.title}</h2>
              {section.description ? (
                <p className="ci-client-preview__section-desc">{section.description}</p>
              ) : null}
              {section.content ? (
                <div className="ci-client-preview__section-content">{section.content}</div>
              ) : null}
              {section.imageUrl ? (
                <div className="ci-client-preview__section-image">
                  <img src={section.imageUrl} alt={section.title} />
                </div>
              ) : null}
            </section>
          );
        })}

        {(content.closingLineOne || content.closingLineTwo) && (
          <div className="ci-client-preview__closing">
            {content.closingLineOne ? (
              <p>
                <strong>{content.closingLineOne}</strong>
              </p>
            ) : null}
            {content.closingLineTwo ? (
              <p>
                <strong>{content.closingLineTwo}</strong>
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
