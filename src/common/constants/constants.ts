import { ROUTER_PATH } from "@/routers/Route";

export const NOTI_ERROR = "error";
export const NOTI_SUCCESS = "success";
export const DEFAULT_MESSAGE = "Đã xảy ra lỗi.";
export const TYPE_LOG_OUT = 99;

export const InputState = {
  idle: "idle",
  valid: "valid",
  error: "error",
  loading: "loading",
  success: "success",
};

export const STEPS = [
  { label: "Tài khoản" },
  { label: "Thông tin" },
  { label: "Xác nhận" },
];

export const BENEFITS = [
  { icon: "🛡️", text: "Bảo mật\ntuyệt đối" },
  { icon: "🎁", text: "Ưu đãi\nthành viên" },
  { icon: "⚡", text: "Đặt xe\n1 chạm" },
  { icon: "📍", text: "Theo dõi\nreal-time" },
];

export const LOGO_COLORS: Record<string, string> = {
  PT: "#e63946",
  TB: "#2563eb",
  HL: "#16a34a",
  KS: "#7c3aed",
};

export const LOGO_OPERATORS_COLORS: Record<string, string> = {
  PT: "#e63946",
  TB: "#2563eb",
  HL: "#16a34a",
  KS: "#7c3aed",
  CT: "#ea580c",
};

export const TAG_COLORS: Record<string, string> = {
  amber: "service-card__tag--amber",
  green: "service-card__tag--green",
  red: "service-card__tag--red",
};

export const NAV_ITEMS = [
  { label: 'Giới thiệu', href: ROUTER_PATH.ABOUT_PAGE, icon: 'ti-info-circle' },
  {
    label: 'Dịch vụ',
    href: ROUTER_PATH.SERVICE,
    icon: 'ti-packages',
    children: [
      { label: 'Đặt hàng Trung Quốc', href: ROUTER_PATH.SERVICE_ORDER, icon: 'ti-shopping-cart' },
      { label: 'Thanh toán hộ', href: ROUTER_PATH.SERVICE_PAYMENT, icon: 'ti-credit-card' },
      { label: 'Vận chuyển hộ', href: ROUTER_PATH.SERVICE_SHIPPING, icon: 'ti-truck-delivery' },
    ],
  },
  {
    label: 'Bảng giá',
    href: ROUTER_PATH.PRICE,
    icon: 'ti-receipt-2',
    children: [
      { label: 'Giá Order Hàng TQ', href: ROUTER_PATH.PRICE_ORDER, icon: 'ti-tag' },
      { label: 'Giá Ký Gửi Hàng Hoá', href: ROUTER_PATH.PRICE_KY_GUI, icon: 'ti-package' },
      { label: 'Giá Vận Chuyển Chính Ngạch', href: ROUTER_PATH.PRICE_CHINH_NGACH, icon: 'ti-route' },
    ],
  },
  {
    label: 'Chính sách',
    href: ROUTER_PATH.POLICY,
    icon: 'ti-shield-check',
    children: [
      { label: 'Quy định lưu kho', href: ROUTER_PATH.POLICY_LUU_KHO, icon: 'ti-building-warehouse' },
      { label: 'Chính sách khiếu nại', href: ROUTER_PATH.POLICY_KHIEN_NAI, icon: 'ti-message-report' },
      { label: 'Chính sách bảo mật', href: ROUTER_PATH.POLICY_BAO_MAT, icon: 'ti-lock' },
      { label: 'Hàng hoá cấm nhập khẩu', href: ROUTER_PATH.POLICY_CAM_NHAP_KHAU, icon: 'ti-ban' },
    ],
  },
  { label: 'Hướng dẫn', href: ROUTER_PATH.HUONG_DAN, icon: 'ti-book-2' },
  { label: 'Tin tức', href: ROUTER_PATH.TIN_TUC, icon: 'ti-news' },
];