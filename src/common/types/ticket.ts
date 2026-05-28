// ─── Types ───────────────────────────────────────────────

export interface TripAmenity {
  icon: string; // emoji hoặc text icon
  label: string;
}

export interface TripBadge {
  type: "green" | "amber" | "blue" | "gray" | "red";
  label: string;
}

export interface Trip {
  id: string;
  featured?: boolean;
  operator: {
    code: string; // 2 ký tự hiển thị trong logo
    logoColor: string;
    name: string;
    vehicleType: string;
    rating: number;
    reviewCount: string;
  };
  departure: { time: string; city: string; station: string };
  arrival: { time: string; city: string; station: string };
  duration: string;
  stopLabel: string;
  price: number;
  seatsLeft: number;
  badges: TripBadge[];
  amenities: TripAmenity[];
}

export type SeatType = "all" | "sleeper" | "seat" | "limousine" | "bus";
export type FilterKey = "all" | "morning" | "daytime" | "night" | "wifi" | "ac";
export type SortKey = "price" | "departure" | "duration" | "rating";

// ─── Seat types ──────────────────────────────────────────

export const SEAT_TYPES: { key: SeatType; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "sleeper", label: "Giường nằm" },
  { key: "seat", label: "Ghế ngồi" },
  { key: "limousine", label: "VIP Limousine" },
  { key: "bus", label: "Xe khách" },
];

// ─── Filter chips ─────────────────────────────────────────

export const FILTER_CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tất cả giờ" },
  { key: "morning", label: "🌅 Sáng sớm" },
  { key: "daytime", label: "☀️ Ban ngày" },
  { key: "night", label: "🌙 Ban đêm" },
  { key: "wifi", label: "📶 Có Wifi" },
  { key: "ac", label: "❄️ Điều hoà" },
];

// ─── Sort options ─────────────────────────────────────────

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price", label: "Giá thấp nhất" },
  { key: "departure", label: "Giờ khởi hành" },
  { key: "duration", label: "Thời gian ngắn nhất" },
  { key: "rating", label: "Đánh giá cao nhất" },
];

// ─── Fake trips ───────────────────────────────────────────

const BASE_FAKE_TRIPS: Trip[] = [
  {
    id: "t1",
    featured: true,
    operator: {
      code: "GR",
      logoColor: "#0a0e1a",
      name: "GoRide Express",
      vehicleType: "Giường nằm VIP 40 chỗ",
      rating: 4.9,
      reviewCount: "2.1k",
    },
    departure: { time: "06:00", city: "Hà Nội", station: "Bến xe Mỹ Đình" },
    arrival: {
      time: "14:00",
      city: "TP. Hồ Chí Minh",
      station: "Bến xe Miền Đông",
    },
    duration: "~32 tiếng",
    stopLabel: "Thẳng, không dừng",
    price: 350000,
    seatsLeft: 4,
    badges: [
      { type: "green", label: "✓ Còn vé" },
      { type: "amber", label: "🪑 Giường VIP" },
    ],
    amenities: [
      { icon: "📶", label: "Wifi miễn phí" },
      { icon: "❄️", label: "Điều hoà" },
      { icon: "📺", label: "Màn hình riêng" },
      { icon: "🔌", label: "Sạc USB" },
      { icon: "🍱", label: "Bữa ăn nhẹ" },
    ],
  },
  {
    id: "t2",
    operator: {
      code: "PH",
      logoColor: "#1a2a4a",
      name: "Phương Hà",
      vehicleType: "Giường nằm 36 chỗ",
      rating: 4.7,
      reviewCount: "856",
    },
    departure: { time: "08:30", city: "Hà Nội", station: "Bến xe Giáp Bát" },
    arrival: {
      time: "17:30",
      city: "TP. Hồ Chí Minh",
      station: "Bến xe Miền Đông",
    },
    duration: "~33 tiếng",
    stopLabel: "1 điểm dừng",
    price: 290000,
    seatsLeft: 12,
    badges: [
      { type: "green", label: "✓ Còn vé" },
      { type: "gray", label: "🛋 Giường thường" },
    ],
    amenities: [
      { icon: "📶", label: "Wifi" },
      { icon: "❄️", label: "Điều hoà" },
      { icon: "🔌", label: "Sạc USB" },
    ],
  },
  {
    id: "t3",
    operator: {
      code: "LX",
      logoColor: "#2d1a45",
      name: "Luxury Limousine",
      vehicleType: "Limousine VIP 9 chỗ",
      rating: 4.8,
      reviewCount: "430",
    },
    departure: { time: "20:00", city: "Hà Nội", station: "Đón tận nơi" },
    arrival: {
      time: "02:00",
      city: "TP. Hồ Chí Minh",
      station: "Giao tận nơi",
    },
    duration: "~30 tiếng",
    stopLabel: "Door-to-door",
    price: 650000,
    seatsLeft: 2,
    badges: [
      { type: "blue", label: "⭐ Limousine" },
      { type: "amber", label: "🔥 Hot" },
    ],
    amenities: [
      { icon: "📶", label: "Wifi 5G" },
      { icon: "❄️", label: "Điều hoà" },
      { icon: "📺", label: "TV riêng" },
      { icon: "🔌", label: "Sạc không dây" },
      { icon: "🍱", label: "Bữa ăn" },
      { icon: "💆", label: "Ghế massage" },
    ],
  },
];

const EXTRA_TIME_PAIRS: Array<{ departure: string; arrival: string }> = [
  { departure: "05:30", arrival: "13:30" },
  { departure: "07:15", arrival: "15:15" },
  { departure: "09:45", arrival: "17:45" },
  { departure: "11:30", arrival: "19:30" },
  { departure: "13:00", arrival: "21:00" },
  { departure: "15:20", arrival: "23:20" },
  { departure: "17:40", arrival: "01:40" },
  { departure: "19:10", arrival: "03:10" },
  { departure: "21:30", arrival: "05:30" },
];

export const FAKE_TRIPS: Trip[] = [
  ...BASE_FAKE_TRIPS,
  ...EXTRA_TIME_PAIRS.map((slot, index) => {
    const source = BASE_FAKE_TRIPS[index % BASE_FAKE_TRIPS.length];
    return {
      ...source,
      id: `${source.id}-x${index + 1}`,
      featured: index % 4 === 0,
      departure: { ...source.departure, time: slot.departure },
      arrival: { ...source.arrival, time: slot.arrival },
      price: source.price + (index + 1) * 15000,
      seatsLeft: Math.max(1, source.seatsLeft + ((index % 5) - 2)),
    };
  }),
];
