import type { PriceDetailContent, PriceHubContent } from "@/common/types/price";

const orderSections: PriceDetailContent["sections"] = [
  {
    id: "sec-1",
    title: "BẢNG GIÁ DỊCH VỤ ORDER HÀNG TRUNG QUỐC",
    sortIndex: 1,
    active: true,
    description: [],
  },
  {
    id: "sec-2",
    title: "Công Ty Logistics — Uy tín & chất lượng",
    sortIndex: 2,
    active: true,
    description: [
      {
        id: "d1",
        type: "text",
        icon: "",
        text: "Bảng giá minh bạch, cập nhật theo từng loại hình vận chuyển và khu vực.",
        boldParts: ["minh bạch"],
        headers: null,
        cellRows: null,
      },
    ],
  },
  {
    id: "sec-3",
    title: "1. Phí dịch vụ order",
    sortIndex: 3,
    active: true,
    description: [
      {
        id: "d2",
        type: "table",
        icon: "",
        text: "",
        boldParts: [],
        headers: ["Loại hàng", "Đơn giá (VNĐ/kg)", "Ghi chú"],
        cellRows: [
          [
            { text: "Hàng thường", colspan: null, rowspan: null, startRow: 0 },
            { text: "25.000", colspan: null, rowspan: null, startRow: 0 },
            { text: "Áp dụng kho Quảng Châu", colspan: null, rowspan: null, startRow: 0 },
          ],
          [
            { text: "Hàng đặc biệt", colspan: null, rowspan: null, startRow: 0 },
            { text: "Liên hệ", colspan: null, rowspan: null, startRow: 0 },
            { text: "Tùy loại mặt hàng", colspan: null, rowspan: null, startRow: 0 },
          ],
        ],
      },
    ],
  },
  {
    id: "sec-4",
    title: "*** Giá trên chưa bao gồm phí khai báo và thuế (nếu có).",
    sortIndex: 4,
    active: true,
    description: [],
  },
  {
    id: "sec-5",
    title: "TRÂN TRỌNG CẢM ƠN QUÝ KHÁCH!",
    sortIndex: 5,
    active: true,
    description: [],
  },
];

export const PRICE_HUB_DEFAULTS: PriceHubContent = {
  seoUrl: "bang-gia",
  name: "Bảng giá",
  shortDescription: "Bảng giá",
  content: "Tra cứu bảng giá dịch vụ order, ký gửi và vận chuyển chính ngạch Trung Quốc — Việt Nam.",
  children: [
    {
      id: "price-order",
      name: "Bảng giá",
      shortDescription: "Giá Order Hàng TQ",
      url: "bang-gia-dich-vu-order-hang-trung-quoc",
      sortIndex: 1,
      active: true,
    },
    {
      id: "price-ky-gui",
      name: "Bảng giá",
      shortDescription: "Giá Ký Gửi Hàng Hoá",
      url: "bang-gia-dich-vu-ky-gui-hang-hoa",
      sortIndex: 2,
      active: true,
    },
    {
      id: "price-chinh-ngach",
      name: "Bảng giá",
      shortDescription: "Giá Vận Chuyển Chính Ngạch",
      url: "bang-gia-dich-vu-van-chuyen-chinh-ngach-trung-quoc-viet-nam",
      sortIndex: 3,
      active: true,
    },
  ],
};

export const PRICE_DETAIL_DEFAULTS: Record<string, PriceDetailContent> = {
  "price-order": {
    id: "price-order",
    name: "Bảng giá",
    url: "bang-gia-dich-vu-order-hang-trung-quoc",
    shortDescription: "Giá Order Hàng TQ",
    description: [
      "Vui lòng liên hệ bộ phận CSKH để được tư vấn chi tiết theo từng đơn hàng.",
    ],
    content: "Giá Order Hàng TQ",
    otherOptions: [
      {
        id: "opt-1",
        icon: "",
        image: "",
        type: "info",
        value: "Giá có thể thay đổi theo thời điểm — cập nhật trên website.",
      },
    ],
    sections: orderSections,
    updatedAt: new Date().toISOString(),
  },
  "price-ky-gui": {
    id: "price-ky-gui",
    name: "Bảng giá",
    url: "bang-gia-dich-vu-ky-gui-hang-hoa",
    shortDescription: "Giá Ký Gửi Hàng Hoá",
    description: ["Bảng giá ký gửi hàng hóa tại kho Trung Quốc."],
    content: "Giá Ký Gửi Hàng Hoá",
    otherOptions: [],
    sections: [
      {
        id: "sec-1",
        title: "BẢNG GIÁ KÝ GỬI HÀNG HOÁ",
        sortIndex: 1,
        active: true,
        description: [],
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  "price-chinh-ngach": {
    id: "price-chinh-ngach",
    name: "Bảng giá",
    url: "bang-gia-dich-vu-van-chuyen-chinh-ngach-trung-quoc-viet-nam",
    shortDescription: "Giá Vận Chuyển Chính Ngạch",
    description: ["Bảng giá vận chuyển chính ngạch Trung Quốc — Việt Nam."],
    content: "Giá Vận Chuyển Chính Ngạch",
    otherOptions: [],
    sections: [
      {
        id: "sec-1",
        title: "BẢNG GIÁ VẬN CHUYỂN CHÍNH NGẠCH",
        sortIndex: 1,
        active: true,
        description: [],
      },
    ],
    updatedAt: new Date().toISOString(),
  },
};
