export interface Resident {
  id: number; // Backend là Integer -> number
  hoTen: string;
  ngaySinh: string | null; // Date backend trả về ISO string "YYYY-MM-DD" hoặc null
  gioiTinh: string;
  danToc: string;
  tonGiao: string;
  cccd: string | null;
  ngayCap: string | null;
  noiCap: string | null;
  ngheNghiep: string | null;
  ghiChu: string | null;

  hoKhauId: number | null;
  quanHeVoiChuHo: string | null;
  ngayThemNhanKhau: string | null;
}

export interface CreateResidentRequest
  extends Omit<Resident, "id" | "ngayThemNhanKhau"> {}

export interface UpdateResidentRequest extends Partial<CreateResidentRequest> {}

export interface ResidentsResponse {
  residents: Resident[];
  total: number;
}
