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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteHouseholdDialogProps {
    householdId: string;
    trigger?: React.ReactNode; // Cho phép custom nút kích hoạt
}

export function DeleteHouseholdDialog({ householdId, trigger }: DeleteHouseholdDialogProps) {
    const handleDelete = () => {
        // Gọi API xóa ở đây
        console.log("Deleting household:", householdId);
        // Sau khi xóa xong thì refresh router hoặc update state
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger ? trigger : (
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" /> Xóa
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">Xác nhận xóa Hộ Khẩu?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white">
                        Hành động này không thể hoàn tác. Toàn bộ thông tin về hộ khẩu
                        <span className="font-bold text-slate mx-1">{householdId}</span>
                        và lịch sử cư trú liên quan sẽ bị xóa khỏi hệ thống.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-white">Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white border-none"
                    >
                        Xác nhận xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}