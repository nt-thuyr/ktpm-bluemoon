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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateRegistrationRequest } from "@/lib/types/api/absence-registration.api";
import { AbsenceRegistration } from "@/lib/types/models/absence-registration";

import { useEffect, useState } from "react";

interface AbsenceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: AbsenceRegistration | null; // Nếu có data -> Mode Edit
    isLoading: boolean;
}

export function AbsenceModal({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    isLoading,
}: AbsenceModalProps) {
    const isEditMode = !!initialData;

    // State form
    const [formData, setFormData] = useState({
        nhan_khau_id: "", // Trong thực tế bạn nên dùng Combobox để search Resident
        trang_thai: "Tạm trú",
        dia_chi: "",
        thoi_gian: "",
        noi_dung_de_nghi: "",
    });

    // Reset form khi mở modal
    useEffect(() => {
        if (open) {
            if (initialData) {
                // --- MODE EDIT: Fill data cũ ---
                setFormData({
                    nhan_khau_id: initialData.nhanKhauId.toString(),
                    trang_thai: initialData.trangThaiRaw, // "Tạm trú" hoặc "Tạm vắng"
                    dia_chi: initialData.diaChi,
                    thoi_gian: initialData.ngayDangKy,
                    noi_dung_de_nghi: initialData.noiDung,
                });
            } else {
                // --- MODE CREATE: Reset trắng ---
                setFormData({
                    nhan_khau_id: "",
                    trang_thai: "Tạm trú",
                    dia_chi: "",
                    thoi_gian: new Date().toISOString().split("T")[0], // Default today
                    noi_dung_de_nghi: "",
                });
            }
        }
    }, [open, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Nếu là Edit, ta chỉ gửi các trường cho phép
        if (isEditMode) {
            onSubmit({
                dia_chi: formData.dia_chi,
                thoi_gian: formData.thoi_gian,
                noi_dung_de_nghi: formData.noi_dung_de_nghi
            });
        } else {
            // Nếu là Create, gửi hết, ép kiểu ID sang number
            onSubmit({
                ...formData,
                nhan_khau_id: Number(formData.nhan_khau_id)
            } as CreateRegistrationRequest);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[500px] bg-white text-slate-900">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Cập nhật thông tin" : "Đăng ký Tạm trú / Tạm vắng"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">

                    {/* 1. Chọn Nhân khẩu */}
                    <div className="space-y-2">
                        <Label>Nhân khẩu (ID)</Label>
                        {isEditMode ? (
                            // KHI EDIT: Chỉ hiện text, không cho sửa
                            <div className="p-2 bg-gray-100 rounded border text-sm font-medium text-gray-700">
                                {initialData?.hoTen} (ID: {initialData?.nhanKhauId})
                            </div>
                        ) : (
                            // KHI CREATE: Cho nhập (Lý tưởng là dùng component Search Resident ở đây)
                            <Input
                                placeholder="Nhập ID nhân khẩu..."
                                type="number"
                                required
                                value={formData.nhan_khau_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, nhan_khau_id: e.target.value })
                                }
                            />
                        )}
                    </div>

                    {/* 2. Trạng thái */}
                    <div className="space-y-2">
                        <Label>Loại hình</Label>
                        <Select
                            disabled={isEditMode} // KHÓA KHI EDIT
                            value={formData.trang_thai}
                            onValueChange={(val) => setFormData({ ...formData, trang_thai: val })}
                        >
                            <SelectTrigger className={isEditMode ? "bg-gray-100" : ""}>
                                <SelectValue placeholder="Chọn loại hình" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tạm trú">Tạm trú</SelectItem>
                                <SelectItem value="Tạm vắng">Tạm vắng</SelectItem>
                            </SelectContent>
                        </Select>
                        {isEditMode && (
                            <p className="text-[10px] text-red-500 italic">
                                *Muốn thay đổi nhân khẩu hoặc loại hình, vui lòng xóa bản ghi này và tạo mới.
                            </p>
                        )}
                    </div>

                    {/* 3. Thời gian */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Thời gian đăng ký</Label>
                            <Input
                                type="date"
                                required
                                value={formData.thoi_gian}
                                onChange={(e) =>
                                    setFormData({ ...formData, thoi_gian: e.target.value })
                                }
                            />
                        </div>

                        {/* 4. Địa chỉ */}
                        <div className="space-y-2">
                            <Label>Địa chỉ </Label>
                            <Input
                                required
                                value={formData.dia_chi}
                                onChange={(e) =>
                                    setFormData({ ...formData, dia_chi: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* 5. Nội dung đề nghị */}
                    <div className="space-y-2">
                        <Label>Nội dung / Lý do</Label>
                        <Textarea
                            placeholder="Nhập nội dung chi tiết..."
                            value={formData.noi_dung_de_nghi}
                            onChange={(e) =>
                                setFormData({ ...formData, noi_dung_de_nghi: e.target.value })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang xử lý..." : isEditMode ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}