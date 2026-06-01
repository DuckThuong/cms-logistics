import { Outlet } from "react-router-dom";

/** Layout lồng: /dashboard/service → danh sách, /dashboard/service/:id → chi tiết */
export const ServiceLayout = () => <Outlet />;

export default ServiceLayout;
