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
import { RefreshCw, Save, User, AlertTriangle } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ComboboxSearch } from "../combo-search"

// Helper xử lý ngày
const convertToInputDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
};

const formSchema = z.object({
    hoTen: z.string().min(2, "Tên phải lớn hơn 2 ký tự"),
    ngaySinh:  z.string().refine((date) => {
        if (!date) return true;
        return new Date(date) <= new Date();
    }, "Ngày sinh không được lớn hơn ngày hiện tại").optional(),
    gioiTinh:  z.string().min(1, "Vui lòng chọn giới tính"),
    cccd: z.string()
        .regex(/^\d{9}$|^\d{12}$/, "CCCD phải là 9 hoặc 12 chữ số")
        .optional()
        .or(z.literal('')),
    ngheNghiep: z.string().optional(),
    hoKhauId:  z.string().optional(),
    danToc: z.string().optional(),
})

interface EditResidentDialogProps {
    open: boolean;
    onOpenChange: (open:  boolean) => void;
    resident: Resident | null;
    onSave: (id: string, updatedResident: Partial<Resident>) => void;
    householdOptions?: { value: string; label: string }[];
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
        defaultValues:  {
            hoTen: "",
            cccd: "",
            gioiTinh: "",
            hoKhauId: "",
            ngheNghiep: "",
            ngaySinh: "",
            danToc: ""
        },
    })

    // LOGIC NGHIỆP VỤ
    const isCurrentChuHo = resident?.quanHeVoiChuHo === "Chủ hộ";

    useEffect(() => {
        if (resident && open) {
            form.reset({
                hoTen: resident.hoTen || "",
                ngaySinh: convertToInputDate(resident.ngaySinh),
                gioiTinh: resident.gioiTinh || "",
                cccd: resident.cccd || "",
                ngheNghiep: resident. ngheNghiep || "",
                hoKhauId: resident.hoKhauId ?  String(resident.hoKhauId) : "",
                danToc: resident.danToc || "Kinh"
            })
        }
    }, [resident, open, form]);

    function onSubmit(values: z. infer<typeof formSchema>) {
        if (! resident) return;

        const updatedData: Partial<Resident> = {
            hoTen: values.hoTen,
            ngaySinh: values.ngaySinh || null,
            gioiTinh: values.gioiTinh,
            cccd: values.cccd || null,
            ngheNghiep: values.ngheNghiep || null,
            danToc: values.danToc || "Kinh",
            hoKhauId: values.hoKhauId ?  parseInt(values.hoKhauId) : null,
            quanHeVoiChuHo: "Thành viên", // <--- Cố định là "Thành viên"
        };

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
                        Chỉnh sửa hồ sơ:  <span className="font-bold text-slate-900">{resident?.hoTen}</span>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* --- KHỐI 1: THÔNG TIN CÁ NHÂN --- */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b pb-2">
                                Thông tin cơ bản
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form. control} name="hoTen" render={({ field }) => (
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
                                
                                <FormField control={form. control} name="ngaySinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Ngày sinh</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                
                                <FormField control={form. control} name="gioiTinh" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Giới tính <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
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
                                
                                <FormField control={form.control} name="ngheNghiep" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Nghề nghiệp</FormLabel>
                                        <FormControl><Input {...field} placeholder="Tự do, học sinh..." /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* --- KHỐI 2: THÔNG TIN CƯ TRÚ --- */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-4">
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                                <User className="h-4 w-4" /> Chi tiết cư trú
                            </div>

                            {/* CẢNH BÁO:  Đang là Chủ hộ -> Khóa hết */}
                            {isCurrentChuHo && (
                                <div className="flex gap-3 text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200 text-sm items-start">
                                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold">Đang là Chủ hộ</span>
                                        <span>Không thể thay đổi Hộ khẩu tại đây.  Vui lòng thực hiện chuyển quyền chủ hộ ở chức năng khác.</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                <FormField control={form.control} name="hoKhauId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="font-medium">Hộ khẩu (Phòng)</FormLabel>
                                        <ComboboxSearch
                                            options={householdOptions}
                                            value={field.value || ""} 
                                            onSelect={field.onChange}
                                            placeholder="Chọn hộ khẩu..."
                                            disabled={isCurrentChuHo}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Hiển thị thông tin quan hệ (read-only) */}
                            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200">
                                <span className="font-medium">Quan hệ với chủ hộ:</span>{" "}
                                <span className="font-semibold text-slate-900">
                                    {isCurrentChuHo ?  "Chủ hộ" : "Thành viên"}
                                </span>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:justify-between items-center">
                            <span className="text-xs text-slate-400 hidden sm:block">
                                * Các trường đánh dấu đỏ là bắt buộc
                            </span>
                            <div className="flex gap-2">
                                <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                                    Hủy bỏ
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}