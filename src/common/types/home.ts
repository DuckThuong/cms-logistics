// ─── Types ───────────────────────────────────────────────

export interface Service {
  id: string;
  icon: string;
  label: string;
  desc: string;
  tag?: string;
  tagColor?: "amber" | "green" | "red";
}

export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: string;
  expiry: string;
  bg: string;
  textColor?: string;
}

export interface Operator {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  routes: string;
  badge?: string;
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  operator: string;
  operatorLogo: string;
  departure: string;
  duration: string;
  seats: number;
  price: number;
  type: string;
  rating: number;
}

// ─── Services ─────────────────────────────────────────────

export const SERVICES: Service[] = [
  { id: "s1", icon: "🚌", label: "Xe khách", desc: "Liên tỉnh" },
  {
    id: "s2",
    icon: "🛵",
    label: "Xe máy",
    desc: "Nội thành",
    tag: "Hot",
    tagColor: "red",
  },
  { id: "s3", icon: "🚗", label: "Xe hợp đồng", desc: "Theo ngày" },
  {
    id: "s4",
    icon: "🚐",
    label: "Xe đưa đón",
    desc: "Sân bay",
    tag: "Mới",
    tagColor: "green",
  },
  { id: "s5", icon: "🚂", label: "Tàu hoả", desc: "Liên tỉnh" },
  {
    id: "s6",
    icon: "✈️",
    label: "Vé máy bay",
    desc: "Nội địa",
    tag: "Sale",
    tagColor: "amber",
  },
  { id: "s7", icon: "🏨", label: "Khách sạn", desc: "Combo tiết kiệm" },
  { id: "s8", icon: "🗺️", label: "Tour du lịch", desc: "Khám phá" },
];

// ─── Promos ───────────────────────────────────────────────

export const PROMOS: Promo[] = [
  {
    id: "p1",
    title: "Giảm ngay 50K",
    subtitle: "Cho chuyến xe đầu tiên trong tháng",
    code: "GORIDE50",
    discount: "50.000đ",
    expiry: "31/05/2026",
    bg: "#0a0e1a",
    textColor: "#fff",
  },
  {
    id: "p2",
    title: "Ưu đãi cuối tuần",
    subtitle: "Giảm 20% toàn bộ vé xe khách",
    code: "WEEKEND20",
    discount: "20%",
    expiry: "Mỗi T7 & CN",
    bg: "#f5a623",
    textColor: "#0a0e1a",
  },
  {
    id: "p3",
    title: "Combo Hà Nội – HCM",
    subtitle: "Vé + Khách sạn chỉ từ 990K",
    code: "COMBO990",
    discount: "990.000đ",
    expiry: "30/06/2026",
    bg: "#1a3a2a",
    textColor: "#fff",
  },
];

// ─── Operators ────────────────────────────────────────────

export const OPERATORS: Operator[] = [
  {
    id: "o1",
    name: "Phương Trang",
    logo: "PT",
    rating: 4.8,
    reviews: 12400,
    routes: "Hà Nội · HCM · Đà Nẵng",
    badge: "Top #1",
  },
  {
    id: "o2",
    name: "Thành Bưởi",
    logo: "TB",
    rating: 4.7,
    reviews: 8900,
    routes: "HCM · Đà Lạt · Nha Trang",
    badge: "Top #2",
  },
  {
    id: "o3",
    name: "Hoàng Long",
    logo: "HL",
    rating: 4.6,
    reviews: 7300,
    routes: "Hà Nội · Vinh · Huế",
    badge: "Top #3",
  },
  {
    id: "o4",
    name: "Kumho Samco",
    logo: "KS",
    rating: 4.6,
    reviews: 6100,
    routes: "HCM · Vũng Tàu · Cần Thơ",
  },
  {
    id: "o5",
    name: "Xe Canh Thịnh",
    logo: "CT",
    rating: 4.5,
    reviews: 4200,
    routes: "Hà Nội · Hải Phòng · QN",
  },
];

// ─── Top Trips ────────────────────────────────────────────

export const TOP_TRIPS: Trip[] = [
  {
    id: "t1",
    from: "Hà Nội",
    to: "Đà Nẵng",
    operator: "Phương Trang",
    operatorLogo: "PT",
    departure: "20:00 · Hôm nay",
    duration: "14 tiếng",
    seats: 8,
    price: 320000,
    type: "Giường nằm 40 chỗ",
    rating: 4.8,
  },
  {
    id: "t2",
    from: "HCM",
    to: "Đà Lạt",
    operator: "Thành Bưởi",
    operatorLogo: "TB",
    departure: "21:30 · Hôm nay",
    duration: "7 tiếng",
    seats: 14,
    price: 180000,
    type: "Limousine 22 chỗ",
    rating: 4.7,
  },
  {
    id: "t3",
    from: "Hà Nội",
    to: "Vinh",
    operator: "Hoàng Long",
    operatorLogo: "HL",
    departure: "06:00 · Ngày mai",
    duration: "5 tiếng",
    seats: 3,
    price: 150000,
    type: "Ghế ngồi 45 chỗ",
    rating: 4.6,
  },
  {
    id: "t4",
    from: "HCM",
    to: "Cần Thơ",
    operator: "Kumho Samco",
    operatorLogo: "KS",
    departure: "07:00 · Ngày mai",
    duration: "3.5 tiếng",
    seats: 22,
    price: 120000,
    type: "Xe Limousine",
    rating: 4.6,
  },
];
