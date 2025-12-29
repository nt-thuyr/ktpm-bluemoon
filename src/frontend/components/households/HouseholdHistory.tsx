"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { householdApi } from "@/lib/services/households"
import { Clock, History } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface HouseholdHistoryItem {
    Id: number;
    NhanKhauID:  number;
    HoKhauID: number;
    TenNhanKhau: string;
    LoaiThayDoi: number;
    MoTaThayDoi:  string;
    ThoiGian: string;
}

interface Props {
    householdId:  string;
    open?:  boolean;
    onOpenChange?: (open: boolean) => void;
}

export function HouseholdHistoryDialog({ householdId, open, onOpenChange }: Props) {
    const [data, setData] = useState<HouseholdHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && householdId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const historyData = await householdApi.getHouseholdHistory(parseInt(householdId));
                    setData(historyData);
                } catch (error) {
                    console.error("Lỗi tải lịch sử:", error);
                    toast.error("Không tải được lịch sử thay đổi");
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [open, householdId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Lịch sử thay đổi hộ khẩu</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            Đang tải dữ liệu... 
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                            <History className="h-8 w-8 opacity-20" />
                            <span className="text-sm">Chưa có ghi nhận thay đổi nào. </span>
                        </div>
                    ) : (
                        <div className="relative border-l border-slate-200 ml-3 space-y-6 pt-2">
                            {data.map((item) => (
                                <div key={item.Id} className="relative pl-6 group">
                                    <div className="absolute -left-[5px] top-1. 5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white group-hover:bg-primary transition-colors" />

                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-900">
                                            {item. MoTaThayDoi}
                                        </span>

                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock className="h-3 w-3" />
                                            {new Date(item.ThoiGian).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </div>

                                        <p className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit mt-1">
                                            Người:  <span className="font-medium text-slate-700">{item.TenNhanKhau}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}