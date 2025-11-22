"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema validation
const formSchema = z.object({
    soHoKhau: z.string().min(1, "Số hộ khẩu là bắt buộc"),
    tenChuHo: z.string().min(2, "Tên chủ hộ phải > 2 ký tự"),
    soNha: z.string().min(1, "Nhập số nhà"),
    duong: z.string().min(1, "Nhập tên đường"),
    phuong: z.string().min(1, "Nhập phường/xã"),
    quan: z.string().min(1, "Nhập quận/huyện"),
    ngayLap: z.string(),
});

export function CreateHouseholdDialog() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            soHoKhau: "",
            tenChuHo: "",
            soNha: "",
            duong: "",
            phuong: "",
            quan: "",
            ngayLap: new Date().toISOString().split('T')[0], // Mặc định hôm nay
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Gọi API tạo mới 
        console.log(values);
        alert("Đã thêm hộ khẩu: " + values.soHoKhau);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-primary-gradient shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Thêm hộ khẩu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-blue-900">Thêm hộ khẩu mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin cơ bản của hộ. Sau khi tạo, bạn có thể thêm thành viên vào hộ này.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="soHoKhau" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số Hộ Khẩu (ID)</FormLabel>
                                    <FormControl><Input placeholder="VD: HK005" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="ngayLap" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ngày lập sổ</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="tenChuHo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ tên Chủ Hộ (Dự kiến)</FormLabel>
                                <FormControl><Input placeholder="Nhập tên chủ hộ..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="space-y-2 border p-3 rounded-md bg-slate-50">
                            <h4 className="text-sm font-medium text-muted-foreground">Địa chỉ thường trú</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="soNha" render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder="Số nhà" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="duong" render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder="Đường/Phố" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phuong" render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder="Phường/Xã" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="quan" render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder="Quận/Huyện" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="bg-primary-gradient w-full md:w-auto">
                                <Save className="mr-2 h-4 w-4" /> Lưu hộ khẩu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}