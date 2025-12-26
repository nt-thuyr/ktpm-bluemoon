"use client";

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

interface DeleteHouseholdDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    householdId: string;
    onConfirm: () => void;
}

export function DeleteHouseholdDialog({
    open,
    onOpenChange,
    householdId,
    onConfirm,
}: DeleteHouseholdDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                        Xác nhận xóa Hộ Khẩu?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white">
                        Hành động này không thể hoàn tác. Toàn bộ thông tin về hộ khẩu mã
                        <span className="font-bold  mx-1">{householdId}</span>
                        và lịch sử cư trú liên quan sẽ bị xóa khỏi hệ thống.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            // Chặn hành vi đóng mặc định để Parent xử lý async xong mới đóng
                            e.preventDefault();
                            onConfirm();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white border-none focus:ring-red-600"
                    >
                        Xác nhận xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}