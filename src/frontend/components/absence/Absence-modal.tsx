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
import { residentsApi } from "@/lib/services/residents";
import { householdApi } from "@/lib/services/households";

import { useEffect, useState } from "react";
import { ResidentSelect } from "../residents/ResidentSelect";

interface AbsenceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?:  AbsenceRegistration | null;
    isLoading:  boolean;
}

export function AbsenceModal({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    isLoading,
}: AbsenceModalProps) {
    const isEditMode = !!initialData;

    const [selectedResidentName, setSelectedResidentName] = useState("");
    const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
    const [loadingAddress, setLoadingAddress] = useState(false);

    // State form
    const [formData, setFormData] = useState({
        nhan_khau_id: "",
        trang_thai: "Tạm trú",
        dia_chi: "",
        thoi_gian: "",
        noi_dung_de_nghi: "",
    });

    // Reset form khi mở modal
    useEffect(() => {
        if (open) {
            if (initialData) {
                // MODE EDIT
                setFormData({
                    nhan_khau_id: initialData.nhanKhauId. toString(),
                    trang_thai: initialData.trangThaiRaw,
                    dia_chi: initialData.diaChi,
                    thoi_gian: initialData.ngayDangKy,
                    noi_dung_de_nghi: initialData.noiDung,
                });
                setSelectedResidentName(initialData.hoTen);
                setSelectedResidentId(initialData.nhanKhauId);
            } else {
                // MODE CREATE
                setFormData({
                    nhan_khau_id: "",
                    trang_thai: "Tạm trú",
                    dia_chi: "",
                    thoi_gian: new Date().toISOString().split("T")[0],
                    noi_dung_de_nghi: "",
                });
                setSelectedResidentName("");
                setSelectedResidentId(null);
            }
        }
    }, [open, initialData]);

    // Fetch địa chỉ hộ khẩu khi chọn resident và chọn Tạm vắng
    useEffect(() => {
        const fetchHouseholdAddress = async () => {
            // Chỉ fetch khi: không edit, đã chọn resident, và là Tạm vắng
            if (isEditMode || !selectedResidentId || formData.trang_thai !== "Tạm vắng") {
                // Clear địa chỉ khi chuyển về Tạm trú
                if (formData.trang_thai === "Tạm trú" && ! isEditMode) {
                    setFormData(prev => ({ ... prev, dia_chi: "" }));
                }
                return;
            }

            setLoadingAddress(true);
            try {
                // Fetch resident detail để lấy hoKhauId
                const resident = await residentsApi.getResidentById(selectedResidentId);
                
                if (! resident) {
                    console.error("Không tìm thấy resident");
                    setFormData(prev => ({ ...prev, dia_chi: "" }));
                    return;
                }

                if (resident.hoKhauId) {
                    // Fetch household detail
                    const household = await householdApi.getHouseholdById(resident.hoKhauId);
                    
                    if (household) {
                        const address = `${household.soNha}, ${household.duong}, ${household.phuong}, ${household.quan}`;
                        setFormData(prev => ({
                            ...prev,
                            dia_chi: address
                        }));
                    } else {
                        setFormData(prev => ({ ...prev, dia_chi: "" }));
                    }
                } else {
                    // Resident không có hộ khẩu
                    setFormData(prev => ({ ...prev, dia_chi: "" }));
                }
            } catch (error) {
                console.error("Lỗi fetch địa chỉ hộ khẩu:", error);
                setFormData(prev => ({ ...prev, dia_chi: "" }));
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchHouseholdAddress();
    }, [selectedResidentId, formData.trang_thai, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            onSubmit({
                dia_chi: formData.dia_chi,
                thoi_gian: formData.thoi_gian,
                noi_dung_de_nghi:  formData.noi_dung_de_nghi
            });
        } else {
            onSubmit({
                ... formData,
                nhan_khau_id: Number(formData.nhan_khau_id)
            } as CreateRegistrationRequest);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] bg-white text-slate-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        {isEditMode ? "Cập nhật thông tin" : "Đăng ký Tạm trú / Tạm vắng"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">

                    {/* 1. Chọn Nhân khẩu */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">
                            Người đăng ký <span className="text-red-500">*</span>
                        </Label>
                        {isEditMode ? (
                            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-sm font-medium text-slate-800">
                                {initialData?.hoTen} <span className="text-slate-500">(ID: {initialData?.nhanKhauId})</span>
                            </div>
                        ) : (
                            <>
                                <ResidentSelect
                                    value={selectedResidentName}
                                    onChange={(id, name) => {
                                        setFormData({ ...formData, nhan_khau_id: id.toString() });
                                        setSelectedResidentName(name);
                                        setSelectedResidentId(id);
                                    }}
                                />
                                <p className="text-xs text-slate-500">
                                    Nhập tên hoặc CCCD để tìm kiếm
                                </p>
                            </>
                        )}
                        {! isEditMode && ! formData.nhan_khau_id && (
                            <p className="text-xs text-red-500">Vui lòng chọn cư dân</p>
                        )}
                    </div>

                    {/* 2. Trạng thái */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">
                            Loại hình <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            disabled={isEditMode}
                            value={formData.trang_thai}
                            onValueChange={(val) => setFormData({ ...formData, trang_thai: val })}
                        >
                            <SelectTrigger className={isEditMode ? "bg-slate-50 border-slate-200" : "border-slate-300 bg-white"}>
                                <SelectValue placeholder="Chọn loại hình" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tạm trú">Tạm trú</SelectItem>
                                <SelectItem value="Tạm vắng">Tạm vắng</SelectItem>
                            </SelectContent>
                        </Select>
                        {isEditMode && (
                            <p className="text-xs text-amber-600 italic flex items-start gap-1">
                                <span>⚠️</span>
                                <span>Muốn thay đổi nhân khẩu hoặc loại hình, vui lòng xóa bản ghi này và tạo mới.</span>
                            </p>
                        )}
                    </div>

                    {/* 3. Thời gian + Địa chỉ */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">
                                Thời gian đăng ký <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="date"
                                required
                                value={formData. thoi_gian}
                                onChange={(e) =>
                                    setFormData({ ...formData, thoi_gian: e.target.value })
                                }
                                className="border-slate-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">
                                {formData.trang_thai === "Tạm trú" ? "Địa chỉ tạm trú" : "Địa chỉ hộ khẩu"}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                required
                                value={formData.dia_chi}
                                onChange={(e) =>
                                    setFormData({ ...formData, dia_chi: e.target.value })
                                }
                                placeholder={
                                    formData.trang_thai === "Tạm trú"
                                        ? "Nhập địa chỉ tạm trú..."
                                        : loadingAddress
                                        ? "Đang tải địa chỉ..."
                                        : "Địa chỉ hộ khẩu (tự động)"
                                }
                                className="border-slate-300"
                                disabled={! isEditMode && formData.trang_thai === "Tạm vắng" && loadingAddress}
                            />
                            {!isEditMode && formData.trang_thai === "Tạm vắng" && formData.dia_chi && ! loadingAddress && (
                                <p className="text-xs text-blue-600">
                                    Địa chỉ tự động lấy từ hộ khẩu của người đăng ký
                                </p>
                            )}
                            {! isEditMode && formData.trang_thai === "Tạm vắng" && ! formData.dia_chi && selectedResidentId && ! loadingAddress && (
                                <p className="text-xs text-amber-600">
                                    ⚠️ Cư dân này chưa có thông tin hộ khẩu. Vui lòng nhập thủ công. 
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 4. Nội dung đề nghị */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Nội dung / Lý do</Label>
                        <Textarea
                            placeholder="Nhập nội dung chi tiết..."
                            value={formData.noi_dung_de_nghi}
                            onChange={(e) =>
                                setFormData({ ...formData, noi_dung_de_nghi: e.target. value })
                            }
                            className="min-h-[100px] border-slate-300"
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-white border-slate-300 text-slate-700 hover: bg-slate-50"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || loadingAddress}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? "Đang xử lý..." : isEditMode ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}