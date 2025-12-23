"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { Household } from "@/lib/types/models/household";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { DeleteHouseholdDialog } from "./DeleteHouseholdDialog";

// Mock data (Sau này sẽ nhận từ props)
const mockData: Household[] = [
    {
        id: "HK001",
        chuHo: "Nguyễn Văn A",
        soNha: "12",
        duong: "Nguyễn Trãi",
        phuong: "Thanh Xuân Trung",
        quan: "Thanh Xuân",
        ngayLap: "2020-01-15",
        soThanhVien: 4,
    },
    {
        id: "HK002",
        chuHo: "Trần Thị B",
        soNha: "45B",
        duong: "Lê Văn Lương",
        phuong: "Nhân Chính",
        quan: "Thanh Xuân",
        ngayLap: "2021-03-10",
        soThanhVien: 2,
    },
];

interface HouseholdsTableProps {
    data?: Household[];
}

export function HouseholdsTable({ data = mockData }: HouseholdsTableProps) {
    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[100px]">Số Hộ Khẩu</TableHead>
                        <TableHead>Chủ Hộ</TableHead>
                        <TableHead>Địa chỉ</TableHead>
                        <TableHead>Ngày lập</TableHead>
                        <TableHead className="text-center">Thành viên</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium text-blue-900">{item.id}</TableCell>
                            <TableCell className="font-semibold">{item.chuHo}</TableCell>
                            <TableCell className="max-w-[250px] truncate" title={`${item.soNha}, ${item.duong}, ${item.phuong}, ${item.quan}`}>
                                {item.soNha}, {item.duong}, {item.phuong}...
                            </TableCell>
                            <TableCell>{item.ngayLap}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                    {item.soThanhVien} người
                                </Badge>
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
                                        <DropdownMenuItem asChild>
                                            <Link href={`/households/${item.id}`} className="cursor-pointer flex items-center">
                                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer text-blue-600">
                                            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Xóa hộ khẩu
                                        </DropdownMenuItem> */}
                                        <DeleteHouseholdDialog
                                            householdId={item.id}
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