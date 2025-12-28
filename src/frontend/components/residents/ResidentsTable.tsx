"use client"

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

import { Resident } from "@/lib/types/models/resident"
// Giả sử bạn đã có file constants này, nếu chưa thì tự define object map nhé
import { GENDER_MAP, RELATION_MAP } from "@/lib/utils/contant"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeleteResidentDialog } from "./DeleteResidentDialog"
import { EditResidentDialog } from "./EditResidentDialog"

interface ResidentsTableProps {
  data: Resident[];
  isLoading: boolean;
  // SỬA: Return Promise<boolean> để khớp với Hook
  onUpdate: (id: string, data: Partial<Resident>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  householdOptions: { value: string; label: string }[];
}

// Format ngày tháng
const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
}


export function ResidentsTable({
  data,
  isLoading,
  onUpdate,
  onDelete,
  householdOptions
}: ResidentsTableProps) {

  // State Modal
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletingResident, setDeletingResident] = useState<Resident | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- Handlers ---

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident);
    setIsEditOpen(true);
  };

  const handleSaveChanges = async (id: string, updatedData: Partial<Resident>) => {
    const success = await onUpdate(id, updatedData);
    if (success) {
      setIsEditOpen(false);
      setEditingResident(null);
    }
  };

  const handleDeleteClick = (resident: Resident) => {
    setDeletingResident(resident);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingResident && deletingResident.id) {
      await onDelete(deletingResident.id.toString());
      setIsDeleteOpen(false);
      setDeletingResident(null);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead className="min-w-[180px]">Họ và Tên</TableHead>
              <TableHead className="min-w-[150px]">Thông tin cá nhân</TableHead>
              <TableHead className="text-center">CCCD / CMND</TableHead>
              <TableHead>Nơi cư trú</TableHead>
              {/* Mở lại cột trạng thái */}
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-right pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Chưa có dữ liệu cư dân
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50/60 whitespace-nowrap">
                  <TableCell className="text-muted-foreground text-xs text-center">{index + 1}</TableCell>

                  {/* Họ Tên */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{item.hoTen}</span>
                      <span className="text-xs text-muted-foreground">{item.ngheNghiep || ""}</span>
                    </div>
                  </TableCell>

                  {/* Thông tin cá nhân */}
                  <TableCell className="py-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-slate-700">
                        {formatDate(item.ngaySinh)}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {GENDER_MAP[item.gioiTinh as keyof typeof GENDER_MAP] || item.gioiTinh} &bull; {item.danToc}
                      </span>
                    </div>
                  </TableCell>

                  {/* CCCD */}
                  <TableCell className="text-center">
                    {item.cccd ? (
                      <span className="font-mono text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {item.cccd}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">--</span>
                    )}
                  </TableCell>

                  {/* Nơi cư trú */}
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      {item.hoKhauId ? (
                        <Link
                          href={`/households/${item.hoKhauId}`}
                          className="text-blue-600 font-medium hover:underline text-sm"
                        >
                          Mã hộ: {item.hoKhauId}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Chưa có hộ</span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border w-fit ${item.quanHeVoiChuHo === 'Chủ hộ'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {RELATION_MAP[item.quanHeVoiChuHo as keyof typeof RELATION_MAP] || item.quanHeVoiChuHo || 'Khác'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Thao tác */}
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
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
              ))
            )}
          </TableBody>
        </Table>

        {/* Modal Edit */}
        <EditResidentDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          resident={editingResident}
          onSave={handleSaveChanges}
          householdOptions={householdOptions}
        />

        {/* Modal Delete */}
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