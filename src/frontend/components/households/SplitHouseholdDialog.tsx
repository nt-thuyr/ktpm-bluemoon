"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useHouseholds } from "@/lib/hooks/use-households"; // Hook bạn đã có
import { HouseholdMember } from "@/lib/types/models/household";
import { Loader2, Split } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    members: HouseholdMember[];
    onSuccess: () => void;
}

export function SplitHouseholdDialog({ members, onSuccess }: Props) {
    const { splitHousehold } = useHouseholds();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [newAddress, setNewAddress] = useState("");
    const [newHeadId, setNewHeadId] = useState<string>("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const toggleMember = (id: string) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!newAddress || !newHeadId) {
            toast.error("Vui lòng nhập địa chỉ mới và chọn chủ hộ mới");
            return;
        }

        // 2. Chuẩn bị dữ liệu gửi lên Backend
        // Backend yêu cầu: idChuHoMoi, DiaChiMoi, dsThanhVienSangHoMoi
        const payload = {
            idChuHoMoi: parseInt(newHeadId),
            DiaChiMoi: newAddress,
            // Backend python logic: "if chu_ho_moi_id not in ds_thanh_vien_ids: append..."
            // Nên ta cứ gửi danh sách những người được tích chọn là đủ
            dsThanhVienSangHoMoi: selectedMembers.map((id) => parseInt(id)),
        };

        setLoading(true);
        try {
            const success = await splitHousehold(payload);
            if (success) {
                setOpen(false);

                setNewAddress("");
                setNewHeadId("");
                setSelectedMembers([]);
                onSuccess();
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Split className="h-4 w-4" /> Tách hộ
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-white text-slate-900">
                <DialogHeader>
                    <DialogTitle>Tách hộ khẩu</DialogTitle>
                    <DialogDescription>
                        Chọn thành viên để chuyển sang hộ khẩu mới.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* 1. Nhập địa chỉ mới */}
                    <div className="space-y-2">
                        <Label>Địa chỉ hộ mới <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Số căn hộ / số nhà mới"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                    </div>

                    {/* 2. Chọn chủ hộ mới */}
                    <div className="space-y-2">
                        <Label>Chủ hộ mới
                            {/* <span className="text-red-500">*</span> */}
                        </Label>
                        <Select value={newHeadId} onValueChange={setNewHeadId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn người đứng tên chủ hộ mới" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((mem) => (
                                    <SelectItem key={mem.id} value={mem.id.toString()}>
                                        {mem.hoTen} (CCCD: {mem.cccd || "N/A"})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 3. Chọn thành viên đi kèm */}
                    <div className="space-y-3">
                        <Label>Thành viên đi cùng (sang hộ mới)</Label>
                        <div className="border rounded-md p-4 space-y-3 max-h-[200px] overflow-y-auto bg-slate-50">
                            {members.map((mem) => {
                                // Nếu người này đã được chọn làm chủ hộ mới thì disable checkbox và auto-check
                                const isNewHead = mem.id.toString() === newHeadId;

                                return (
                                    <div key={mem.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`mem-${mem.id}`}
                                            checked={isNewHead || selectedMembers.includes(mem.id.toString())}
                                            disabled={isNewHead} // Chủ hộ mới bắt buộc phải đi
                                            onCheckedChange={() => toggleMember(mem.id.toString())}
                                        />
                                        <label
                                            htmlFor={`mem-${mem.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {mem.hoTen} - <span className="text-muted-foreground font-normal">{mem.quanHe}</span>
                                        </label>
                                        {isNewHead && <span className="text-xs text-blue-600 font-bold">(Chủ hộ mới)</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Hủy bỏ</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xác nhận tách
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}