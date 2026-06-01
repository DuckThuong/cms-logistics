import LoginPage from "@/pages/auth/Login";
import NotFoundPage from "@/pages/NotFoundPage";
import { MainLayout } from "@/pages/MainLayout";
import CompanyInformationPage from "@/pages/web_pages/CompanyInfomation";
import DashboardPage from "../pages/web_pages/DashBoard/Dashboard";
import { Route, Routes } from "react-router-dom";
import { ROUTER_NAME, ROUTER_PATH } from "./Route";

export const WebRouter = () => (
  <Routes>
    <Route path={ROUTER_PATH.LOGIN} element={<LoginPage />} />

    <Route path={ROUTER_PATH.DASHBOARD} element={<MainLayout />}>
      <Route index element={<DashboardPage />} />
      <Route
        path={ROUTER_NAME.COMPANY_INFORMATION}
        element={<CompanyInformationPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    <Route path={ROUTER_PATH.NOT_FOUND} element={<NotFoundPage />} />
  </Routes>
);
