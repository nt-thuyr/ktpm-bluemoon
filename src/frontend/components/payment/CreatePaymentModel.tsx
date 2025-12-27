import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreatePaymentRequest } from "@/lib/types/models/payment";
import { useEffect, useState } from "react";
import { ResidentSelect } from "../residents/ResidentSelect";

interface PaymentCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreatePaymentRequest) => Promise<void>;
    isLoading: boolean;
}

export function PaymentCreateModal({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
}: PaymentCreateModalProps) {

    // State form
    const [formData, setFormData] = useState({
        hoKhauId: "",
        khoanThuId: "",
        soTien: "",
        nguoiNop: "",
        ngayNop: new Date().toISOString().split("T")[0], // Mặc định hôm nay (YYYY-MM-DD)
    });

    useEffect(() => {
        if (open) {
            setFormData({
                hoKhauId: "",
                khoanThuId: "",
                soTien: "",
                nguoiNop: "",
                ngayNop: new Date().toISOString().split("T")[0],
            });
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: CreatePaymentRequest = {
            hoKhauId: Number(formData.hoKhauId),
            khoanThuId: Number(formData.khoanThuId),
            soTien: Number(formData.soTien),
            nguoiNop: formData.nguoiNop || undefined,
            ngayNop: formData.ngayNop,
        };

        await onSubmit(payload);
        onOpenChange(false);
    };
    const handleSelectPayer = (name: string, hoKhauId?: number) => {
        setFormData((prev) => ({
            ...prev,
            nguoiNop: name,                 // Điền tên người nộp
            hoKhauId: hoKhauId?.toString() || prev.hoKhauId // Tự điền ID hộ khẩu nếu có
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Ghi nhận thu phí</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    {/* 1. Chọn Hộ Khẩu */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hoKhauId" className="text-right">
                            Hộ khẩu ID
                        </Label>
                        <Input
                            id="hoKhauId"
                            type="number"
                            required
                            className="col-span-3"
                            placeholder="Nhập ID hộ khẩu..."
                            value={formData.hoKhauId}
                            onChange={(e) => setFormData({ ...formData, hoKhauId: e.target.value })}
                        />
                    </div>

                    {/* 2. Chọn Khoản Thu */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="khoanThuId" className="text-right">
                            Khoản thu ID
                        </Label>
                        <Input
                            id="khoanThuId"
                            type="number"
                            required
                            className="col-span-3"
                            placeholder="Nhập ID khoản thu..."
                            value={formData.khoanThuId}
                            onChange={(e) => setFormData({ ...formData, khoanThuId: e.target.value })}
                        />
                    </div>

                    {/* 3. Số tiền */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="soTien" className="text-right">
                            Số tiền
                        </Label>
                        <Input
                            id="soTien"
                            type="number"
                            required
                            min={0}
                            className="col-span-3"
                            placeholder="VNĐ"
                            value={formData.soTien}
                            onChange={(e) => setFormData({ ...formData, soTien: e.target.value })}
                        />
                    </div>

                    {/* 4. Người nộp */}
                    <div className="grid grid-cols-4 items-center gap-4 ">
                        <Label htmlFor="nguoiNop" className="text-right">
                            Người nộp
                        </Label>
                        <div className="col-span-3">
                            <ResidentSelect
                                value={formData.nguoiNop}
                                onChange={handleSelectPayer}
                                variant="outline"
                            />
                        </div>
                    </div>

                    {/* 5. Ngày nộp */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ngayNop" className="text-right">
                            Ngày nộp
                        </Label>
                        <Input
                            id="ngayNop"
                            type="date"
                            className="col-span-3"
                            value={formData.ngayNop}
                            onChange={(e) => setFormData({ ...formData, ngayNop: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang xử lý..." : "Xác nhận thu"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}