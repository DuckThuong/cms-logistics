import type { AboutOtherOption } from "@/common/types/companyInformation";
import { Button, Input, Space, Switch } from "antd";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";

type QuickLinksAutoPanelProps = {
  title?: string;
  values?: AboutOtherOption[];
  links?: AboutOtherOption[];
  showQuickLinks: boolean;
  hiddenLinkIds: string[];
  onShowQuickLinksChange: (enabled: boolean) => void;
  onRemoveLink: (linkId: string) => void;
  onRestoreLink: (linkId: string) => void;
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

export const QuickLinksAutoPanel = ({
  title,
  values,
  links: linksProp,
  showQuickLinks,
  hiddenLinkIds,
  onShowQuickLinksChange,
  onRemoveLink,
  onRestoreLink,
  onIconChange,
}: QuickLinksAutoPanelProps) => {
  const links = values ?? linksProp ?? [];
  const hiddenSet = new Set(hiddenLinkIds);
  const visibleLinks = links.filter((item) => !hiddenSet.has(item.id));
  const hiddenLinks = links.filter((item) => hiddenSet.has(item.id));

  return (
    <section className="company-information-page__section-card">
      <div className="company-information-page__section-header">
        <h3 className="company-information-page__section-card-title" style={{ margin: 0 }}>
          {title ?? "Liên kết nhanh (otherOptions — quick-link)"}
        </h3>
        <Space align="center">
          <span>Hiển thị «Xem nhanh»</span>
          <Switch checked={showQuickLinks} onChange={onShowQuickLinksChange} />
        </Space>
      </div>
      <p className="company-information-page__quick-links-hint">
        Tự động tạo từ intro và các section. Tắt công tắc để gỡ toàn bộ khối điều hướng nhanh trên
        preview / frontend. Có thể ẩn từng mục bằng nút gỡ bên dưới.
      </p>

      {!showQuickLinks ? (
        <p className="company-information-page__empty-hint">
          Đã tắt liên kết nhanh — khối «Xem nhanh» sẽ không hiển thị khi xem trước hoặc trên web.
        </p>
      ) : links.length === 0 ? (
        <p className="company-information-page__empty-hint">
          Chưa có liên kết — hãy nhập tiêu đề ở các khối nội dung ở trên.
        </p>
      ) : (
        <>
          <ul className="company-information-page__quick-links-list">
            {visibleLinks.map((item) => (
              <li key={item.id} className="company-information-page__quick-links-item">
                <div className="company-information-page__quick-links-main">
                  <span className="company-information-page__quick-links-label">{item.value}</span>
                  <code className="company-information-page__quick-links-anchor">quick-link</code>
                </div>
                <div className="company-information-page__icon-field">
                  <Input
                    value={item.icon ?? ""}
                    placeholder="Icon (URL hoặc emoji)"
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
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label="Gỡ liên kết nhanh"
                  onClick={() => onRemoveLink(item.id)}
                />
              </li>
            ))}
          </ul>

          {hiddenLinks.length > 0 ? (
            <div className="company-information-page__quick-links-hidden">
              <p className="company-information-page__quick-links-hidden-title">Đã gỡ khỏi menu</p>
              <ul className="company-information-page__quick-links-list">
                {hiddenLinks.map((item) => (
                  <li
                    key={item.id}
                    className="company-information-page__quick-links-item company-information-page__quick-links-item--hidden"
                  >
                    <span className="company-information-page__quick-links-label">{item.value}</span>
                    <Button
                      type="link"
                      size="small"
                      icon={<UndoOutlined />}
                      onClick={() => onRestoreLink(item.id)}
                    >
                      Khôi phục
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
};
