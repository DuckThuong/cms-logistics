import type { AboutOtherOption } from "@/common/types/companyInformation";
import { Input } from "antd";

type QuickLinksAutoPanelProps = {
  title?: string;
  values?: AboutOtherOption[];
  links?: AboutOtherOption[];
  onIconChange: (linkId: string, icon: string) => void;
};

const isImageIconSrc = (value: string) => {
  const trimmed = value.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  );
};

export const QuickLinksAutoPanel = ({ title, values, links: linksProp, onIconChange }: QuickLinksAutoPanelProps) => {
  const links = values ?? linksProp ?? [];

  return (  <section className="company-information-page__section-card">
    <h3 className="company-information-page__section-card-title">
      {title ?? "Liên kết nhanh (otherOptions — quick-link)"}
    </h3>
    <p className="company-information-page__quick-links-hint">
      Tự động tạo từ intro và các section. <strong>value</strong> là nhãn hiển thị (khớp FE).
      Anchor DOM lấy từ trường anchor của từng khối. Nhập Icon cho preview Client.
    </p>

    {links.length === 0 ? (
      <p className="company-information-page__empty-hint">
        Chưa có liên kết — hãy nhập tiêu đề ở các khối nội dung ở trên.
      </p>
    ) : (
      <ul className="company-information-page__quick-links-list">
        {links.map((item) => (
          <li key={item.id} className="company-information-page__quick-links-item">
            <div className="company-information-page__quick-links-main">
              <span className="company-information-page__quick-links-label">{item.value}</span>
              <code className="company-information-page__quick-links-anchor">type: quick-link</code>
            </div>
            <div className="company-information-page__quick-links-icon-edit">
              <span className="company-information-page__quick-links-icon-label">Icon</span>
              <div className="company-information-page__icon-field">
                <Input
                  value={item.icon ?? ""}
                  placeholder="URL ảnh icon hoặc emoji (vd: 🚚)"
                  onChange={(event) => onIconChange(item.id, event.target.value)}
                />
                {item.icon?.trim() ? (
                  <div className="company-information-page__icon-preview" aria-hidden>
                    {isImageIconSrc(item.icon) ? (
                      <img src={item.icon.trim()} alt="" />
                    ) : (
                      <span className="company-information-page__icon-preview-text">
                        {item.icon.trim()}
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>          </li>
        ))}
      </ul>
    )}
  </section>
  );
};
