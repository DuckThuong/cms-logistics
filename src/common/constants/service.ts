import type { ServiceDetailContent, ServiceHubContent } from "@/common/types/service";

const orderSections = [
  {
    id: "sec-order-1",
    title: "1. Đôi nét về Công ty",
    sortIndex: 1,
    active: true,
    descriptions: [
      {
        id: "d1",
        text: "<p>Trải qua hơn 8 năm hình thành và phát triển Công Ty đã có những bước phát triển không ngừng trong lĩnh vực giao thương hàng hóa Việt Trung. Hiện tại chúng tôi đang cung cấp những dịch vụ sau:</p>",
      },
      {
        id: "d2",
        text: "<p>Với đội ngũ nhân viên trẻ, nhiệt huyết, năng động chúng tôi luôn cố gắng mang đến cho khách hàng chất lượng dịch vụ tốt nhất trên thị trường.</p>",
      },
      {
        id: "d3",
        text: "<ul><li>Đặt hàng các trang thương mại điện tử của Trung Quốc như taobao.com, tmall.com, 1688.com và Alibaba.com</li><li>Vận chuyển hàng hóa chính ngạch 2 chiều TQ – VN.</li><li>Cho thuê kho bãi Trung Quốc.</li><li>Gom hàng, đóng hàng tại kho Trung Quốc.</li><li>Tạo tài khoản Alipay, nạp tiền Alipay, thanh toán quốc tế.</li></ul>",
      },
    ],
  },
  {
    id: "sec-order-2",
    title: "2. Sứ mệnh",
    sortIndex: 2,
    active: true,
    descriptions: [
      {
        id: "d4",
        text: "<ul><li>Sứ mệnh của chúng tôi là trở thành một công ty cung cấp tất cả những dịch vụ liên quan đến giao thương Việt Nam – Trung Quốc.</li><li>Đem đến cho khách hàng chất lượng dịch vụ là tốt nhất, thời gian giao nhận là nhanh nhất, giá cước là cạnh tranh nhất.</li></ul>",
      },
    ],
  },
];

const paymentSections = [
  {
    id: "sec-pay-1",
    title: "Dịch vụ thanh toán hộ",
    sortIndex: 1,
    active: true,
    descriptions: [
      {
        id: "d1",
        text: "<p>Công Ty Logistics hỗ trợ nạp tiền vào Alipay, WeChat Pay và thanh toán hộ các đơn hàng trên Taobao, 1688, Tmall với tỉ giá cạnh tranh, minh bạch.</p>",
      },
      {
        id: "d2",
        text: "<ul><li>Nạp Alipay / WeChat Pay</li><li>Thanh toán Taobao, 1688, Tmall</li><li>Tỉ giá cạnh tranh, không phí ẩn</li></ul>",
      },
    ],
  },
];

const shippingSections = [
  {
    id: "sec-ship-1",
    title: "Dịch vụ vận chuyển hộ",
    sortIndex: 1,
    active: true,
    descriptions: [
      {
        id: "d1",
        text: "<p>Khi bạn đã có hàng tại kho Trung Quốc, Công Ty Logistics nhận ký gửi, đóng gói và vận chuyển về Việt Nam an toàn, theo dõi đơn thời gian thực.</p>",
      },
      {
        id: "d2",
        text: "<ul><li>Nhận hàng tại kho Trung Quốc</li><li>Bảo hiểm hàng hoá</li><li>Tra cứu đơn thời gian thực</li></ul>",
      },
    ],
  },
];

export const SERVICE_HUB_DEFAULTS: ServiceHubContent = {
  seoUrl: "/dich-vu",
  name: "Dịch vụ",
  shortDescription: "Dịch vụ",
  content:
    "Công Ty Logistics cung cấp đầy đủ giải pháp đặt hàng, thanh toán hộ và vận chuyển hàng hóa từ Trung Quốc về Việt Nam.",
  appBannerUrl: "https://hongkylogistics.vn/img/icontvt.png",
  appBannerLabel: "Công Ty Logistics",
  children: [
    {
      id: "svc-order",
      name: "Dịch vụ",
      shortDescription: "Đặt hàng Trung Quốc",
      image: "https://hongkylogistics.vn/img/cs.jpg",
      url: "dat-hang-trung-quoc",
      sortIndex: 1,
      active: true,
    },
    {
      id: "svc-payment",
      name: "Dịch vụ",
      shortDescription: "Thanh toán hộ",
      image: "https://hongkylogistics.vn/img/cs.jpg",
      url: "thanh-toan-ho",
      sortIndex: 2,
      active: true,
    },
    {
      id: "svc-shipping",
      name: "Dịch vụ",
      shortDescription: "Vận chuyển hộ",
      image: "https://hongkylogistics.vn/img/cs.jpg",
      url: "van-chuyen-ho",
      sortIndex: 3,
      active: true,
    },
  ],
};

export const SERVICE_DETAIL_DEFAULTS: Record<string, ServiceDetailContent> = {
  "svc-order": {
    id: "svc-order",
    name: "Đặt hàng Trung Quốc",
    url: "dat-hang-trung-quoc",
    image: "https://hongkylogistics.vn/img/cs.jpg",
    sections: orderSections,
  },
  "svc-payment": {
    id: "svc-payment",
    name: "Thanh toán hộ",
    url: "thanh-toan-ho",
    image: "https://hongkylogistics.vn/img/cs.jpg",
    sections: paymentSections,
  },
  "svc-shipping": {
    id: "svc-shipping",
    name: "Vận chuyển hộ",
    url: "van-chuyen-ho",
    image: "https://hongkylogistics.vn/img/cs.jpg",
    sections: shippingSections,
  },
};
