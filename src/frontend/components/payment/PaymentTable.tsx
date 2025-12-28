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
import { PaymentHistory } from "@/lib/types/models/payment";

import { MoreHorizontal, Printer, Trash2 } from "lucide-react";

interface PaymentTableProps {
    data: PaymentHistory[];
    isLoading: boolean;
    onDelete: (id: number) => void;
    onViewReceipt: (id: number) => void;
}

export function PaymentTable({
    data,
    isLoading,
    onDelete,
    onViewReceipt,
}: PaymentTableProps) {

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("vi-VN");
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
                    <TableRow className="bg-muted/50">
                        <TableHead>Mã BL</TableHead>
                        <TableHead>Ngày nộp</TableHead>
                        <TableHead>Người nộp</TableHead>
                        <TableHead>Khoản thu</TableHead>
                        <TableHead className="text-right">Số tiền</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Chưa có dữ liệu.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">#{item.id}</TableCell>

                                {/* Dùng hàm format vừa viết */}
                                <TableCell>{formatDate(item.ngayNop)}</TableCell>

                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.nguoiNop}</span>
                                        <span className="text-xs text-muted-foreground">Hộ khẩu ID: {item.hoKhauId}</span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        ID: {item.khoanThuId} {item.tenKhoanThu}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right font-bold text-green-600">
                                    {formatMoney(item.soTien)}
                                </TableCell>

                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onViewReceipt(item.id)}>
                                                <Printer className="mr-2 h-4 w-4" /> In hóa đơn
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete(item.id)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Xóa bản ghi
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