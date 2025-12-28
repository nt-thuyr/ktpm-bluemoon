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
import { UserRole } from "@/lib/mappers/user.mapper";
import { CreateUserRequest } from "@/lib/types/models/user";
import { useEffect, useState } from "react";

interface UserCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateUserRequest) => Promise<void>;
    isLoading: boolean;
}

export function UserCreateModal({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
}: UserCreateModalProps) {
    const [formData, setFormData] = useState<CreateUserRequest>({
        username: "",
        password: "",
        hoTen: "",
        vaiTro: "ke_toan", // Mặc định tạo Kế toán
    });

    // Reset form khi mở modal
    useEffect(() => {
        if (open) {
            setFormData({
                username: "",
                password: "",
                hoTen: "",
                vaiTro: "ke_toan",
            });
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    <div className="grid gap-2">
                        <Label htmlFor="username">Tên đăng nhập (Username)</Label>
                        <Input
                            id="username"
                            required
                            placeholder="VD: ketoan_01"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            placeholder="******"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hoTen">Họ và tên</Label>
                        <Input
                            id="hoTen"
                            placeholder="VD: Nguyễn Văn A"
                            value={formData.hoTen}
                            onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Vai trò</Label>
                        <Select
                            value={formData.vaiTro}
                            onValueChange={(val) => setFormData({ ...formData, vaiTro: val as UserRole })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="to_truong">Tổ trưởng</SelectItem>
                                <SelectItem value="ke_toan">Kế toán</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-red-500 text-white hover:bg-red-600 border-transparent"
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang tạo..." : "Tạo tài khoản"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}