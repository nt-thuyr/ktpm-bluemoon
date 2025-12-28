export interface HouseholdMemberApi {
  id: number;
  HoTen: string;
  CCCD: string | null;
  QuanHe: string;
}

export interface HouseholdApi {
  SoHoKhau: number; // Backend là so_ho_khau
  SoNha: string;
  Duong: string;
  Phuong: string;
  Quan: string;
  DienTich: number;
  NgayLamHoKhau: string | null;
  ChuHoID: number | null;
  TenChuHo: string | null;
  ThanhVien: HouseholdMemberApi[]; // Danh sách thành viên
}

// 3. Payload để Tạo mới Hộ khẩu
export interface CreateHouseholdRequest {
  ChuHoID: number;
  SoNha: string;
  Duong: string;
  Phuong: string;
  Quan: string;
  DienTich: number;
  NgayLamHoKhau?: string; // "YYYY-MM-DD"
}
