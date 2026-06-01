import type { CompanyInformationContent } from "./types";

export const COMPANY_INFORMATION_DEFAULTS: CompanyInformationContent = {
  seoUrl: "/about",
  pageTag: "Về Công Ty Logistics",
  pageTitle: "Giới Thiệu",
  pageSubtitle:
    "Đơn vị trung gian uy tín trong lĩnh vực đặt hàng, thanh toán ủy thác và vận chuyển hàng hóa từ Trung Quốc về Việt Nam.",
  introTitle: "Giới thiệu tổng quan",
  introAnchor: "gioi-thieu-tong-quan",
  introContent:
    "Công Ty Logistics là đơn vị trung gian cung cấp các dịch vụ: Đặt hàng, Thanh toán ủy thác và Vận chuyển hàng hóa từ Trung Quốc về Việt Nam.",
  introImageUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrR3pcB_D8iLltcq5xMFJYLF3oPNZVeirC9Q&s",
  headerExtras: [
    {
      id: "detail",
      title: "Chi tiết nội dung",
      description: "Bạn có thể thêm các thẻ/đoạn mô tả tuỳ biến ở phần header.",
    },
  ],
  policySections: [
    {
      id: "policy-services",
      title: "I. Các dịch vụ do Công Ty Logistics cung cấp:",
      anchor: "dich-vu",
      content: [
        "Tư vấn tìm kiếm nguồn hàng trên các website bán buôn, bán lẻ hàng đầu Trung Quốc.",
        "Mua hàng hộ và Kiểm tra hàng hóa.",
        "Thanh toán hộ đơn hàng theo ủy thác, ký gửi hàng hóa theo yêu cầu.",
        "Đóng gói và Vận chuyển hàng hóa về Việt Nam.",
      ],
    },
    {
      id: "policy-refusals",
      title:
        "II. Công Ty Logistics từ chối cung cấp dịch vụ khi khách hàng có hành vi sau:",
      anchor: "tu-choi",
      content: [
        "Phát tán hoặc đăng tải thông tin sai sự thật gây ảnh hưởng đến uy tín doanh nghiệp.",
        "Gian lận trong giao dịch và công nợ.",
        "Cố ý mua bán sản phẩm thuộc danh mục cấm nhập khẩu.",
      ],
    },
  ],
  sections: [
    {
      id: "sec-1",
      anchor: "tong-quan",
      title: "Tổng quan",
      description: "Khối nội dung dạng section (có thể thêm/xóa).",
      content:
        "Đây là nội dung section mẫu. Bạn có thể nhập nhiều dòng, hoặc dán nội dung từ tài liệu.",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrR3pcB_D8iLltcq5xMFJYLF3oPNZVeirC9Q&s",
    },
  ],
  closingLineOne:
    "Công Ty Logistics xin chân thành cảm ơn và mong muốn được đồng hành cùng Quý Khách hàng!",
  closingLineTwo: "Trân trọng!",
  highlights: [
    { id: "experience", label: "10+ năm kinh nghiệm" },
    { id: "daily-orders", label: "800+ đơn/ngày" },
    { id: "customers", label: "10K+ khách hàng" },
  ],
  quickLinks: [],
};
