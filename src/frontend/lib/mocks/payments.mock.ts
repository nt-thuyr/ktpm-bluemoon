import { Payment } from "@/lib/types/models/payment";

export const paymentsMock: Payment[] = [
  {
    id: 1,
    hoKhauId: 1,
    khoanThuId: 1,
    soTien: 30000,
    ngayNop: new Date("2024-11-01"),
    nguoiNop: "Nguyễn Văn A",
  },
  {
    id: 2,
    hoKhauId: 2,
    khoanThuId: 1,
    soTien: 30000,
    ngayNop: new Date("2024-11-01"),
    nguoiNop: "Lê Văn C",
  },
];
