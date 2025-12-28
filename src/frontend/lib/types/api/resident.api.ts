// Raw data from BE
export interface ResidentApi {
  id: number;
  HoTen: string;
  NgaySinh?: string | null;
  GioiTinh: string;
  DanToc: string;
  TonGiao: string;
  CCCD?: string | null;
  cccd?: string | null;
  NgayCap?: string | null;
  NoiCap?: string | null;
  NgheNghiep?: string | null;
  GhiChu?: string | null;

  HoKhauID?: number | null;
  QuanHeVoiChuHo?: string | null;
  NgayThemNhanKhau?: string | null;
}

// Payload khi Tạo mới (Create)
export interface CreateResidentRequest {
  HoTen: string;
  NgaySinh?: string | null;
  GioiTinh: string;
  DanToc?: string;
  TonGiao?: string;
  CCCD?: string | null;
  NgayCap?: string | null;
  NoiCap?: string | null;
  NgheNghiep?: string | null;
  GhiChu?: string | null;

  HoKhauID?: number | null;
  QuanHeVoiChuHo?: string | null;
  NgayThemNhanKhau?: string | null;
}

export interface UpdateResidentRequest extends Partial<CreateResidentRequest> {}
