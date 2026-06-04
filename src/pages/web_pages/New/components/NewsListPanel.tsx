import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { ReactNode } from "react";
import type { NewsListItem } from "@/common/types/news";

type NewsListPanelProps = {
  items: NewsListItem[];
  onEditDetail: (item: NewsListItem) => void;
  onEditCard: (item: NewsListItem) => void;
  onDelete: (item: NewsListItem) => void;
  deletingId?: string | null;
  onAdd: () => void;
  hubConfigPanel: ReactNode;
};

export const NewsListPanel = ({
  items,
  onEditDetail,
  onEditCard,
  onDelete,
  deletingId = null,
  onAdd,
  hubConfigPanel,
}: NewsListPanelProps) => {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Collapse
        bordered={false}
        className="news-hub-collapse"
        defaultActiveKey={["hub"]}
        items={[
          {
            key: "hub",
            label: (
              <Space>
                <SettingOutlined />
                <span>Cấu hình trang Hub (/tin-tuc)</span>
              </Space>
            ),
            children: hubConfigPanel,
          },
        ]}
      />

      <section className="company-information-page__section-card">
        <div className="company-information-page__section-header">
          <h3 style={{ margin: 0 }}>Danh sách tin tức</h3>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm bài viết
          </Button>
        </div>
        <p className="company-information-page__quick-links-hint">
          Chọn <strong>Chỉnh sửa nội dung</strong> để vào màn chi tiết bài viết. Thẻ trên hub
          chỉnh qua <strong>Sửa thẻ</strong>.
        </p>

        <Table
          rowKey="id"
          size="middle"
          pagination={false}
          dataSource={items}
          locale={{ emptyText: "Chưa có bài viết nào" }}
          columns={[
            {
              title: "#",
              dataIndex: "sortIndex",
              width: 56,
            },
            {
              title: "Tiêu đề",
              dataIndex: "shortDescription",
              render: (text: string, record) => (
                <Space direction="vertical" size={0}>
                  <strong>{text || "—"}</strong>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    /tin-tuc/{record.url}
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
              title: "Ngày",
              dataIndex: "publishDate",
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
                  {record.sortIndex === 1 ? <Tag color="orange">Nổi bật</Tag> : null}
                </Space>
              ),
            },
            {
              title: "Thao tác",
              key: "actions",
              width: 120,
              align: "center",
              render: (_, record) => (
                <div className="news-list-panel__actions">
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
                  <Popconfirm
                    title="Xóa bài viết này?"
                    description="Page sẽ bị xóa vĩnh viễn trên hệ thống."
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDelete(record)}
                  >
                    <Tooltip title="Xóa">
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        loading={deletingId === record.id}
                        aria-label="Xóa"
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              ),
            },
          ]}
        />
      </section>
    </Space>
  );
};
