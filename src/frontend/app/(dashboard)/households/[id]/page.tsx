"use client";

import { HouseholdMembersTable } from "@/components/households/HouseholdDetailCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { householdApi } from "@/lib/services/households";
import { residentsApi } from "@/lib/services/residents";
import { Household } from "@/lib/types/models/household";
import { Resident } from "@/lib/types/models/resident";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function HouseholdDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [household, setHousehold] = useState<Household | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await householdApi.getHouseholdById(id);
            setHousehold(data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải thông tin hộ khẩu");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ✅ Handler:  Cập nhật thông tin thành viên
    const handleUpdateMember = async (memberId: string, data: Partial<Resident>) => {
        try {
            await residentsApi.updateResident(memberId, data);
            toast.success("Đã cập nhật thông tin thành viên");
            
            // ✅ RELOAD để cập nhật UI và lịch sử
            await loadData();
        } catch (error:  any) {
            const msg = error?. response?.data?.message || "Cập nhật thất bại";
            toast.error(msg);
        }
    };

    // ✅ Handler: Xóa thành viên (chuyển đi)
    const handleRemoveMember = async (memberId:  string) => {
        try {
            await residentsApi.deleteResident(memberId);
            toast.success("Đã chuyển thành viên ra khỏi hộ khẩu");
            
            // ✅ RELOAD để cập nhật UI và lịch sử
            await loadData();
        } catch (error: any) {
            const msg = error?.response?.data?. message || "Xóa thất bại";
            toast. error(msg);
        }
    };

    if (loading) return <div>Đang tải thông tin hộ khẩu...</div>;
    if (!household) return <div>Không tìm thấy hộ khẩu này. </div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
                </Button>
            </div>

            {/* Card Thông tin chung */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-blue-800">
                        Thông tin Hộ khẩu:  {household.id}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Chủ hộ</p>
                        <p className="text-lg font-bold text-slate-800">{household.tenChuHo}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Địa chỉ</p>
                        <p className="text-base text-slate-800">Căn hộ {household.soNha}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Ngày lập</p>
                        <p className="text-base text-slate-800">
                            {household.ngayLap
                                ? new Date(household. ngayLap).toLocaleDateString('vi-VN')
                                : '--'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Danh sách thành viên */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                    Danh sách thành viên ({household.thanhVien.length})
                </h3>
                <HouseholdMembersTable
                    members={household.thanhVien}
                    onUpdateMember={handleUpdateMember}
                    onRemoveMember={handleRemoveMember}
                />
            </div>
        </div>
    );
}