"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Fee } from "@/lib/types/models/fee"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Schema validation
const formSchema = z.object({
    tenKhoanThu: z.string().min(2, "Tên khoản thu không được để trống"),
    loaiPhi: z.string(),
    // z.coerce.number() giúp chuyển chuỗi từ input type="number" sang số an toàn
    soTien: z.coerce.number().nonnegative(),

    ghiChu: z.string().optional(),
})
interface EditFeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fee: Fee | null;
    onSave: (updatedFee: Fee) => void;
}

export function EditFeeDialog({ open, onOpenChange, fee, onSave }: EditFeeDialogProps) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tenKhoanThu: "",
            loaiPhi: "BatBuoc",
            soTien: 0,
            ghiChu: "",
        },
    })

    // Reset form khi dữ liệu đầu vào (fee) thay đổi
    useEffect(() => {
        if (fee) {
            form.reset({
                tenKhoanThu: fee.tenKhoanThu,
                loaiPhi: fee.loaiPhi,
                soTien: fee.soTien ?? 0,
                ghiChu: fee.ghiChu || "",
            })
        }
    }, [fee, form])

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!fee) return;

        const updatedData: Fee = {
            ...fee, // Giữ lại ID cũ
            tenKhoanThu: values.tenKhoanThu,
            loaiPhi: values.loaiPhi as "BatBuoc" | "TuNguyen",
            soTien: values.soTien,
            ghiChu: values.ghiChu
        };

        onSave(updatedData);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white text-slate-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary">
                        Cập nhật khoản thu
                    </DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin chi tiết của khoản phí/đóng góp.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">

                        <FormField control={form.control} name="tenKhoanThu" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Tên khoản thu</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Phí vệ sinh..." {...field} className="border-slate-300 focus-visible:ring-primary" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="loaiPhi" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Loại phí</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-slate-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="BatBuoc">Bắt buộc</SelectItem>
                                            <SelectItem value="TuNguyen">Tự nguyện</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="soTien" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Đơn giá (VNĐ)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            value={Number(field.value)}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="border-slate-300 text-right font-mono"
                                        />
                                    </FormControl>
                                    <div className="text-[10px] text-muted-foreground">Nhập 0 nếu thu theo thực tế</div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="ghiChu" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700">Mô tả / Ghi chú</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Thông tin thêm về khoản thu này..."
                                        className="border-slate-300 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <Button className="variant" type="button" onClick={() => onOpenChange(false)}>Hủy</Button>
                            <Button type="submit" className="shadow-md">
                                <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}