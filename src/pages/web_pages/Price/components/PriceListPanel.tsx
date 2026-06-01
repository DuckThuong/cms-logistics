import {
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Space, Table, Tag, Tooltip } from "antd";
import type { ReactNode } from "react";
import type { PriceListItem } from "../types";

type PriceListPanelProps = {
  items: PriceListItem[];
  onEditDetail: (item: PriceListItem) => void;
  onEditCard: (item: PriceListItem) => void;
  onAdd: () => void;
  hubConfigPanel: ReactNode;
};

export const PriceListPanel = ({
  items,
  onEditDetail,
  onEditCard,
  onAdd,
  hubConfigPanel,
}: PriceListPanelProps) => (
  <Space direction="vertical" size={16} style={{ width: "100%" }}>
    <Collapse
      bordered={false}
      className="price-hub-collapse"
      defaultActiveKey={["hub"]}
      items={[
        {
          key: "hub",
          label: (
            <Space>
              <SettingOutlined />
              <span>Cấu hình trang Hub (/bang-gia)</span>
            </Space>
          ),
          children: hubConfigPanel,
        },
      ]}
    />

    <section className="company-information-page__section-card">
      <div className="company-information-page__section-header">
        <h3 className="price-list-panel__title">Danh sách bảng giá</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm mục
        </Button>
      </div>
      <p className="company-information-page__quick-links-hint">
        Icon <FileTextOutlined /> mở màn chi tiết (sections, bảng, banner). Icon{" "}
        <EditOutlined /> sửa thông tin hiển thị trên menu.
      </p>

      <Table
        rowKey="id"
        size="middle"
        pagination={false}
        dataSource={items}
        locale={{ emptyText: "Chưa có mục bảng giá" }}
        columns={[
          { title: "#", dataIndex: "sortIndex", width: 56 },
          {
            title: "Tên hiển thị",
            dataIndex: "shortDescription",
            render: (text: string, record) => (
              <Space direction="vertical" size={0}>
                <strong>{text || "—"}</strong>
                <span className="price-list-panel__url">/bang-gia/{record.url}</span>
              </Space>
            ),
          },
          { title: "Nhãn", dataIndex: "name", width: 120 },
          {
            title: "Trạng thái",
            width: 100,
            render: (_, record) => (
              <Tag color={record.active ? "green" : "default"}>
                {record.active ? "Hiển thị" : "Ẩn"}
              </Tag>
            ),
          },
          {
            title: "Thao tác",
            key: "actions",
            width: 88,
            align: "center",
            render: (_, record) => (
              <div className="price-list-panel__actions">
                <Tooltip title="Chỉnh sửa nội dung">
                  <Button
                    type="primary"
                    size="small"
                    icon={<FileTextOutlined />}
                    aria-label="Chỉnh sửa nội dung"
                    onClick={() => onEditDetail(record)}
                  />
                </Tooltip>
                <Tooltip title="Sửa mục menu">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    aria-label="Sửa mục menu"
                    onClick={() => onEditCard(record)}
                  />
                </Tooltip>
              </div>
            ),
          },
        ]}
      />
    </section>
  </Space>
);
