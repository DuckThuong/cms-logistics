import {
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Space, Table, Tag, Tooltip } from "antd";
import type { ReactNode } from "react";
import type { ServiceListItem } from "../types";

type ServiceListPanelProps = {
  items: ServiceListItem[];
  onEditDetail: (item: ServiceListItem) => void;
  onEditCard: (item: ServiceListItem) => void;
  onAdd: () => void;
  hubConfigPanel: ReactNode;
};

export const ServiceListPanel = ({
  items,
  onEditDetail,
  onEditCard,
  onAdd,
  hubConfigPanel,
}: ServiceListPanelProps) => {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Collapse
        bordered={false}
        className="service-hub-collapse"
        defaultActiveKey={["hub"]}
        items={[
          {
            key: "hub",
            label: (
              <Space>
                <SettingOutlined />
                <span>Cấu hình trang Hub (/dich-vu)</span>
              </Space>
            ),
            children: hubConfigPanel,
          },
        ]}
      />

      <section className="company-information-page__section-card">
        <div className="company-information-page__section-header">
          <h3 style={{ margin: 0 }}>Danh sách dịch vụ</h3>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm dịch vụ
          </Button>
        </div>
        <p className="company-information-page__quick-links-hint">
          Chọn <strong>Chỉnh sửa nội dung</strong> để vào màn chi tiết từng dịch vụ. Thẻ trên
          hub chỉnh qua <strong>Sửa thẻ</strong>.
        </p>

        <Table
          rowKey="id"
          size="middle"
          pagination={false}
          dataSource={items}
          locale={{ emptyText: "Chưa có dịch vụ nào" }}
          columns={[
            {
              title: "#",
              dataIndex: "sortIndex",
              width: 56,
            },
            {
              title: "Tên hiển thị",
              dataIndex: "shortDescription",
              render: (text: string, record) => (
                <Space direction="vertical" size={0}>
                  <strong>{text || "—"}</strong>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    /dich-vu/{record.url}
                  </span>
                </Space>
              ),
            },
            {
              title: "Nhãn",
              dataIndex: "name",
              width: 120,
            },
            {
              title: "Trạng thái",
              width: 140,
              render: (_, record) => (
                <Space size={4} wrap>
                  <Tag color={record.active ? "green" : "default"}>
                    {record.active ? "Hiển thị" : "Ẩn"}
                  </Tag>
                  {record.sortIndex === 1 ? <Tag color="orange">Featured</Tag> : null}
                </Space>
              ),
            },
            {
              title: "Thao tác",
              key: "actions",
              width: 88,
              align: "center",
              render: (_, record) => (
                <div className="service-list-panel__actions">
                  <Tooltip title="Chỉnh sửa nội dung">
                    <Button
                      type="primary"
                      size="small"
                      icon={<FileTextOutlined />}
                      aria-label="Chỉnh sửa nội dung"
                      onClick={() => onEditDetail(record)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa thẻ">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      aria-label="Sửa thẻ"
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
};
