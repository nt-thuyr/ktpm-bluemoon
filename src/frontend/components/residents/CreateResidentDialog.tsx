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
import { ComboboxSearch } from "../combo-search"

const formSchema = z.object({
    hoTen: z.string().min(2, "Tên phải lớn hơn 2 ký tự"),
    ngaySinh: z.string().optional(), // Cho phép rỗng (backend sẽ nhận null)
    gioiTinh: z.string().min(1, "Chọn giới tính"),
    cccd: z.string().optional(), // Không bắt buộc
    ngheNghiep: z.string().optional(),
    danToc: z.string().optional(),
    // Cư trú
    householdId: z.string().optional(),
    quanHe: z.string().optional(),
})

interface CreateResidentDialogProps {
    onAddSuccess: (data: Partial<Resident>) => Promise<boolean>;
    householdOptions?: { value: string; label: string }[];
}

export function CreateResidentDialog({ onAddSuccess, householdOptions = [] }: CreateResidentDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hoTen: "",
            cccd: "",
            gioiTinh: "Nam",
            householdId: "",
            danToc: "Kinh",
            quanHe: "ChuHo",
            ngaySinh: "",
            ngheNghiep: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const newResident: Partial<Resident> = {
            hoTen: values.hoTen,
            // Nếu chuỗi rỗng thì gửi null
            ngaySinh: values.ngaySinh || null,
            gioiTinh: values.gioiTinh,
            cccd: values.cccd || null,
            ngheNghiep: values.ngheNghiep || null,
            danToc: values.danToc || "Kinh",

            hoKhauId: values.householdId ? parseInt(values.householdId) : null,
            quanHeVoiChuHo: values.quanHe || null,

            // Các trường mặc định khác
            tonGiao: "Không",
            ghiChu: "",
        }

        try {
            const success = await onAddSuccess(newResident);
            if (success) {
                setOpen(false);
                form.reset();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="shadow-md bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Thêm cư dân mới
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl bg-white text-slate-900 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Tiếp nhận cư dân
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Thêm nhân khẩu mới vào hệ thống quản lý.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* KHỐI 1: THÔNG TIN CÁ NHÂN */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b pb-2">
                                Thông tin cơ bản
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="hoTen" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Họ và tên <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Nguyễn Văn A" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="cccd" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Số CCCD / CMND</FormLabel>
                                        <FormControl><Input placeholder="00123456789" {...field} /></FormControl>
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

                                <FormField control={form.control} name="ngheNghiep" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Nghề nghiệp</FormLabel>
                                        <FormControl><Input placeholder="Nhân viên văn phòng..." {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="danToc" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Dân tộc</FormLabel>
                                        <FormControl><Input placeholder="Kinh" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* KHỐI 2: THÔNG TIN CƯ TRÚ */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-4">
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                                <User className="h-4 w-4" />
                                Thông tin cư trú
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="householdId" render={({ field }) => (
                                    <FormItem className="sm:col-span-2 flex flex-col">
                                        <FormLabel className="font-medium">Thuộc Hộ Khẩu (Phòng)</FormLabel>
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
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Hủy</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-blue-600 hover:bg-blue-700">
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