import { InfoCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import type { MouseEvent } from "react";
import {
  descriptionToLines,
  filterSectionsByKind,
  getClosingLines,
} from "@/common/utils/companyInformationSection";
import {
  getHighlightOptions,
  getQuickLinkOptions,
} from "@/common/utils/companyInformationOtherOptions";
import type { CompanyInformationContent } from "@/common/types/companyInformation";
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

const renderIcon = (icon: string, className: string) => {
  const trimmed = icon.trim();
  if (!trimmed) {
    return null;
  }

  const isImageSrc =
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:");

  if (isImageSrc) {
    return <img src={trimmed} alt="" className={className} />;
  }

  return <span className={`${className} ${className}--text`}>{trimmed}</span>;
};

export const CompanyInformationClientPreview = ({
  content,
}: CompanyInformationClientPreviewProps) => {
  const introAnchorId = toDomAnchorId(content.intro.anchor, "gioi-thieu");
  const highlights = getHighlightOptions(content.otherOptions);
  const quickLinks =
    content.showQuickLinks !== false
      ? getQuickLinkOptions(content.otherOptions)
      : [];
  const policySections = filterSectionsByKind(content.sections, "policy");
  const contentSections = filterSectionsByKind(content.sections, "content");
  const [closingLineOne, closingLineTwo] = getClosingLines(content.sections);

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

            {highlights.length > 0 ? (
              <ul className="ci-client-preview__highlights">
                {highlights.map((item) => (
                  <li key={item.id} className="ci-client-preview__highlight">
                    {renderIcon(item.icon, "ci-client-preview__highlight-icon")}
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {quickLinks.length > 0 ? (
            <nav className="ci-client-preview__quick-nav" aria-label="Điều hướng nhanh">
              <span className="ci-client-preview__quick-nav-label">Xem nhanh</span>
              <ul className="ci-client-preview__quick-links">
                {quickLinks.map((link) => {
                  const anchorId =
                    link.id === "intro"
                      ? toDomAnchorId(content.intro.anchor, link.id)
                      : (() => {
                          const section = [...policySections, ...contentSections].find(
                            (item) => item.id === link.id,
                          );
                          return section
                            ? toDomAnchorId(section.anchor, link.id)
                            : toDomAnchorId(link.value, link.id);
                        })();
                  return (
                    <li key={link.id}>
                      <a
                        href={`#${anchorId}`}
                        className="ci-client-preview__quick-link"
                        onClick={(event) => scrollToSection(event, anchorId)}
                      >
                        {renderIcon(link.icon, "ci-client-preview__quick-link-icon")}
                        <span>{link.value}</span>
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
              {content.intro.title ? <strong>{content.intro.title} </strong> : null}
              {content.intro.content}
            </p>
          </div>
          {content.intro.imageUrl ? (
            <div className="ci-client-preview__intro-image">
              <img src={content.intro.imageUrl} alt={content.intro.title || "Giới thiệu"} />
            </div>
          ) : null}
        </section>

        {policySections.map((section, index) => {
          const anchorId = toDomAnchorId(section.anchor, section.id);
          const lines = descriptionToLines(section.description).filter((line) => line.trim());
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

        {contentSections.map((section) => {
          const anchorId = toDomAnchorId(section.anchor, section.id);
          const lead = section.description[0]?.text ?? "";
          if (!section.title.trim() && !lead && !section.body) {
            return null;
          }

          return (
            <section
              key={section.id}
              id={anchorId}
              className="ci-client-preview__section ci-client-preview__section--custom ci-client-preview__anchor-target"
            >
              <h2 className="ci-client-preview__section-title">{section.title}</h2>
              {lead ? <p className="ci-client-preview__section-desc">{lead}</p> : null}
              {section.body ? (
                <div className="ci-client-preview__section-content">{section.body}</div>
              ) : null}
              {section.images[0] ? (
                <div className="ci-client-preview__section-image">
                  <img src={section.images[0]} alt={section.title} />
                </div>
              ) : null}
            </section>
          );
        })}

        {(closingLineOne || closingLineTwo) && (
          <div className="ci-client-preview__closing">
            {closingLineOne ? (
              <p>
                <strong>{closingLineOne}</strong>
              </p>
            ) : null}
            {closingLineTwo ? (
              <p>
                <strong>{closingLineTwo}</strong>
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
