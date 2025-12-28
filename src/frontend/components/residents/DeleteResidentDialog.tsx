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
import { AlertTriangle } from "lucide-react";

interface DeleteResidentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resident: Resident | null;
    onConfirm: () => void;
}

export function DeleteResidentDialog({
    open,
    onOpenChange,
    resident,
    onConfirm
}: DeleteResidentDialogProps) {
    
    const isChuHo = resident?. quanHeVoiChuHo === "Chủ hộ";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 font-bold flex items-center gap-2">
                        {isChuHo && <AlertTriangle className="h-5 w-5" />}
                        {isChuHo ? "Không thể xóa Chủ hộ" :  "Xác nhận xóa cư dân? "}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-700">
                        {isChuHo ?  (
                            `Cư dân ${resident?. hoTen} đang là Chủ hộ.  Bạn cần chuyển quyền chủ hộ cho người khác trước khi xóa.`
                        ) : (
                            `Hành động này không thể hoàn tác.  Hồ sơ của cư dân ${resident?.hoTen} sẽ bị xóa vĩnh viễn khỏi hệ thống quản lý. `
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-100 text-slate-900 hover:bg-slate-200">
                        {isChuHo ? "Đóng" : "Hủy bỏ"}
                    </AlertDialogCancel>
                    {! isChuHo && (
                        <AlertDialogAction
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Xác nhận xóa
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}