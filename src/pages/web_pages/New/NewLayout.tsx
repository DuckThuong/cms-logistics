import { Outlet } from "react-router-dom";

/** Layout lồng: /dashboard/news → danh sách, /dashboard/news/:id → chi tiết */
export const NewLayout = () => <Outlet />;

export default NewLayout;
