export type RegistrationResponse = {
  id: number;
  HoTen: string;
  NhanKhauId: string;
  TrangThai: "TamTru" | "TamVang";
  NgayDangKy: string;
};

export interface AbsenceRegistrationDTO {
  id: number;
  NhanKhauID: number;
  HoTen: string | null;
  CCCD: string | null;
  DiaChi: string | null;
  NoiDungDeNghi: string | null;
  TrangThai: string; // BE trả về "Tạm trú" hoặc "Tạm vắng"
  ThoiGian: string | null; // BE trả về string dạng 'YYYY-MM-DD'
}

// 3. PAYLOAD: Dữ liệu gửi lên để tạo mới (Dựa vào hàm create_tamtru)
export interface CreateRegistrationRequest {
  nhan_khau_id: number; // BE dùng: data.get("nhan_khau_id")
  trang_thai: string; // BE check: "Tạm trú" hoặc "Tạm vắng" -> Gửi chuỗi tiếng Việt
  dia_chi: string; // BE dùng: data.get("dia_chi")
  thoi_gian: string; // Format: YYYY-MM-DD
  noi_dung_de_nghi?: string; // BE dùng: data.get("noi_dung_de_nghi")
}

// 4. PAYLOAD: Dữ liệu gửi lên để update (Dựa vào hàm update_tamtru)
export interface UpdateRegistrationRequest {
  dia_chi?: string;
  noi_dung_de_nghi?: string;
  thoi_gian?: string; // YYYY-MM-DD
}
