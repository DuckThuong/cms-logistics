import { ROUTER_PATH } from "@/routers/Route";
import {
  AppstoreOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type React from "react";

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

export const MENU_PATHS: Record<string, string> = {
  dashboard: ROUTER_PATH.DASHBOARD,
  companyInformation: ROUTER_PATH.COMPANY_INFORMATION,
  service: ROUTER_PATH.SERVICE,
};

const ADMIN_MENU_GROUPS: AppMenuGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        badge: null,
      },
    ],
  },
  {
    label: "Web pages",
    items: [
      {
        key: "companyInformation",
        icon: <FileTextOutlined />,
        label: "Thông tin công ty",
        badge: null,
      },
      {
        key: "service",
        icon: <AppstoreOutlined />,
        label: "Dịch vụ",
        badge: null,
      },
    ],
  },
];

export const ADMIN_ALLOWED_MENU_KEYS = new Set([
  "dashboard",
  "companyInformation",
  "service",
  "providers",
  "customers",
]);

export const getMenuGroupsForRole = (): AppMenuGroup[] => {
  return ADMIN_MENU_GROUPS;
};

export const getActiveKeyFromPath = (pathname: string): string => {
  if (
    pathname === ROUTER_PATH.SERVICE ||
    pathname.startsWith(`${ROUTER_PATH.SERVICE}/`)
  ) {
    return "service";
  }

  const match = Object.entries(MENU_PATHS).find(
    ([, path]) => pathname === path || pathname.endsWith(`/${path}`),
  );
  return match?.[0] ?? "dashboard";
};

export const isPathAllowedForRole = (pathname: string): boolean => {
  return ADMIN_ALLOWED_MENU_KEYS.has(getActiveKeyFromPath(pathname));
};

export const getBreadcrumbs = (
  activeKey: string,
  pathname?: string,
): BreadcrumbCrumb[] => {
  const isServiceDetail =
    pathname &&
    pathname.startsWith(`${ROUTER_PATH.SERVICE}/`) &&
    pathname !== ROUTER_PATH.SERVICE;

  const routeMap: Record<string, BreadcrumbCrumb[]> = {
    dashboard: [{ icon: <HomeOutlined />, label: "Dashboard" }],
    companyInformation: [{ label: "Web pages" }, { label: "Thông tin công ty" }],
    service: isServiceDetail
      ? [{ label: "Web pages" }, { label: "Dịch vụ" }, { label: "Chi tiết" }]
      : [{ label: "Web pages" }, { label: "Danh sách dịch vụ" }],
  };

  return routeMap[activeKey] ?? routeMap.dashboard;
};
