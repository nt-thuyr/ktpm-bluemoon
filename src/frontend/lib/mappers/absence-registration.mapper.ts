import { AbsenceRegistrationDTO } from "../types/api/absence-registration.api";
import {
  AbsenceRegistration,
  AbsenceStatus,
} from "../types/models/absence-registration";

const mapStatusToEnum = (status: string): AbsenceStatus => {
  const s = status.toLowerCase();
  if (s.includes("vắng")) return "TamVang";
  if (s.includes("trú")) return "TamTru";
  return "Unknown";
};

export const mapRegistrationResponseToUI = (
  dto: AbsenceRegistrationDTO
): AbsenceRegistration => {
  return {
    id: dto.id,
    nhanKhauId: dto.NhanKhauID,
    hoTen: dto.HoTen || "Không xác định",
    cccd: dto.CCCD || "",
    diaChi: dto.DiaChi || "",

    trangThaiRaw: dto.TrangThai, // Hiển thị UI: "Tạm trú"
    loaiHinh: mapStatusToEnum(dto.TrangThai),

    ngayDangKy: dto.ThoiGian || "",
    noiDung: dto.NoiDungDeNghi || "",
  };
};
