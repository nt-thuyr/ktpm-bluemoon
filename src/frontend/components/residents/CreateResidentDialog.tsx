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
import { Resident } from "@/lib/types/models/resident"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Save, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    hoTen: z.string().min(2, "Tên phải lớn hơn 2 ký tự"),
    ngaySinh: z.string().min(1, "Vui lòng chọn ngày sinh"),
    gioiTinh: z.string().min(1, "Chọn giới tính"),
    cccd: z.string().min(9, "CCCD phải từ 9-12 số").max(12),
    sdt: z.string().optional(),
    ngheNghiep: z.string().optional(),
    danToc: z.string().optional(),

    householdId: z.string().optional(),
    quanHe: z.string().min(1, "Chọn quan hệ"),
    trangThai: z.string().min(1, "Chọn trạng thái cư trú"),
})

interface CreateResidentDialogProps {
    onCreate: (data: Resident) => Promise<void>;
}

export function CreateResidentDialog({ onCreate }: CreateResidentDialogProps) {
    // State quản lý đóng mở Dialog
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hoTen: "",
            cccd: "",
            gioiTinh: "Nam",
            trangThai: "ThuongTru",
            householdId: "",
            danToc: "",
            quanHe: "ChuHo",
            ngaySinh: "",
            ngheNghiep: ""
        },
    })

    // Xử lý Submit
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const newResident: Resident = {
            id: "0", // ID backend tự sinh (hoặc để undefined nếu type cho phép)
            hoTen: values.hoTen,
            // Chuyển string YYYY-MM-DD -> Date object
            ngaySinh: values.ngaySinh ? new Date(values.ngaySinh) : new Date(),
            gioiTinh: values.gioiTinh as "Nam" | "Nu" | "Khac",
            cccd: values.cccd,
            ngheNghiep: values.ngheNghiep ?? "",
            householdId: values.householdId?.toString() || null,
            quanHeVoiChuHo: values.quanHe,
            danToc: values.danToc ?? "Kinh",
            tonGiao: "Không",
            ngayCap: null,
            noiCap: "",
            ghiChu: "",
            ngayThemNhanKhau: new Date(),
            // Trạng thái cư trú có thể cần mapping lại tùy backend
            // Ví dụ backend cần enum: 'TamTru' | 'ThuongTru'
        }

        try {
            await onCreate(newResident);
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Thêm cư dân mới
                </Button>
            </DialogTrigger>

            {/* Form rộng hơn chút (max-w-2xl) vì nhiều trường */}
            <DialogContent className="sm:max-w-2xl  bg-white text-slate-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary">Tiếp nhận cư dân</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Thêm nhân khẩu mới vào hệ thống quản lý.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">

                        {/* KHỐI 1: THÔNG TIN CÁ NHÂN */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2 border-slate-200">
                                Thông tin cá nhân
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="hoTen" render={({ field }) => (
                                    <FormItem className="col-span-2 sm:col-span-1">
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl><Input placeholder="Nguyễn Văn A" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="ngaySinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày sinh</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="gioiTinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giới tính</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                                <FormField control={form.control} name="cccd" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số CCCD / CMND</FormLabel>
                                        <FormControl><Input placeholder="00123456789" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="ngheNghiep" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nghề nghiệp (Tùy chọn)</FormLabel>
                                        <FormControl><Input placeholder="Nhân viên văn phòng..." {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="danToc" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dân tộc</FormLabel>
                                        <FormControl><Input placeholder="Kinh" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* KHỐI 2: THÔNG TIN CƯ TRÚ (Box màu xám) */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
                                <User className="h-4 w-4" />
                                Thông tin cư trú
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Mã hộ khẩu - Sau này nâng cấp thành Search Select */}
                                <FormField control={form.control} name="householdId" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Thuộc Hộ Khẩu (Mã Hộ)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập mã hộ (VD: HK001)..." className="bg-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Quan hệ */}
                                <FormField control={form.control} name="quanHe" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quan hệ với chủ hộ</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Chọn quan hệ" />
                                                </SelectTrigger>
                                            </FormControl>
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

                                {/* Trạng thái */}
                                <FormField control={form.control} name="trangThai" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hình thức cư trú</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                            </FormControl>
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
                            {/* <Button type="submit" className="w-full sm:w-auto">
                                <Save className="mr-2 h-4 w-4" /> Lưu thông tin
                            </Button> */}
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                                {form.formState.isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" /> Lưu thông tin</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}