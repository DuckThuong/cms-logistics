export type MenuBadge = {
  text: string;
  type: string;
};

export type AppMenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge: MenuBadge | null;
};

export type AppMenuGroup = {
  label: string;
  items: AppMenuItem[];
};

export type BreadcrumbCrumb = {
  label: string;
  icon?: React.ReactNode;
};

export type MenuItemProps = {
  item: AppMenuItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: (key: string) => void;
};

export type MenuGroupProps = {
  group: AppMenuGroup;
  activeKey: string;
  collapsed: boolean;
  onSelect: (key: string) => void;
};

export type CollapseToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  activeKey: string;
  menuGroups: AppMenuGroup[];
  onMenuSelect: (key: string) => void;
};
