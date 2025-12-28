"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { APARTMENT_INFO, Household } from "@/lib/types/models/household";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema validate dữ liệu nhập vào
const formSchema = z. object({
    soNha:  z.string().min(1, "Số nhà không được để trống"),
    duong: z.string().min(1, "Đường không được để trống"),
    phuong: z.string().min(1, "Phường không được để trống"),
    quan: z.string().min(1, "Quận không được để trống"),
    chuHoId:  z.coerce. number().optional(),
});

interface EditHouseholdDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    household: Household | null;
    onSave:  (updatedData: Household) => Promise<void>;
}

export function EditHouseholdDialog({
    open,
    onOpenChange,
    household,
    onSave,
}: EditHouseholdDialogProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues:  {
            soNha: "",
            duong: "",
            phuong: "",
            quan: "",
            chuHoId: undefined,
        },
    });

    // Lấy danh sách thành viên từ household
    const members = useMemo(() => {
        return household?.thanhVien || [];
    }, [household]);

    // Reset form mỗi khi mở modal với data mới
    useEffect(() => {
        if (household) {
            form.reset({
                soNha: household. soNha || "",
                duong:  APARTMENT_INFO.DUONG,
                phuong: APARTMENT_INFO.PHUONG,
                quan: APARTMENT_INFO.QUAN,
                chuHoId: household.chuHoId || undefined,
            });
        }
    }, [household, form]);

    const onSubmit = async (values:  z.infer<typeof formSchema>) => {
        if (!household) return;
        const updatedHousehold: Household = {
            ...household,
            ... values,
        };
        console.log(updatedHousehold);
        await onSave(updatedHousehold);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-white text-slate-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        Chỉnh sửa Hộ khẩu
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form. control}
                                name="soNha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-medium">Số Phòng / Căn Hộ</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="VD: P102, 1205..." 
                                                className="bg-white border-slate-300" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duong"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-medium">Đường/Phố</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {... field} 
                                                disabled 
                                                className="bg-slate-100 text-slate-600 cursor-not-allowed border-slate-300" 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form. control}
                                name="phuong"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-medium">Phường/Xã</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                disabled 
                                                className="bg-slate-100 text-slate-600 cursor-not-allowed border-slate-300" 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form. control}
                                name="quan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-medium">Quận/Huyện</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                disabled 
                                                className="bg-slate-100 text-slate-600 cursor-not-allowed border-slate-300" 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="chuHoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-medium">Chủ hộ</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field. value ? String(field.value) : ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white border-slate-300">
                                                    <SelectValue placeholder="Chọn nhân khẩu trong hộ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {members.length === 0 ? (
                                                    <div className="px-2 py-4 text-sm text-slate-500 text-center">
                                                        Không có thành viên nào
                                                    </div>
                                                ) : (
                                                    members. map((member) => (
                                                        <SelectItem
                                                            key={member.id}
                                                            value={member.id.toString()}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-slate-900">{member.hoTen}</span>
                                                                {member.id === household?.chuHoId && (
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                                                                        Hiện tại
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-xs text-slate-600">
                                            Chọn nhân khẩu trong hộ để làm chủ hộ
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => onOpenChange(false)}
                                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            >
                                Hủy
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={form.formState.isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {form.formState.isSubmitting ?  "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}