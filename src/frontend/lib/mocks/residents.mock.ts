// lib/data/residents.mock.ts
import { Resident } from "@/lib/types/models/resident";

export const residentsMock: Resident[] = [
  {
    id: "1", // Nên ép về String để thống nhất với Type Resident
    hoTen: "Nguyễn Văn A",
    ngaySinh: new Date("2000-05-12"), // Nên để string ISO nếu Type Resident là string. Nếu Type là Date thì giữ nguyên new Date()
    // Giả sử Type Resident của bạn định nghĩa ngaySinh là string (ISO) cho dễ map
    gioiTinh: "Nam",
    danToc: "Kinh",
    tonGiao: "",
    cccd: "012345678901",
    ngayCap: new Date("2018-06-15"),
    noiCap: "Hà Nội",
    ngheNghiep: "Sinh viên",
    ghiChu: "",
    householdId: "HK001",
    quanHeVoiChuHo: "Chủ hộ",
    ngayThemNhanKhau: new Date("2020-01-10"),
  },
  {
    id: "2",
    hoTen: "Trần Thị B",
    ngaySinh: new Date("1998-11-23"),
    gioiTinh: "Nữ",
    danToc: "Kinh",
    tonGiao: "",
    cccd: "",
    ngayCap: new Date(""),
    noiCap: "",
    ngheNghiep: "Sinh viên",
    ghiChu: "Tạm trú",
    householdId: "HK001",
    quanHeVoiChuHo: "Con",
    ngayThemNhanKhau: new Date("2020-01-10"),
  },
];
