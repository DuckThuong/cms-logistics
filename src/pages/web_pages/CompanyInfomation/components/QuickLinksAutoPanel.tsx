import { LinkOutlined } from "@ant-design/icons";
import type { QuickLinkItem } from "../types";

type QuickLinksAutoPanelProps = {
  links: QuickLinkItem[];
};

export const QuickLinksAutoPanel = ({ links }: QuickLinksAutoPanelProps) => (
  <section className="company-information-page__section-card">
    <h3 className="company-information-page__section-card-title">Liên kết nhanh</h3>
    <p className="company-information-page__quick-links-hint">
      Tự động tạo từ tiêu đề và ô <strong>Liên kết nhanh</strong> ở Khối Giới thiệu,
      Dịch vụ & Từ chối và Các khối nội dung tuỳ biến.
    </p>

    {links.length === 0 ? (
      <p className="company-information-page__empty-hint">
        Chưa có liên kết — hãy nhập tiêu đề ở các khối nội dung ở trên.
      </p>
    ) : (
      <ul className="company-information-page__quick-links-list">
        {links.map((item) => (
          <li key={item.id} className="company-information-page__quick-links-item">
            <LinkOutlined className="company-information-page__quick-links-icon" />
            <span className="company-information-page__quick-links-label">{item.label}</span>
            <code className="company-information-page__quick-links-anchor">{item.anchor}</code>
          </li>
        ))}
      </ul>
    )}
  </section>
);
