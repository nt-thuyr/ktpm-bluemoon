import { Fee } from "@/lib/types/models/fee";

export const feesMock: Fee[] = [
  {
    id: 1,
    tenKhoanThu: "Phí vệ sinh",
    soTien: 30000,
    loaiPhi: "BatBuoc",
    ghiChu: "Thu hàng tháng",
  },
  {
    id: 2,
    tenKhoanThu: "Ủng hộ quỹ vì người nghèo",
    soTien: 50000,
    loaiPhi: "TuNguyen",
    ghiChu: null,
  },
];
