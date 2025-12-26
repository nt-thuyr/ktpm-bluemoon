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
import { useResidents } from "@/lib/hooks/use-residents"
import { absenceRegistrationsMock } from "@/lib/mocks/absence.mock"
import { Resident } from "@/lib/types/models/resident"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeleteResidentDialog } from "./DeleteResidentDialog"
import { EditResidentDialog } from "./EditResidentDialog"

// --- Helper Functions ---
const getResidenceStatus = (residentId: number) => {
  // [TODO] Sau này nên lấy status từ API resident luôn
  const record = absenceRegistrationsMock.find(
    (r) => r.residentId === String(residentId)
  );
  if (!record) return "ThuongTru";
  return record.loaiHinh;
};

const getStatusBadge = (status: "ThuongTru" | "TamTru" | "TamVang") => {
  switch (status) {
    case "ThuongTru":
      return <Badge className="bg-green-100 text-green-700 border-green-200">Thường trú</Badge>;
    case "TamTru":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Tạm trú</Badge>;
    case "TamVang":
      return <Badge className="text-slate-500 border-slate-300 bg-slate-50">Tạm vắng</Badge>;
  }
};

//Format ngày tháng (Hỗ trợ cả String ISO lẫn Date Object)
const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN'); // Trả về dd/mm/yyyy
}

export function ResidentsTable() {
  // Lấy dữ liệu và hàm từ Hook
  const {
    residents,
    isLoading,
    updateResident,
    deleteResident
  } = useResidents();

  // State cho Modal
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletingResident, setDeletingResident] = useState<Resident | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- Handlers ---

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident);
    setIsEditOpen(true);
  };

  // lưu Edit gọi API
  const handleSaveChanges = async (updatedData: Resident) => {
    if (!updatedData.id) return;
    await updateResident.mutateAsync(updatedData.id, updatedData);
    setIsEditOpen(false);
    setEditingResident(null);
  };

  const handleDeleteClick = (resident: Resident) => {
    setDeletingResident(resident);
    setIsDeleteOpen(true);
  };
  // Xử lý xóa gọi API
  const handleConfirmDelete = async () => {
    if (deletingResident && deletingResident.id) {
      // Gọi API xóa
      await deleteResident.mutateAsync(deletingResident.id);
      // Thành công thì đóng modal
      setIsDeleteOpen(false);
      setDeletingResident(null);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Đang tải dữ liệu...</div>;
  }


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
            {residents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Chưa có dữ liệu cư dân
                </TableCell>
              </TableRow>
            ) : (
              residents.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50/60 whitespace-nowrap">
                  <TableCell className="text-muted-foreground text-xs">{index + 1}</TableCell>

                  {/* Cột Họ Tên*/}
                  <TableCell className="w-[180px] py-3 pr-2">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-left">{item.hoTen}</span>
                        <span className="text-xs text-muted-foreground text-left">{item.ngheNghiep}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-left w-[140px] py-3 pl-2"> {/* Căn giữa ô */}
                    <div className="flex flex-col items-start justify-center"> {/* Xếp dọc + Căn giữa */}
                      <span className="font-medium text-slate-700">
                        {formatDate(item.ngaySinh)}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {/* Dấu chấm ở giữa nhìn cho nguy hiểm */}
                        {item.gioiTinh} &bull; {item.danToc}
                      </span>
                    </div>
                  </TableCell>

                  {/* Cột CCCD */}
                  <TableCell className="text-center">
                    {item.cccd ? (
                      <span className="font-mono text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {item.cccd}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">--</span>
                    )}
                  </TableCell>

                  {/* Cột Hộ khẩu + Quan hệ */}
                  <TableCell>
                    <div className="flex flex-col items-start gap-1.5">
                      {item.householdId ? (
                        <Link
                          href={`/households/${item.householdId}`}
                          className="text-primary font-medium hover:underline text-sm"
                        >
                          Mã hộ: {item.householdId}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Chưa có hộ</span>
                      )}

                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                        // Logic đổi màu badge cho sinh động (Optional)
                        item.quanHeVoiChuHo === 'Chủ hộ'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {item.quanHeVoiChuHo || 'Chưa xác định'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Cột Trạng thái */}
                  <TableCell className="text-center">
                    {getStatusBadge(getResidenceStatus(Number(item.id)))}
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
                        {/* <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                          Xem hồ sơ
                        </DropdownMenuItem> */}
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
              )
              ))
            }
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