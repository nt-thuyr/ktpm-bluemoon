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
} from "@/components/ui/table"; // Hoặc đường dẫn tới component Table của bạn
import { Calendar, MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { AbsenceRegistration } from "@/lib/types/models/absence-registration";
import { format } from "date-fns"; // Khuyên dùng thư viện này để format ngày

interface AbsenceTableProps {
    data: AbsenceRegistration[];
    isLoading: boolean;
    onEdit: (item: AbsenceRegistration) => void;
    onDelete: (id: number) => void;
}

export function AbsenceTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: AbsenceTableProps) {

    // Helper render Badge trạng thái
    const renderStatusBadge = (type: string, label: string) => {
        if (type === "TamTru") {
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none">
                    {label}
                </Badge>
            );
        }
        return (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 shadow-none">
                {label}
            </Badge>
        );
    };

    // Helper format ngày (Giả sử input là YYYY-MM-DD)
    const formatDateDisplay = (dateStr: string) => {
        try {
            if (!dateStr) return "N/A";
            return format(new Date(dateStr), "dd/MM/yyyy");
        } catch {
            return dateStr;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-48 flex items-center justify-center border rounded-md bg-white">
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Công dân</TableHead>
                        <TableHead>Loại hình</TableHead>
                        <TableHead>Địa chỉ & Nội dung</TableHead>
                        <TableHead>Ngày đăng ký</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                Không có bản ghi nào.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                {/* ID */}
                                <TableCell className="font-medium text-muted-foreground">
                                    #{item.id}
                                </TableCell>

                                {/* Tên & CCCD */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">
                                            {item.hoTen}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            CCCD: {item.cccd || "Chưa cập nhật"}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Loại hình (Badge) */}
                                <TableCell>
                                    {renderStatusBadge(item.loaiHinh, item.trangThaiRaw)}
                                </TableCell>

                                {/* Địa chỉ */}
                                <TableCell className="max-w-[250px]">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-start gap-1 text-sm text-gray-700">
                                            <MapPin className="w-3 h-3 mt-1 text-muted-foreground" />
                                            <span className="truncate">{item.diaChi}</span>
                                        </div>
                                        {item.noiDung && (
                                            <span className="text-xs text-muted-foreground italic truncate pl-4">
                                                "{item.noiDung}"
                                            </span>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Thời gian */}
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                        {formatDateDisplay(item.ngayDangKy)}
                                    </div>
                                </TableCell>

                                {/* Actions Dropdown */}
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                                            <DropdownMenuItem onClick={() => onEdit(item)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => onDelete(item.id)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Xóa bản ghi
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}