"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { feesMock as mockFees } from "@/lib/mocks/fees.mock"
import { Fee } from "@/lib/types/models/fee"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { EditFeeDialog } from "../fee/edit-fee-dialog"

export function FeesTable() {
    const [tableData, setTableData] = useState<Fee[]>(mockFees);
    // 2. State quản lý Dialog Edit
    const [editingFee, setEditingFee] = useState<Fee | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleEditClick = (fee: Fee) => {
        setEditingFee(fee);
        setIsEditOpen(true);
    };
    const handleSaveChanges = (updatedFee: Fee) => {
        const newData = tableData.map((item) =>
            item.id === updatedFee.id ? updatedFee : item
        );
        setTableData(newData);
    };
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
                    {tableData.map((fee) => (
                        <TableRow key={fee.id}>
                            <TableCell className="font-medium">{fee.id}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">{fee.tenKhoanThu}</span>
                                    <span className="text-xs text-muted-foreground">{fee.ghiChu}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {fee.loaiPhi === "BatBuoc" ? (
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
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                        <DropdownMenuItem className="cursor-pointer"
                                            onClick={() => handleEditClick(fee)} >
                                            <Edit className="mr-2 h-4 w-4 text-blue-600"
                                            /> Sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Xóa
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
        </div>
    )
}