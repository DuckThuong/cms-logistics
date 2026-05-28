import { ROUTER_PATH } from "@/routers/Route";
import { DashboardOutlined, HomeOutlined } from "@ant-design/icons";
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
];

export const ADMIN_ALLOWED_MENU_KEYS = new Set([
  "dashboard",
  "providers",
  "customers",
]);

export const getMenuGroupsForRole = (): AppMenuGroup[] => {
  return ADMIN_MENU_GROUPS;
};

export const getActiveKeyFromPath = (pathname: string): string => {
  const match = Object.entries(MENU_PATHS).find(
    ([, path]) => pathname === path || pathname.endsWith(`/${path}`),
  );
  return match?.[0] ?? "dashboard";
};

export const isPathAllowedForRole = (pathname: string): boolean => {
  return ADMIN_ALLOWED_MENU_KEYS.has(getActiveKeyFromPath(pathname));
};

export const getBreadcrumbs = (activeKey: string): BreadcrumbCrumb[] => {
  const routeMap: Record<string, BreadcrumbCrumb[]> = {
    dashboard: [{ icon: <HomeOutlined />, label: "Dashboard" }],
    bookings: [{ label: "Vận hành" }, { label: "Đặt vé" }],
    providers: [{ label: "Quản lý" }, { label: "Nhà xe" }],
    trips: [{ label: "Vận hành" }, { label: "Chuyến xe" }],
    routes: [{ label: "Vận hành" }, { label: "Tuyến đường" }],
    vehicles: [{ label: "Vận hành" }, { label: "Phương tiện" }],
    customers: [{ label: "Quản lý" }, { label: "Khách hàng" }],
    drivers: [{ label: "Quản lý" }, { label: "Tài xế" }],
    revenue: [{ label: "Quản lý" }, { label: "Doanh thu" }],
    reports: [{ label: "Quản lý" }, { label: "Báo cáo" }],
    settings: [{ label: "Hệ thống" }, { label: "Cài đặt" }],
    help: [{ label: "Hệ thống" }, { label: "Trợ giúp" }],
  };

  return routeMap[activeKey] ?? routeMap.dashboard;
};
