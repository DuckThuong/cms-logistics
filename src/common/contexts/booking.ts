import type { RowDef, VehicleConfig, VehicleType } from "@/common/types/booking";

export const formatVnd = (amount: number) =>
  `${amount.toLocaleString("vi-VN")}đ`;

export const getVehicleLayout = (
  vehicleType: VehicleType,
  floor: 1 | 2,
  config: VehicleConfig,
): RowDef[] => {
  if (vehicleType === "36") {
    return floor === 1 ? (config.floor1 ?? []) : (config.floor2 ?? []);
  }

  return config.layout ?? [];
};

