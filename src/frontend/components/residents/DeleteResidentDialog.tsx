"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Resident } from "@/lib/types/models/resident";
interface DeleteResidentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resident: Resident | null; // Người cần xóa
    onConfirm: () => void;     // Hàm thực thi xóa từ cha
}

export function DeleteResidentDialog({
    open,
    onOpenChange,
    resident,
    onConfirm
}: DeleteResidentDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 font-bold">
                        Xác nhận xóa cư dân?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white">
                        Hành động này không thể hoàn tác. Hồ sơ của cư dân
                        <span className="font-bold text-slate-400 mx-1">
                            {resident?.hoTen}
                        </span>
                        sẽ bị xóa vĩnh viễn khỏi hệ thống quản lý.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-white">Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white border-none"
                    >
                        Xác nhận xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}