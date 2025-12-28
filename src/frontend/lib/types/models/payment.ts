// DTO - Hứng dữ liệu thô từ API (Server Response)
export interface PaymentDTO {
  Id: number;
  HoKhauId: number;
  KhoanThuId: number;
  SoTien: number;
  NgayNop: string; // YYYY-MM-DD
  NguoiNop: string | null;
  TenKhoanThu?: string;
}

export interface PaymentReceiptDTO {
  ma_bien_lai: number;
  ngay_nop: string;
  nguoi_nop: string;
  cccd: string;
  ten_khoan_thu: string;
  so_tien: number;
  dia_chi: string;
}

// Dữ liệu sạch cho model dùng trong UI
export interface PaymentHistory {
  id: number;
  hoKhauId: number;
  khoanThuId: number;
  soTien: number;
  ngayNop: string;
  nguoiNop: string;

  tenKhoanThu?: string;
}

export interface PaymentReceipt {
  maBienLai: number;
  ngayNop: string;
  nguoiNop: string;
  cccd: string;
  tenKhoanThu: string;
  soTien: number;
  diaChi: string;
  soTienBangChu?: string;
}

// PAYLOAD - Dữ liệu gửi đi (Request) (backend se map lai cho chinh xac)
export interface CreatePaymentRequest {
  hoKhauId: number;
  khoanThuId: number;
  soTien: number;
  nguoiNop?: string;
  ngayNop?: string;
}
