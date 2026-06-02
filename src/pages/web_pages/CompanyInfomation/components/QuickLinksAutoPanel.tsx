import type { AboutOtherOption } from "@/common/types/companyInformation";
import { IconStringField } from "./IconStringField";

type QuickLinksAutoPanelProps = {
  links: AboutOtherOption[];
  onIconChange: (linkId: string, icon: string) => void;
};

export const QuickLinksAutoPanel = ({ links, onIconChange }: QuickLinksAutoPanelProps) => (
  <section className="company-information-page__section-card">
    <h3 className="company-information-page__section-card-title">
      Liên kết nhanh (otherOptions — quick-link)
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
              <label className="company-information-page__quick-links-icon-label">Icon</label>
              <IconStringField
                value={item.icon}
                onChange={(icon) => onIconChange(item.id, icon)}
              />
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);
