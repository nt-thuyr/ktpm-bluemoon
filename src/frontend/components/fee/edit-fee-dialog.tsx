// "use client"

// import { Button } from "@/components/ui/button"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog"
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Fee } from "@/lib/types/models/fee"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Save } from "lucide-react"
// import { useEffect } from "react"
// import { useForm } from "react-hook-form"
// import * as z from "zod"

// // Schema validation
// const formSchema = z.object({
//     tenKhoanThu: z.string().min(2, "Tên khoản thu không được để trống"),
//     loaiPhi: z.string(),
//     // z.coerce.number() giúp chuyển chuỗi từ input type="number" sang số an toàn
//     soTien: z.coerce.number().nonnegative(),
//     ghiChu: z.string().optional(),
//     hanNop: z.string().optional(),
// })
// interface EditFeeDialogProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     fee: Fee | null;
//     onSave: (updatedFee: Fee) => void;
// }

// export function EditFeeDialog({ open, onOpenChange, fee, onSave }: EditFeeDialogProps) {
//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             tenKhoanThu: "",
//             loaiPhi: "BatBuoc",
//             soTien: 0,
//             ghiChu: "",
//             hanNop: "",
//         },
//     })

//     // Reset form khi dữ liệu đầu vào (fee) thay đổi
//     useEffect(() => {
//         if (fee) {
//             form.reset({
//                 tenKhoanThu: fee.tenKhoanThu,
//                 loaiPhi: fee.isBatBuoc ? "BatBuoc" : "TuNguyen",
//                 soTien: fee.soTien ?? 0,
//                 ghiChu: fee.ghiChu || "",
//                 hanNop: fee.hanNop ? String(fee.hanNop) : "",
//             })
//         }
//     }, [fee, form])

//     function onSubmit(values: z.infer<typeof formSchema>) {
//         if (!fee) return;

//         const updatedData: Fee = {
//             ...fee, // Giữ lại ID cũ
//             tenKhoanThu: values.tenKhoanThu,
//             isBatBuoc: values.loaiPhi === "BatBuoc",
//             soTien: values.soTien,
//             ghiChu: values.ghiChu,
//             hanNop: values.hanNop ? new Date(values.hanNop) : null,
//         };

//         onSave(updatedData);
//         onOpenChange(false);
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[500px] bg-white text-slate-900">
//                 <DialogHeader>
//                     <DialogTitle className="text-xl font-bold text-primary">
//                         Cập nhật khoản thu
//                     </DialogTitle>
//                     <DialogDescription>
//                         Chỉnh sửa thông tin chi tiết của khoản phí/đóng góp.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">

//                         <FormField control={form.control} name="tenKhoanThu" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel className="text-slate-700 font-semibold">Tên khoản thu</FormLabel>
//                                 <FormControl>
//                                     <Input placeholder="VD: Phí vệ sinh..." {...field} className="border-slate-300 focus-visible:ring-primary" />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />

//                         <div className="grid grid-cols-2 gap-4">
//                             <FormField control={form.control} name="loaiPhi" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-slate-700 font-semibold">Loại phí</FormLabel>
//                                     <Select onValueChange={field.onChange} value={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger className="border-slate-300">
//                                                 <SelectValue />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem value="BatBuoc">Bắt buộc</SelectItem>
//                                             <SelectItem value="TuNguyen">Tự nguyện</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />

//                             <FormField control={form.control} name="soTien" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-slate-700 font-semibold">Đơn giá (VNĐ)</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             type="number"
//                                             value={Number(field.value)}
//                                             onChange={(e) => field.onChange(e.target.value)}
//                                             className="border-slate-300 text-right font-mono"
//                                         />
//                                     </FormControl>
//                                     <div className="text-[10px] text-muted-foreground">Nhập 0 nếu thu theo thực tế</div>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                         </div>

