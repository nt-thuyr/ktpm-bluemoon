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
import { Resident } from "@/lib/types/models/resident"
import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCw, Save, User } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ComboboxSearch } from "../combo-search"

// Hàm helper để convert date string (ISO) sang YYYY-MM-DD cho input date
const convertToInputDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
};

const formSchema = z.object({
    hoTen: z.string().min(2, "Tên phải lớn hơn 2 ký tự"),
    ngaySinh: z.string().optional(), // Cho phép null/undefined
    gioiTinh: z.string().min(1, "Vui lòng chọn giới tính"),
    cccd: z.string().optional(), // Backend cho phép null
    ngheNghiep: z.string().optional(),
    hoKhauId: z.string().optional(), // Form lưu string, lúc submit parse sang number
    quanHe: z.string().optional(),
    danToc: z.string().optional(),
})

interface EditResidentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resident: Resident | null;
    onSave: (id: string, updatedResident: Partial<Resident>) => void; // Update signature cho khớp Hook
    householdOptions?: { value: string; label: string }[]; // Optional để tránh lỗi
}

export function EditResidentDialog({
    open,
    onOpenChange,
    householdOptions = [],
    resident,
    onSave
}: EditResidentDialogProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hoTen: "",
            cccd: "",
            gioiTinh: "",
            hoKhauId: "", // String rỗng cho Select/Combobox
            ngheNghiep: "",
            ngaySinh: "",
            quanHe: "",
            danToc: ""
        },
    })

    // Reset form khi resident thay đổi
    useEffect(() => {
        if (resident && open) {
            form.reset({
                hoTen: resident.hoTen || "",
                // Sử dụng hàm helper convertToInputDate
                ngaySinh: convertToInputDate(resident.ngaySinh),
                gioiTinh: resident.gioiTinh || "",
                cccd: resident.cccd || "",
                ngheNghiep: resident.ngheNghiep || "",
                // Convert number -> string cho form
                hoKhauId: resident.hoKhauId ? String(resident.hoKhauId) : "",
                quanHe: resident.quanHeVoiChuHo || "",
                danToc: resident.danToc || "Kinh"
            })
        }
    }, [resident, open, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!resident) return;

        // Chuẩn bị dữ liệu Partial<Resident> để gửi đi
        const updatedData: Partial<Resident> = {
            hoTen: values.hoTen,
            ngaySinh: values.ngaySinh || null, // Nếu rỗng gửi null
            gioiTinh: values.gioiTinh,
            cccd: values.cccd || null,
            ngheNghiep: values.ngheNghiep || null,
            danToc: values.danToc || "Kinh",

            // Parse string -> number cho ID hộ khẩu
            hoKhauId: values.hoKhauId ? parseInt(values.hoKhauId) : null,
            quanHeVoiChuHo: values.quanHe || null,
        };

        // Gọi hàm onSave truyền từ cha (Hook)
        onSave(String(resident.id), updatedData);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-white text-slate-900 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                        <RefreshCw className="h-5 w-5" />
                        Cập nhật thông tin cư dân
                    </DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin hồ sơ của <span className="font-bold text-slate-900">{resident?.hoTen}</span>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* 1. Thông tin cá nhân */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b pb-2">
                                Thông tin cơ bản
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="hoTen" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Họ và tên <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input {...field} placeholder="Nguyễn Văn A" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="cccd" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Số CCCD / CMND</FormLabel>
                                        <FormControl><Input {...field} placeholder="012345678912" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="ngaySinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Ngày sinh</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="gioiTinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Giới tính <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Nam">Nam</SelectItem>
                                                <SelectItem value="Nu">Nữ</SelectItem>
                                                <SelectItem value="Khac">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="danToc" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Dân tộc</FormLabel>
                                        <FormControl><Input {...field} placeholder="Kinh" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* 2. Thông tin cư trú */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-4">
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                                <User className="h-4 w-4" /> Chi tiết cư trú
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="hoKhauId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="font-medium">Hộ khẩu (Phòng)</FormLabel>
                                        <ComboboxSearch
                                            options={householdOptions}
                                            value={field.value}
                                            onSelect={field.onChange}
                                            placeholder="Chọn hộ khẩu..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="quanHe" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Quan hệ với chủ hộ</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Chọn quan hệ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ChuHo">Chủ hộ</SelectItem>
                                                <SelectItem value="Vo">Vợ</SelectItem>
                                                <SelectItem value="Chong">Chồng</SelectItem>
                                                <SelectItem value="Con">Con cái</SelectItem>
                                                <SelectItem value="BoMe">Bố / Mẹ</SelectItem>
                                                <SelectItem value="Khac">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                                Đóng
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}