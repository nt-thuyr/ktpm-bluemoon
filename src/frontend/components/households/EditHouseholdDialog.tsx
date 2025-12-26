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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Household } from "@/lib/types/models/household";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema validate dữ liệu nhập vào
const formSchema = z.object({
    soNha: z.string().min(1, "Số nhà không được để trống"),
    duong: z.string().min(1, "Đường không được để trống"),
    phuong: z.string().min(1, "Phường không được để trống"),
    quan: z.string().min(1, "Quận không được để trống"),
    dienTich: z.coerce.number().min(0, "Diện tích phải lớn hơn 0"), // coerce để ép kiểu string input -> number
    chuHoId: z.coerce.number().optional(), // Có thể nhập ID chủ hộ mới
    // NgayLap thường không cho sửa, hoặc sửa thì dùng DatePicker (tạm thời bỏ qua hoặc để readonly)
});

interface EditHouseholdDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    household: Household | null;
    onSave: (updatedData: Household) => Promise<void>;
}

export function EditHouseholdDialog({
    open,
    onOpenChange,
    household,
    onSave,
}: EditHouseholdDialogProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            soNha: "",
            duong: "",
            phuong: "",
            quan: "",
            dienTich: 0,
            chuHoId: undefined,
        },
    });

    // Reset form mỗi khi mở modal với data mới
    useEffect(() => {
        if (household) {
            form.reset({
                soNha: household.soNha || "",
                duong: household.duong || "",
                phuong: household.phuong || "",
                quan: household.quan || "",
                dienTich: household.dienTich || 0,
                chuHoId: household.chuHoId || undefined,
            });
        }
    }, [household, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!household) return;

        // Merge dữ liệu cũ với dữ liệu mới form
        const updatedHousehold: Household = {
            ...household,
            ...values,
            // Các trường không có trong form thì giữ nguyên từ data cũ
        };

        await onSave(updatedHousehold);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-2xl bg-white text-slate-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <DialogHeader className="text-xl font-bold text-primary flex gap-2 ">
                    <DialogTitle>Chỉnh sửa Hộ khẩu</DialogTitle>
                </DialogHeader>

                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="soNha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số nhà</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Số 10" {...field} />
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
                                        <FormLabel>Đường/Phố</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tạ Quang Bửu" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phuong"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phường/Xã</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Bách Khoa" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quận/Huyện</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hai Bà Trưng" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dienTich"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diện tích (m2)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chuHoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID Chủ hộ mới</FormLabel>
                                        <FormControl>
                                            {/* Đây là nhập ID thủ công. Để xịn hơn nên làm Select Search Nhân khẩu */}
                                            <Input type="number" placeholder="Nhập ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}