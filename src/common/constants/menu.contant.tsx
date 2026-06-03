import { ROUTER_PATH } from "@/routers/Route";
import {
  AppstoreOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  ReadOutlined,
  TagOutlined,
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
  price: ROUTER_PATH.PRICE,
  news: ROUTER_PATH.NEWS,
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
      {
        key: "price",
        icon: <TagOutlined />,
        label: "Bảng giá",
        badge: null,
      },
      {
        key: "news",
        icon: <ReadOutlined />,
        label: "Tin tức",
        badge: null,
      },
    ],
  },
];

export const ADMIN_ALLOWED_MENU_KEYS = new Set([
  "dashboard",
  "companyInformation",
  "service",
  "price",
  "news",
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

  if (
    pathname === ROUTER_PATH.PRICE ||
    pathname.startsWith(`${ROUTER_PATH.PRICE}/`)
  ) {
    return "price";
  }

  if (
    pathname === ROUTER_PATH.NEWS ||
    pathname.startsWith(`${ROUTER_PATH.NEWS}/`)
  ) {
    return "news";
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
    price:
      pathname &&
      pathname.startsWith(`${ROUTER_PATH.PRICE}/`) &&
      pathname !== ROUTER_PATH.PRICE
        ? [{ label: "Web pages" }, { label: "Bảng giá" }, { label: "Chi tiết" }]
        : [{ label: "Web pages" }, { label: "Danh sách bảng giá" }],
    news:
      pathname &&
      pathname.startsWith(`${ROUTER_PATH.NEWS}/`) &&
      pathname !== ROUTER_PATH.NEWS
        ? [{ label: "Web pages" }, { label: "Tin tức" }, { label: "Chi tiết" }]
        : [{ label: "Web pages" }, { label: "Danh sách tin tức" }],
  };

  return routeMap[activeKey] ?? routeMap.dashboard;
};
