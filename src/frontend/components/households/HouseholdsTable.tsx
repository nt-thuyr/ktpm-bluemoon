"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useHouseholds } from "@/lib/hooks/use-households";
import { Household } from "@/lib/types/models/household";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { DeleteHouseholdDialog } from "./DeleteHouseholdDialog";


interface HouseholdsTableProps {
    data?: Household[];
}

export function HouseholdsTable({ data = [] }: HouseholdsTableProps) {
    const {
        households,
        isLoading,
        fetchHouseholds,
        deleteHousehold
    } = useHouseholds();

    // Load dữ liệu khi vào trang
    useEffect(() => {
        fetchHouseholds();
    }, [fetchHouseholds]);


    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[100px]">Mã Hộ</TableHead>
                        <TableHead>Chủ Hộ</TableHead>
                        <TableHead className="w-[300px]">Địa chỉ</TableHead>
                        <TableHead>Ngày lập</TableHead>
                        <TableHead className="text-center">Thành viên</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                            {/* 1. Mã Hộ */}
                            <TableCell className="font-medium text-blue-900">
                                {item.id}
                            </TableCell>

                            {/* 2. Tên Chủ Hộ (Dùng tenChuHo từ Model) */}
                            <TableCell className="font-semibold text-slate-700">
                                {item.tenChuHo || <span className="italic text-slate-400">Chưa xác định</span>}
                            </TableCell>

                            {/* 3. Địa Chỉ (Dùng diaChi đã được Mapper ghép sẵn) */}
                            <TableCell className="max-w-[300px]" title={item.diaChi}>
                                <div className="truncate text-slate-600">
                                    {item.diaChi}
                                </div>
                            </TableCell>

                            {/* 4. Ngày Lập (Format Date Object) */}
                            <TableCell>
                                {item.ngayLap
                                    ? new Date(item.ngayLap).toLocaleDateString('vi-VN')
                                    : <span className="text-slate-400">--</span>}
                            </TableCell>

                            {/* 5. Số lượng thành viên (Đếm từ mảng) */}
                            <TableCell className="text-center">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    {item.thanhVien?.length || 0} người
                                </Badge>
                            </TableCell>

                            {/* 6. Thao tác */}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                                        <DropdownMenuItem asChild>
                                            <Link href={`/households/${item.id}`} className="cursor-pointer flex items-center">
                                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="cursor-pointer text-blue-600 focus:text-blue-700"
                                            onClick={() => {
                                                // Xử lý mở form edit ở đây
                                                // onEdit(item); 
                                            }}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        {/* Dialog Xóa */}
                                        <DeleteHouseholdDialog
                                            householdId={item.id.toString()}
                                            trigger={
                                                <DropdownMenuItem
                                                    onSelect={(e) => e.preventDefault()}
                                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa hộ khẩu
                                                </DropdownMenuItem>
                                            }
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}