//                         <FormField control={form.control} name="ghiChu" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel className="text-slate-700">Mô tả / Ghi chú</FormLabel>
//                                 <FormControl>
//                                     <Textarea
//                                         placeholder="Thông tin thêm về khoản thu này..."
//                                         className="border-slate-300 resize-none"
//                                         {...field}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />

//                         <DialogFooter>
//                             <Button className="variant" type="button" onClick={() => onOpenChange(false)}>Hủy</Button>
//                             <Button type="submit" className="shadow-md">
//                                 <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     )
// }


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

// 1. Schema validation
const formSchema = z.object({
    tenKhoanThu: z.string().min(2, "Tên khoản thu không được để trống"),
    loaiPhi: z.string(),
    // z.coerce tự động ép kiểu string từ input thành number
    soTien: z.coerce.number().nonnegative("Số tiền không được âm"),
    ghiChu: z.string().optional(),
    hanNop: z.string().optional(),
})

interface EditFeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fee: Fee | null;
    onSave: (updatedFee: Fee) => void; // Lưu ý: hàm này có thể là async
}

export function EditFeeDialog({ open, onOpenChange, fee, onSave }: EditFeeDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            tenKhoanThu: "",
            loaiPhi: "BatBuoc",
            soTien: 0,
            ghiChu: "",
            hanNop: "",
        },
    })

    // 2. Reset form khi dữ liệu đầu vào (fee) thay đổi
    // Logic này giúp tránh lỗi "Too many re-renders" và hiển thị đúng dữ liệu cũ
    useEffect(() => {
        if (fee) {
            // Xử lý ngày tháng an toàn: Cần format về YYYY-MM-DD cho input date
            let formattedDate = "";
            if (fee.hanNop) {
                try {
                    formattedDate = new Date(fee.hanNop).toISOString().split('T')[0];
                } catch (e) {
                    formattedDate = "";
                }
            }

            form.reset({
                tenKhoanThu: fee.tenKhoanThu,
                loaiPhi: fee.isBatBuoc ? "BatBuoc" : "TuNguyen",
                soTien: fee.soTien ?? 0,
                ghiChu: fee.ghiChu || "",
                hanNop: formattedDate,
            })
        }
    }, [fee, form])

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!fee) return;

        // Map dữ liệu từ Form (Zod) sang Model (Fee)
        const updatedData: Fee = {
            ...fee, // Giữ lại ID cũ
            tenKhoanThu: values.tenKhoanThu,
            isBatBuoc: values.loaiPhi === "BatBuoc",
            soTien: values.soTien,
            ghiChu: values.ghiChu,
            // Convert string 'YYYY-MM-DD' thành Date object hoặc null
            hanNop: values.hanNop ? new Date(values.hanNop) : null,
        };

        onSave(updatedData);
        // Lưu ý: Không đóng dialog ở đây nếu onSave là async (đóng ở component cha sau khi thành công thì tốt hơn)
        // Nhưng nếu muốn đóng ngay lập tức thì để dòng dưới:
        // onOpenChange(false); 
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white text-slate-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Cập nhật khoản thu
                    </DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin chi tiết của khoản phí/đóng góp #{fee?.id}.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">

                        {/* Tên khoản thu */}
                        <FormField control={form.control} name="tenKhoanThu" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Tên khoản thu <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Phí vệ sinh..." {...field} className="border-slate-300 focus-visible:ring-blue-600" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Grid 2 cột cho Loại phí & Số tiền */}
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
                                            {...field}
                                            className="border-slate-300 text-right font-mono"
                                            placeholder="0"
                                        />
                                    </FormControl>
                                    <div className="text-[11px] text-muted-foreground mt-1">Nhập 0 nếu thu theo thực tế</div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Hạn nộp (Đã thêm mới) */}
                        <FormField control={form.control} name="hanNop" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Hạn nộp (Dự kiến)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        className="border-slate-300 w-full sm:w-1/2" // Chỉ chiếm 1 nửa chiều rộng cho đẹp
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Ghi chú */}
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
                            {/* Đã sửa variant cho đúng chuẩn shadcn */}
                            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}