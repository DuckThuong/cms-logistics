export type SeatStatus = "available" | "booked" | "vip";
export type VehicleType = "16" | "36" | "45";

export interface SeatDef {
  id: string;
  status: SeatStatus;
}

export interface RowDef {
  row: number;
  seats: Array<SeatDef | null>;
  full?: boolean;
}

export interface VehicleConfig {
  label: string;
  icon: string;
  mapTitle: string;
  mapSub: string;
  floors: number;
  layout?: RowDef[];
  floor1?: RowDef[];
  floor2?: RowDef[];
  isSleeper?: boolean;
}

export type BookingPageData = {
  user: { userName: string; notifCount: number; phone: string | null };
  breadcrumb: { label: string; href: string }[];
  trip: {
    from: string;
    to: string;
    operatorCode: string;
    operatorName: string;
    departTime: string;
    arriveTime: string;
    arriveNote?: string;
    date: string;
    durationLabel: string;
    unitPrice: number;
  };
  passenger: {
    fullName: string;
    phone: string;
    pickupPointDefault: string;
    dropoffPointDefault: string;
    pickupPointOptions: Array<{ value: string; label: string }>;
    dropoffPointOptions: Array<{ value: string; label: string }>;
  };
};
