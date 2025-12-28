import {
  PaymentDTO,
  PaymentHistory,
  PaymentReceipt,
  PaymentReceiptDTO,
} from "../types/models/payment";

// 1. Map từ DTO danh sách sang Model UI
export const mapPaymentToUI = (dto: PaymentDTO): PaymentHistory => {
  return {
    id: dto.Id,
    hoKhauId: dto.HoKhauId,
    khoanThuId: dto.KhoanThuId,
    soTien: dto.SoTien,
    ngayNop: dto.NgayNop,
    nguoiNop: dto.NguoiNop || "Không xác định", // Handle null từ BE
  };
};

// 2. Map từ DTO hóa đơn (PDF) sang Model UI
export const mapReceiptToUI = (dto: PaymentReceiptDTO): PaymentReceipt => {
  return {
    maBienLai: dto.ma_bien_lai,
    ngayNop: dto.ngay_nop
      ? new Date(dto.ngay_nop).toLocaleDateString("vi-VN")
      : "",
    nguoiNop: dto.nguoi_nop,
    cccd: dto.cccd,
    tenKhoanThu: dto.ten_khoan_thu,
    soTien: dto.so_tien,
    diaChi: dto.dia_chi,
  };
};
