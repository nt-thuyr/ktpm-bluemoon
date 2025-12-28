// mappers/household.mapper.ts
import {
  HouseholdApi,
  HouseholdMemberApi,
} from "@/lib/types/api/household.api";
import { Household, HouseholdMember } from "@/lib/types/models/household";

const mapMember = (api: HouseholdMemberApi): HouseholdMember => ({
  id: api.id,
  hoTen: api.HoTen,
  cccd: api.CCCD || "",
  quanHe: api.QuanHe || "Thành viên",
});

//  tạo địa chỉ từ các mảnh nhỏ
const formatAddress = (
  soNha: string | null,
  duong: string | null,
  phuong: string | null,
  quan: string | null
): string => {
  return [soNha, duong, phuong, quan]
    .filter(Boolean) // Lọc bỏ null, undefined, ""
    .join(", ");
};

export const mapHouseholdModelToApi = (
  model: Partial<Household>
): Partial<HouseholdApi> => {
  return {
    SoNha: model.soNha || undefined, // undefined để nếu ko sửa thì ko gửi
    Duong: model.duong || undefined,
    Phuong: model.phuong || undefined,
    Quan: model.quan || undefined,
    DienTich: model.dienTich ? Number(model.dienTich) : undefined,

    // Backend cần ID chủ hộ
    ChuHoID: model.chuHoId || undefined,

    // Xử lý ngày: Date -> String "YYYY-MM-DD"
    NgayLamHoKhau: model.ngayLap
      ? new Date(model.ngayLap).toISOString().split("T")[0]
      : undefined,
  };
};

export const mapHouseholdApiToModel = (api: HouseholdApi): Household => ({
  id: api.SoHoKhau,
  soNha: api.SoNha,
  duong: api.Duong,
  phuong: api.Phuong,
  quan: api.Quan,
  diaChi: formatAddress(api.SoNha, api.Duong, api.Phuong, api.Quan),

  dienTich: api.DienTich || 0,
  ngayLap: api.NgayLamHoKhau ? new Date(api.NgayLamHoKhau) : null,

  chuHoId: api.ChuHoID || null,
  tenChuHo: api.TenChuHo || "Chưa xác định",

  thanhVien: api.ThanhVien.map((tv) => ({
    id: tv.id,
    hoTen: tv.HoTen,
    cccd: tv.CCCD,
    quanHe: tv.QuanHe,
  })),
});
