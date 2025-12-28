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
import { APARTMENT_INFO } from "@/lib/types/models/household";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    chuHoId: z.coerce.number().min(1, "Vui lòng nhập ID nhân khẩu làm chủ hộ"),

    soNha: z.string().min(1, "Nhập số nhà"),
    duong: z.string().min(1, "Nhập tên đường"),
    phuong: z.string().min(1, "Nhập phường/xã"),
    quan: z.string().min(1, "Nhập quận/huyện"),
    // dienTich: z.coerce.number().min(0, "Diện tích không hợp lệ"),

    ngayLap: z.string(),
});

interface CreateHouseholdDialogProps {
    onAddSuccess: (data: any) => Promise<boolean>;
}
export function CreateHouseholdDialog({ onAddSuccess }: CreateHouseholdDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            chuHoId: 0,
            soNha: "",
            // dienTich: 0,
            ngayLap: new Date().toISOString().split('T')[0],

            duong: APARTMENT_INFO.DUONG,
            phuong: APARTMENT_INFO.PHUONG,
            quan: APARTMENT_INFO.QUAN,
        },
    });

    // Hàm xử lý Submit
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const success = await onAddSuccess({
            ChuHoID: values.chuHoId,
            SoNha: values.soNha,
            Duong: values.duong,
            Phuong: values.phuong,
            Quan: values.quan,
            // DienTich: values.dienTich,
            NgayLamHoKhau: values.ngayLap
        });

        if (success) {
            setOpen(false);
            form.reset();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="shadow-md bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Thêm hộ khẩu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl  bg-white text-slate-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-800">Thêm hộ khẩu mới</DialogTitle>
                    <DialogDescription>
                        Nhập ID nhân khẩu để làm chủ hộ. Hệ thống sẽ tự tạo số hộ khẩu mới.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2 border p-3 rounded-md bg-slate-50">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Nhập ID Chủ Hộ */}
                                <FormField control={form.control} name="chuHoId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID Chủ Hộ (Nhân khẩu)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="VD: 10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Ngày lập */}
                                <FormField control={form.control} name="ngayLap" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày lập sổ</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <div className="space-y-2 border p-3 rounded-md bg-slate-50">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Thông tin nơi ở</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="soNha" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số Phòng / Căn Hộ</FormLabel>
                                        <FormControl><Input placeholder="VD: P102, 1205..." className="bg-white" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                {/* Read only field */}
                                <FormField control={form.control} name="duong" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đường/Phố</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled className="bg-slate-200 text-slate-600 cursor-not-allowed" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phuong" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phường/Xã</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled className="bg-slate-200 text-slate-600 cursor-not-allowed" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="quan" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quận/Huyện</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled className="bg-slate-200 text-slate-600 cursor-not-allowed" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Thêm Diện tích */}
                                {/* <FormField control={form.control} name="dienTich" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diện tích (m2)</FormLabel>
                                        <FormControl><Input type="number" className="bg-white" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} /> */}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>

                            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-blue-950 hover:bg-blue-700">
                                {form.formState.isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" /> Tạo hộ khẩu</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};