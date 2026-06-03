import {
  ABOUT_OPTION_TYPES,
  type AboutOtherOption,
  type AboutSection,
  type CompanyInformationContent,
} from "@/common/types/companyInformation";
import { linesToDescription } from "@/common/utils/companyInformationSection";

const defaultHighlights: AboutOtherOption[] = [
  { id: "experience", type: ABOUT_OPTION_TYPES.highlight, value: "10+ năm kinh nghiệm", icon: "" },
  { id: "daily-orders", type: ABOUT_OPTION_TYPES.highlight, value: "800+ đơn/ngày", icon: "" },
  { id: "customers", type: ABOUT_OPTION_TYPES.highlight, value: "10K+ khách hàng", icon: "" },
];

const defaultPolicySections: AboutSection[] = [
  {
    id: "policy-services",
    sortIndex: 2,
    kind: "policy",
    active: true,
    title: "I. Các dịch vụ do Công Ty Logistics cung cấp:",
    anchor: "dich-vu",
    description: linesToDescription([
      "Tư vấn tìm kiếm nguồn hàng trên các website bán buôn, bán lẻ hàng đầu Trung Quốc.",
      "Mua hàng hộ và Kiểm tra hàng hóa.",
      "Thanh toán hộ đơn hàng theo ủy thác, ký gửi hàng hóa theo yêu cầu.",
      "Đóng gói và Vận chuyển hàng hóa về Việt Nam.",
    ]),
    images: [],
  },
  {
    id: "policy-refusals",
    sortIndex: 3,
    kind: "policy",
    active: true,
    title:
      "II. Công Ty Logistics từ chối cung cấp dịch vụ khi khách hàng có hành vi sau:",
    anchor: "tu-choi",
    description: linesToDescription([
      "Phát tán hoặc đăng tải thông tin sai sự thật gây ảnh hưởng đến uy tín doanh nghiệp.",
      "Gian lận trong giao dịch và công nợ.",
      "Cố ý mua bán sản phẩm thuộc danh mục cấm nhập khẩu.",
    ]),
    images: [],
  },
];

const defaultContentSections: AboutSection[] = [
  {
    id: "sec-1",
    sortIndex: 4,
    kind: "content",
    active: true,
    title: "Tổng quan",
    anchor: "tong-quan",
    description: linesToDescription(["Khối nội dung dạng section (có thể thêm/xóa)."]),
    body: "Đây là nội dung section mẫu. Bạn có thể nhập nhiều dòng, hoặc dán nội dung từ tài liệu.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrR3pcB_D8iLltcq5xMFJYLF3oPNZVeirC9Q&s",
    ],
  },
];

const defaultClosingSection: AboutSection = {
  id: "closing",
  sortIndex: 5,
  kind: "closing",
  active: true,
  title: "",
  anchor: "",
  description: linesToDescription([
    "Công Ty Logistics xin chân thành cảm ơn và mong muốn được đồng hành cùng Quý Khách hàng!",
    "Trân trọng!",
  ]),
  images: [],
};

export const COMPANY_INFORMATION_DEFAULTS: CompanyInformationContent = {
  seoUrl: "about",
  pageTag: "Về Công Ty Logistics",
  pageTitle: "Giới Thiệu",
  pageSubtitle:
    "Đơn vị trung gian uy tín trong lĩnh vực đặt hàng, thanh toán ủy thác và vận chuyển hàng hóa từ Trung Quốc về Việt Nam.",
  headerExtras: [
    {
      id: "detail",
      title: "Chi tiết nội dung",
      description: "Bạn có thể thêm các thẻ/đoạn mô tả tuỳ biến ở phần header.",
    },
  ],
  intro: {
    title: "Giới thiệu tổng quan",
    anchor: "gioi-thieu-tong-quan",
    content:
      "Công Ty Logistics là đơn vị trung gian cung cấp các dịch vụ: Đặt hàng, Thanh toán ủy thác và Vận chuyển hàng hóa từ Trung Quốc về Việt Nam.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrR3pcB_D8iLltcq5xMFJYLF3oPNZVeirC9Q&s",
  },
  otherOptions: [...defaultHighlights],
  sections: [...defaultPolicySections, ...defaultContentSections, defaultClosingSection],
};
