import {
  getActiveKeyFromPath,
  getMenuGroupsForRole,
  isPathAllowedForRole,
  MENU_PATHS,
} from "@/common/constants/menu.contant";
import AppSidebar from "@/components/SideBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { ROUTER_PATH } from "@/routers/Route";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(() =>
    getActiveKeyFromPath(location.pathname),
  );
  const menuGroups = getMenuGroupsForRole();
  const isCurrentPathAllowed = isPathAllowedForRole(location.pathname);

  useEffect(() => {
    setActiveKey(getActiveKeyFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (!isCurrentPathAllowed) {
      navigate(ROUTER_PATH.DASHBOARD, { replace: true });
    }
  }, [isCurrentPathAllowed, navigate]);

  const handleToggle = () => setCollapsed((prev) => !prev);

  const handleMenuSelect = (key: string) => {
    setActiveKey(key);
    const path = MENU_PATHS[key];
    if (path) {
      navigate(path);
    }
  };

  if (!isCurrentPathAllowed) {
    return null;
  }
  return (
    <div className="app-layout">
      <Header />
      <AppSidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        activeKey={activeKey}
        menuGroups={menuGroups}
        onMenuSelect={handleMenuSelect}
      />

      <div
        className={`app-layout__content ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
      >
        <main className="app-layout__main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
