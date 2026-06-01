import { Tooltip } from "antd";
import React from "react";
import { LeftOutlined, LogoutOutlined, RightOutlined } from "@ant-design/icons";
import type {
  AppSidebarProps,
  CollapseToggleProps,
  MenuGroupProps,
  MenuItemProps,
} from "@/common/types/common";
import "./style.scss";

// ─── Logo ─────────────────────────────────────────────────────────────────────

const SidebarLogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="app-sidebar__logo">
    <a className="sidebar-logo" href="/">
      <div className="sidebar-logo__icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M2 16l3-8h14l3 8H2z"
            fill="currentColor"
            opacity="0.9"
          />
          <rect x="5" y="16" width="4" height="4" rx="2" fill="currentColor" opacity="0.75" />
          <rect x="15" y="16" width="4" height="4" rx="2" fill="currentColor" opacity="0.75" />
          <path
            d="M9 11l1.5-4h3L15 11"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="sidebar-logo__content">
          <span className="sidebar-logo__name">LogiCMS</span>
          <span className="sidebar-logo__sub">Logistics Platform</span>
        </div>
      )}

      {!collapsed && <span className="sidebar-logo__badge">v2.5</span>}
    </a>
  </div>
);

// ─── Menu Item ────────────────────────────────────────────────────────────────

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
      <SidebarLogo collapsed={collapsed} />

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