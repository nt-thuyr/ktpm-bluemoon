// types/models/household.model.ts
export interface Household {
  id: number;
  soNha: string | null;
  duong: string | null;
  phuong: string | null;
  quan: string | null;
  diaChi: string; // Ghép từ SoNha + Duong + Phuong...

  dienTich: number;
  ngayLap: Date | null;

  chuHoId: number | null;
  tenChuHo: string | null;

  thanhVien: HouseholdMember[];
}

export interface HouseholdMember {
  id: number;
  hoTen: string;
  cccd: string | null;
  quanHe: string | null;
}

export const APARTMENT_INFO = {
  DUONG: "Giải Phóng",
  PHUONG: "Đồng Tâm",
  QUAN: "Hai Bà Trưng",
};

// lich su hộ khẩu
export type HouseholdHistory = {
  id: number;
  hanhDong: string;
  nguoiThucHien: string;
  thoiGian: string;
  ghiChu?: string;
  // chiTiet?: string;   // Nếu có lưu thay đổi cụ thể (Cũ -> Mới)
};
