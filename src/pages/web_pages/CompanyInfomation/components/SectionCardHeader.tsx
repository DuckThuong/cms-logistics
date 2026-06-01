import { PlusOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

type SectionCardHeaderProps = {
  title: string;
  onAddClick: () => void;
  addTooltip?: string;
};

export const SectionCardHeader = ({
  title,
  onAddClick,
  addTooltip = "Thêm mục",
}: SectionCardHeaderProps) => (
  <div className="company-information-page__section-header">
    <h3>{title}</h3>
    <Tooltip title={addTooltip}>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={onAddClick}
        className="company-information-page__add-icon-btn"
        aria-label={addTooltip}
      />
    </Tooltip>
  </div>
);
