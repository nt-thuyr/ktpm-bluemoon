"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { CreateFeeRequest } from "@/lib/services/fee"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Plus, Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Schema Validation
const formSchema = z.object({
    tenKhoanThu: z.string().min(2, "Tên khoản thu không được để trống"),
    loaiPhi: z.string(),
    soTien: z.string().refine((val) => !Number.isNaN(Number(val)), {
        message: "Số tiền phải là số",
    }).optional(),

    ngayTao: z.string(),
    hanNop: z.string().min(1, "Vui lòng chọn hạn nộp"),
    ghiChu: z.string().optional(),
})

// 2. Định nghĩa Props
interface CreateFeeModalProps {
    onAddSuccess: (data: CreateFeeRequest) => Promise<boolean>;
}

export function CreateFeeDialog({ onAddSuccess }: CreateFeeModalProps) {
    const [open, setOpen] = useState(false); // Quản lý đóng mở Modal
    const [isSubmitting, setIsSubmitting] = useState(false); // Quản lý trạng thái loading button

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tenKhoanThu: "",
            loaiPhi: "BatBuoc",
            ngayTao: new Date().toISOString().split('T')[0],
            hanNop: "",
            soTien: "",
            ghiChu: ""
        },
    })

    // Xử lý Submit
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        // Convert dữ liệu từ Form (String) -> API Payload (Number/Boolean)
        const payload: CreateFeeRequest = {
            TenKhoanThu: values.tenKhoanThu,
            SoTien: values.soTien ? Number(values.soTien) : 0,
            BatBuoc: values.loaiPhi === "BatBuoc", // Convert string select sang boolean
            GhiChu: values.ghiChu,

            // [TODO: THOI_HAN] Khi nào BE có field ThoiHan thì uncomment dòng dưới
            HanNop: values.hanNop || null
        };


        const success = await onAddSuccess(payload);

        if (success) {
            setOpen(false); // Đóng modal
            form.reset();   // Reset form về trắng
        }
        setIsSubmitting(false);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Tạo khoản thu mới
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] bg-white text-slate-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Tạo khoản thu mới
                    </DialogTitle>
                    <DialogDescription>
                        Thiết lập các khoản phí chung cư hoặc quỹ đóng góp.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-3">

                        {/* Tên khoản thu */}
                        <FormField control={form.control} name="tenKhoanThu" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Tên khoản thu</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Tiền điện tháng 11/2024, Quỹ vì người nghèo..." {...field} className="border-slate-300 focus-visible:ring-primary" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Loại phí & Số tiền */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="loaiPhi" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Loại khoản thu</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-slate-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="BatBuoc">Bắt buộc (Phí, Điện, Nước)</SelectItem>
                                            <SelectItem value="TuNguyen">Tự nguyện (Đóng góp)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="soTien" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Số tiền (VNĐ)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Để trống nếu thu theo chỉ số" {...field} className="border-slate-300" />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </div>

                        {/* Ngày tháng */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="ngayTao" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Ngày tạo</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="border-slate-300 block" />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="hanNop" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Hạn nộp</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="border-slate-300 block" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Ghi chú */}
                        <FormField control={form.control} name="ghiChu" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Ghi chú / Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập nội dung chi tiết..." {...field} className="border-slate-300 resize-none" />
                                </FormControl>
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <Button type="submit" className="w-full sm:w-auto shadow-md">
                                <Save className="mr-2 h-4 w-4" /> Tạo khoản thu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}