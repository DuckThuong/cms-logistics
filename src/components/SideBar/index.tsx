import type {
  AppSidebarProps,
  CollapseToggleProps,
  MenuGroupProps,
  MenuItemProps,
} from "@/common/types/common";
import { LeftOutlined, LogoutOutlined, RightOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import "./style.scss";

const MenuItem = ({ item, isActive, collapsed, onClick }: MenuItemProps) => {
  const content = (
    <div
      className={`menu-item ${isActive ? "active" : ""}`}
      onClick={() => onClick(item.key)}
    >
      <div className="menu-item__icon">{item.icon}</div>
      {!collapsed && (
        <>
          <span className="menu-item__label">{item.label}</span>
          {item.badge && (
            <span className={`menu-item__badge menu-item__badge--${item.badge.type}`}>
              {item.badge.text}
            </span>
          )}
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right" mouseEnterDelay={0.05}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

// ─── Menu Group ───────────────────────────────────────────────────────────────

const MenuGroup = ({ group, activeKey, collapsed, onSelect }: MenuGroupProps) => (
  <div className="sidebar-menu__group">
    {!collapsed && (
      <div className="sidebar-menu__group-label">{group.label}</div>
    )}
    {group.items.map((item) => (
      <MenuItem
        key={item.key}
        item={item}
        isActive={activeKey === item.key}
        collapsed={collapsed}
        onClick={onSelect}
      />
    ))}
  </div>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const SidebarFooter = ({ collapsed }: { collapsed: boolean }) => (
  <div className="sidebar-footer">
    <div className="sidebar-footer__avatar">AD</div>
    {!collapsed && (
      <div className="sidebar-footer__info">
        <div className="sidebar-footer__name">Admin Hệ thống</div>
        <div className="sidebar-footer__role">Super Administrator</div>
      </div>
    )}
    {!collapsed && (
      <Tooltip title="Đăng xuất" placement="top">
        <div className="sidebar-footer__logout">
          <LogoutOutlined />
        </div>
      </Tooltip>
    )}
  </div>
);

// ─── Collapse Toggle ──────────────────────────────────────────────────────────

const CollapseToggle = ({ collapsed, onToggle }: CollapseToggleProps) => (
  <Tooltip title={collapsed ? "Mở rộng" : "Thu gọn"} placement="right">
    <button
      type="button"
      className={`sidebar-toggle ${collapsed ? "collapsed" : ""}`}
      onClick={onToggle}
      aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
    >
      {collapsed ? <RightOutlined /> : <LeftOutlined />}
    </button>
  </Tooltip>
);

// ─── AppSidebar ───────────────────────────────────────────────────────────────

const AppSidebar = ({
  collapsed,
  onToggle,
  activeKey,
  menuGroups,
  onMenuSelect,
}: AppSidebarProps) => (
  <>
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* <SidebarLogo collapsed={collapsed} /> */}

      <nav className="sidebar-menu">
        {menuGroups.map((group, idx) => (
          <React.Fragment key={group.label}>
            {idx > 0 && <div className="sidebar-menu__divider" />}
            <MenuGroup
              group={group}
              activeKey={activeKey}
              collapsed={collapsed}
              onSelect={onMenuSelect}
            />
          </React.Fragment>
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </aside>

    <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
  </>
);

export default AppSidebar;