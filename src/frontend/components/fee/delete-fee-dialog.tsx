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
} from "@/components/ui/alert-dialog"
import { Fee } from "@/lib/types/models/fee"
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"

interface DeleteFeeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    fee: Fee | null
    onConfirm: (id: number) => Promise<void> // Promise để xử lý loading
}

export function DeleteFeeDialog({
    open,
    onOpenChange,
    fee,
    onConfirm,
}: DeleteFeeDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!fee) return null

        try {
            setIsDeleting(true)
            await onConfirm(fee.id) // Gọi hàm xóa từ cha
            onOpenChange(false) // Đóng dialog sau khi xóa xong
        } catch (error) {
            console.error("Lỗi khi xóa:", error)
            // Không đóng dialog nếu lỗi để user biết
        } finally {
            setIsDeleting(false)
        }
    }

    if (!fee) return null

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Xác nhận xóa khoản thu
                    </AlertDialogTitle>
                    <AlertDialogDescription className="py-2">
                        Bạn có chắc chắn muốn xóa khoản thu <span className="font-bold text-slate-900">"{fee.tenKhoanThu}"</span> không?
                        <br />
                        <br />
                        <span className="italic text-xs text-red-500">
                            Lưu ý: Hành động này không thể hoàn tác. Dữ liệu liên quan đến việc đóng phí của cư dân cho khoản này cũng có thể bị ảnh hưởng.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault() // Chặn đóng mặc định để xử lý async
                            handleDelete()
                        }}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...
                            </>
                        ) : (
                            "Xóa vĩnh viễn"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}