"use client"

import { Badge } from "@/components/ui/badge"
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
import { UpdateFeeRequest } from "@/lib/services/fee"
import { Fee } from "@/lib/types/models/fee"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { DeleteFeeDialog } from "./delete-fee-dialog"
import { EditFeeDialog } from "./edit-fee-dialog"

interface FeesTableProps {
    data: Fee[];
    isLoading: boolean;
    onDelete: (id: number) => Promise<void>;
    onUpdate: (id: number, data: UpdateFeeRequest) => Promise<boolean>;
}

export function FeesTable({ data, isLoading, onDelete, onUpdate }: FeesTableProps) {

    const [editingFee, setEditingFee] = useState<Fee | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [deletingFee, setDeletingFee] = useState<Fee | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Logic edit
    const handleEditClick = (fee: Fee) => {
        setEditingFee(fee);
        setIsEditOpen(true);
    };

    const handleSaveChanges = async (updatedFee: Fee) => {
        const success = await onUpdate(updatedFee.id, {
            TenKhoanThu: updatedFee.tenKhoanThu,
            SoTien: updatedFee.soTien,
            BatBuoc: updatedFee.isBatBuoc,
            GhiChu: updatedFee.ghiChu,
            HanNop: updatedFee.hanNop ? String(updatedFee.hanNop) : null,
        });

        if (success) {
            setIsEditOpen(false);
        }
    };

    // Logic delete
    const handleDeleteClick = (fee: Fee) => {
        setDeletingFee(fee);
        setIsDeleteOpen(true);
    }

    const handleConfirmDelete = async (id: number) => {
        await onDelete(id);
    }


    if (isLoading && data.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>
    }
    return (
        <div className="w-full rounded-lg border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[100px]">Mã KT</TableHead>
                        <TableHead>Tên khoản thu</TableHead>
                        <TableHead>Loại phí</TableHead>
                        <TableHead>Đơn giá / Mức thu</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((fee) => (
                        <TableRow key={fee.id}>
                            <TableCell className="font-medium">{fee.id}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">{fee.tenKhoanThu}</span>
                                    <span className="text-xs text-muted-foreground">{fee.ghiChu}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {fee.isBatBuoc ? (
                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 shadow-none">Bắt buộc</Badge>
                                ) : (
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 shadow-none">Tự nguyện</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {fee.soTien && fee.soTien > 0
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.soTien)
                                    : <span className="text-slate-500 italic">Theo thực tế</span>
                                }
                            </TableCell>

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
                                        <DropdownMenuItem className="cursor-pointer"
                                            onClick={() => handleEditClick(fee)}>
                                            <Pencil className="mr-2 h-4 w-4 text-blue-600" /> Chỉnh sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                            onClick={() => handleDeleteClick(fee)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditFeeDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                fee={editingFee}
                onSave={handleSaveChanges}
            />
            <DeleteFeeDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                fee={deletingFee}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}