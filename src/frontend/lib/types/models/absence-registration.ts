// types/models/absence.ts

export type AbsenceStatus = "TamTru" | "TamVang" | "Unknown";

export interface AbsenceRegistration {
  id: number;
  nhanKhauId: number;
  hoTen: string;
  cccd: string;
  diaChi: string;
  trangThaiRaw: string;
  loaiHinh: AbsenceStatus;
  ngayDangKy: string;
  noiDung: string;
}
