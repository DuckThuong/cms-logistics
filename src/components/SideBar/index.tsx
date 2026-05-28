import { Tooltip } from "antd";
import React from "react";
import { LeftOutlined, LogoutOutlined, RightOutlined } from "@ant-design/icons";
import { Logo } from "../Logo";
import type {
  AppSidebarProps,
  CollapseToggleProps,
  MenuGroupProps,
  MenuItemProps,
} from "@/common/types/common";
import "./style.scss";

const SidebarLogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="app-sidebar__logo">
    <a className="sidebar-logo" href="/">
      <div className="logo-icon">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M3 14l2-5h10l2 5H3z" fill="#f5a623" />
          <rect x="5" y="14" width="3" height="3" rx="1.5" fill="#f5a623" />
          <rect x="12" y="14" width="3" height="3" rx="1.5" fill="#f5a623" />
          <path
            d="M7 9l1-3h4l1 3"
            stroke="#fff"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      {!collapsed && (
        <div className="sidebar-logo__text-container">
          <div className="sidebar-logo__text">
            <Logo /> <span className="sidebar-logo__text-separator">|</span>
            <span>CMS System</span>
            <span className="sidebar-logo__badge">v2.5</span>
          </div>
        </div>
      )}
    </a>
  </div>
);

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
            <span
              className={`menu-item__badge menu-item__badge--${item.badge.type}`}
            >
              {item.badge.text}
            </span>
          )}
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right" mouseEnterDelay={0.1}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

const MenuGroup = ({
  group,
  activeKey,
  collapsed,
  onSelect,
}: MenuGroupProps) => (
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

const SidebarFooter = ({ collapsed }: { collapsed: boolean }) => (
  <div className="sidebar-footer">
    <div className="sidebar-footer__avatar">AD</div>
    {!collapsed && (
      <div className="sidebar-footer__info">
        <div className="sidebar-footer__info-name">Admin Hệ thống</div>
        <div className="sidebar-footer__info-role">Super Administrator</div>
      </div>
    )}
    {!collapsed && (
      <Tooltip title="Đăng xuất" placement="top">
        <div className="sidebar-footer__action">
          <LogoutOutlined />
        </div>
      </Tooltip>
    )}
  </div>
);

const CollapseToggle = ({ collapsed, onToggle }: CollapseToggleProps) => (
  <Tooltip title={collapsed ? "Mở rộng" : "Thu gọn"} placement="right">
    <div
      className={`sidebar-toggle ${collapsed ? "collapsed" : ""}`}
      onClick={onToggle}
    >
      {collapsed ? <RightOutlined /> : <LeftOutlined />}
    </div>
  </Tooltip>
);

const AppSidebar = ({
  collapsed,
  onToggle,
  activeKey,
  menuGroups,
  onMenuSelect,
}: AppSidebarProps) => {
  return (
    <>
      <div className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
        <SidebarLogo collapsed={collapsed} />
        <div className="sidebar-menu">
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
        </div>
        <SidebarFooter collapsed={collapsed} />
      </div>
      <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
    </>
  );
};

export default AppSidebar;
