//types/models/fee.ts

export type Fee = {
  id: number;
  tenKhoanThu: string;
  soTien: number;
  isBatBuoc: boolean;
  ghiChu?: string | null;
  hanNop?: Date | string;
};
