"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Resident } from "@/lib/types/resident"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeleteResidentDialog } from "./DeleteResidentDialog"
import { EditResidentDialog } from "./EditResidentDialog"


// Hàm tiện ích: Render Badge trạng thái
const getStatusBadge = (status: Resident["trangThai"]) => {
  switch (status) {
    case "ThuongTru":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none font-medium">
          Thường trú
        </Badge>
      );
    case "TamTru":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 shadow-none font-medium">
          Tạm trú
        </Badge>
      );
    case "TamVang":
      return (
        <Badge variant="outline" className="text-slate-500 border-slate-300 bg-slate-50 shadow-none font-medium">
          Tạm vắng
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Mock Data để test hiển thị
const mockData: Resident[] = [
  {
    id: "CD001",
    hoTen: "Nguyễn Văn A",
    ngaySinh: "1985-05-20",
    gioiTinh: "Nam",
    danToc: "Kinh",
    tonGiao: "Không",
    cccd: "001085000123",
    ngayCapCccd: "2021-01-01",
    noiCapCccd: "Cục CS QLHC",
    ngheNghiep: "Kỹ sư phần mềm",
    householdId: "HK001",
    quanHeVoiChuHo: "Chủ hộ",
    trangThai: "ThuongTru"
  },
  {
    id: "CD002",
    hoTen: "Trần Thị B",
    ngaySinh: "1990-10-15",
    gioiTinh: "Nữ",
    danToc: "Kinh",
    tonGiao: "Không",
    cccd: "001090000456",
    ngayCapCccd: "2021-02-15",
    noiCapCccd: "Cục CS QLHC",
    ngheNghiep: "Giáo viên",
    householdId: "HK001",
    quanHeVoiChuHo: "Vợ",
    trangThai: "ThuongTru"
  },
  {
    id: "CD003",
    hoTen: "Lê Văn C",
    ngaySinh: "2000-12-01",
    gioiTinh: "Nam",
    danToc: "Kinh",
    tonGiao: "Thiên chúa",
    cccd: "001200000789",
    ngayCapCccd: "2022-05-20",
    noiCapCccd: "Hà Nội",
    ngheNghiep: "Sinh viên",
    householdId: "HK002",
    quanHeVoiChuHo: "Cháu",
    trangThai: "TamTru"
  }
];

interface ResidentsTableProps {
  data?: Resident[];
}

export function ResidentsTable({ data = mockData }: ResidentsTableProps) {
  const [tableData, setTableData] = useState<Resident[]>(data);

  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletingResident, setDeletingResident] = useState<Resident | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident); // Lưu thông tin người cần sửa
    setIsEditOpen(true);          // Mở dialog lên
  };
  const handleSaveChanges = (updatedResident: Resident) => {
    const newData = tableData.map((item) =>
      item.id === updatedResident.id ? updatedResident : item
    );
    setTableData(newData);
  };

  const handleDeleteClick = (resident: Resident) => {
    setDeletingResident(resident);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingResident) {
      // Lọc bỏ người có ID trùng với người đang xóa
      const newData = tableData.filter(item => item.id !== deletingResident.id);
      setTableData(newData);

      // alert(`Đã xóa cư dân: ${deletingResident.hoTen}`);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="min-w-[200px]">Họ và Tên</TableHead>
              <TableHead>Thông tin cá nhân</TableHead>
              <TableHead>CCCD / CMND</TableHead>
              <TableHead>Nơi cư trú</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-slate-50/60 whitespace-nowrap">
                {/* STT */}
                <TableCell className="text-muted-foreground text-xs">
                  {index + 1}
                </TableCell>

                {/* Cột Họ Tên + Avatar */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{item.hoTen}</span>
                      <span className="text-xs text-muted-foreground">{item.ngheNghiep}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Cột Thông tin cá nhân (Ngày sinh + Giới tính) */}
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="text-slate-700">{item.ngaySinh}</span>
                    <span className="text-xs text-muted-foreground">{item.gioiTinh} • {item.danToc}</span>
                  </div>
                </TableCell>

                {/* Cột CCCD */}
                <TableCell className="font-mono text-sm text-slate-600">
                  {item.cccd}
                </TableCell>

                {/* Cột Hộ khẩu + Quan hệ */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {/* Link bấm vào để sang xem chi tiết hộ */}
                    <Link
                      href={`/households/${item.householdId}`}
                      className="text-primary font-medium hover:underline text-sm"
                    >
                      {item.householdId}
                    </Link>
                    <span className="text-xs text-slate-500 bg-slate-100 w-fit px-1.5 py-0.5 rounded">
                      {item.quanHeVoiChuHo}
                    </span>
                  </div>
                </TableCell>

                {/* Cột Trạng thái */}
                <TableCell>
                  {getStatusBadge(item.trangThai)}
                </TableCell>

                {/* Cột Thao tác */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4 text-slate-500" />
                        Xem hồ sơ
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"
                        onClick={() => handleEditClick(item)}>
                        <Pencil className="mr-2 h-4 w-4 text-blue-600" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDeleteClick(item)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa cư dân
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <EditResidentDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          resident={editingResident}
          onSave={handleSaveChanges}
        />
        <DeleteResidentDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          resident={deletingResident}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  )
}