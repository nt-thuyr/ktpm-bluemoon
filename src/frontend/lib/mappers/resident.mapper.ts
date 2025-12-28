import { ResidentApi, UpdateResidentRequest } from "../types/api/resident.api";
import { Resident } from "../types/models/resident";

// Map API to Model
export const mapResidentApiToModel = (raw: ResidentApi): Resident => {
  return {
    id: raw.id,
    hoTen: raw.HoTen,
    ngaySinh: raw.NgaySinh || null,
    gioiTinh: raw.GioiTinh,
    danToc: raw.DanToc || "Kinh",
    tonGiao: raw.TonGiao || "Không",
    cccd: raw.cccd || null,
    ngayCap: raw.NgayCap || null,
    noiCap: raw.NoiCap || null,
    ngheNghiep: raw.NgheNghiep || null,
    ghiChu: raw.GhiChu || null,

    hoKhauId: raw.HoKhauID || null,
    quanHeVoiChuHo: raw.QuanHeVoiChuHo || null,
    ngayThemNhanKhau: raw.NgayThemNhanKhau || null,
  };
};

// Convert từ Model (camelCase) -> API Payload (PascalCase) để gửi đi
export const mapResidentModelToApi = (
  data: Partial<Resident>
): UpdateResidentRequest => {
  return {
    HoTen: data.hoTen,
    // Logic quan trọng: Nếu chuỗi rỗng "" thì gửi null
    NgaySinh: data.ngaySinh === "" ? null : data.ngaySinh,
    GioiTinh: data.gioiTinh,
    DanToc: data.danToc,
    TonGiao: data.tonGiao,
    CCCD: data.cccd === "" ? null : data.cccd,
    NgayCap: data.ngayCap === "" ? null : data.ngayCap,
    NoiCap: data.noiCap,
    NgheNghiep: data.ngheNghiep,
    GhiChu: data.ghiChu,

    HoKhauID: data.hoKhauId,
    QuanHeVoiChuHo: data.quanHeVoiChuHo,
    NgayThemNhanKhau:
      data.ngayThemNhanKhau === "" ? null : data.ngayThemNhanKhau,
  };
};
