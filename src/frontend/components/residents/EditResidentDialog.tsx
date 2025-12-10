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
import { Resident } from "@/lib/types/resident"
import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCw, Save, User } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    hoTen: z.string().min(2, "Tên phải lớn hơn 2 ký tự"),
    ngaySinh: z.string().min(1, "Vui lòng chọn ngày sinh"),
    gioiTinh: z.string().min(1, "Chọn giới tính"),
    cccd: z.string().min(9, "CCCD phải từ 9-12 số").max(12),
    sdt: z.string().optional(),
    ngheNghiep: z.string().optional(),
    householdId: z.string().min(1, "Phải nhập mã hộ khẩu"),
    quanHe: z.string().min(1, "Chọn quan hệ"),
    trangThai: z.string().min(1, "Chọn trạng thái cư trú"),
})

interface EditResidentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resident: Resident | null; // Dữ liệu cần sửa
    onSave: (updatedResident: Resident) => void;
}

export function EditResidentDialog({ open, onOpenChange, resident, onSave }: EditResidentDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hoTen: "",
            cccd: "",
            gioiTinh: "Nam",
            trangThai: "ThuongTru",
            householdId: "",
            sdt: "",
            ngheNghiep: ""
        },
    })


    useEffect(() => {
        if (resident) {
            form.reset({
                hoTen: resident.hoTen,
                ngaySinh: resident.ngaySinh,
                gioiTinh: resident.gioiTinh as string,
                cccd: resident.cccd,
                ngheNghiep: resident.ngheNghiep || "",
                // sdt: resident.sdt || "",
                householdId: resident.householdId,
                quanHe: resident.quanHeVoiChuHo,
                trangThai: resident.trangThai,
            })
        }
    }, [resident, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log("Update Resident ID:", resident?.id, values)
        // // Gọi API update ở đây
        if (!resident) return;

        // Gộp ID cũ với thông tin mới vừa nhập
        const newData: Resident = {
            ...resident, // Giữ lại ID và các trường cũ
            ...values,   // Ghi đè các trường mới sửa
            // Ép kiểu lại cho khớp (do form trả về string, type Resident cần type cụ thể)
            gioiTinh: values.gioiTinh as "Nam" | "Nữ" | "Khác",
            trangThai: values.trangThai as "ThuongTru" | "TamTru" | "TamVang",
            quanHeVoiChuHo: values.quanHe, // Map lại tên trường nếu khác nhau
        };

        // GỌI HÀM NÀY ĐỂ BÁO LẠI CHO BẢNG
        onSave(newData);
        alert("Đã cập nhật thông tin: " + values.hoTen)

        onOpenChange(false); // Đóng dialog sau khi lưu
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-white text-slate-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                        <RefreshCw className="h-5 w-5" />
                        Cập nhật thông tin cư trú
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Chỉnh sửa thông tin hồ sơ của <span className="font-bold text-slate-900">{resident?.hoTen}</span>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">


                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2 border-slate-200">
                                Thông tin cá nhân
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="hoTen" render={({ field }) => (
                                    <FormItem className="col-span-2 sm:col-span-1">
                                        <FormLabel className="text-slate-700 font-semibold">Họ và tên</FormLabel>
                                        <FormControl><Input {...field} className="border-slate-300 focus-visible:ring-primary" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="ngaySinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Ngày sinh</FormLabel>
                                        <FormControl><Input type="date" {...field} className="border-slate-300 focus-visible:ring-primary block" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="gioiTinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Giới tính</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger className="border-slate-300"><SelectValue placeholder="Chọn giới tính" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Nam">Nam</SelectItem>
                                                <SelectItem value="Nu">Nữ</SelectItem>
                                                <SelectItem value="Khac">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cccd" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Số CCCD / CMND</FormLabel>
                                        <FormControl><Input {...field} className="border-slate-300" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="ngheNghiep" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="text-slate-600">Nghề nghiệp</FormLabel>
                                        <FormControl><Input {...field} className="border-slate-300" /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/*THÔNG TIN CƯ TRÚ */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
                                <User className="h-4 w-4" /> Thông tin cư trú
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="householdId" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="text-slate-700 font-semibold">Mã Hộ Khẩu</FormLabel>
                                        <FormControl><Input className="bg-white border-slate-300" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="quanHe" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Quan hệ</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger className="bg-white border-slate-300"><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="ChuHo">Chủ hộ</SelectItem>
                                                <SelectItem value="VoChong">Vợ / Chồng</SelectItem>
                                                <SelectItem value="Con">Con cái</SelectItem>
                                                <SelectItem value="BoMe">Bố / Mẹ</SelectItem>
                                                <SelectItem value="Khac">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="trangThai" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Trạng thái</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger className="bg-white border-slate-300"><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="ThuongTru">Thường trú</SelectItem>
                                                <SelectItem value="TamTru">Tạm trú</SelectItem>
                                                <SelectItem value="TamVang">Tạm vắng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button className="text-white" variant="outline" type="button" onClick={() => onOpenChange(false)}>Hủy bỏ</Button>
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