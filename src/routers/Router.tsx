import LoginPage from "@/pages/auth/Login";
import NotFoundPage from "@/pages/NotFoundPage";
import { MainLayout } from "@/pages/MainLayout";
import CompanyInformationPage from "@/pages/web_pages/CompanyInfomation";
import ServiceListPage from "@/pages/web_pages/Service";
import ServiceDetailEditorPage from "@/pages/web_pages/Service/ServiceDetailPage";
import ServiceLayout from "@/pages/web_pages/Service/ServiceLayout";
import PriceListPage from "@/pages/web_pages/Price";
import PriceDetailEditorPage from "@/pages/web_pages/Price/PriceDetailPage";
import PriceLayout from "@/pages/web_pages/Price/PriceLayout";
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
      <Route path={ROUTER_NAME.SERVICE} element={<ServiceLayout />}>
        <Route index element={<ServiceListPage />} />
        <Route
          path={ROUTER_NAME.SERVICE_DETAIL_ID}
          element={<ServiceDetailEditorPage />}
        />
      </Route>
      <Route path={ROUTER_NAME.PRICE} element={<PriceLayout />}>
        <Route index element={<PriceListPage />} />
        <Route
          path={ROUTER_NAME.PRICE_DETAIL_ID}
          element={<PriceDetailEditorPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    <Route path={ROUTER_PATH.NOT_FOUND} element={<NotFoundPage />} />
  </Routes>
);
