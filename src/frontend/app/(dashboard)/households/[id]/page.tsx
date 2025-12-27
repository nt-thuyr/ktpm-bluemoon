"use client";

import { HouseholdMembersTable } from "@/components/households/HouseholdDetailCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { householdApi } from "@/lib/services/households"; // Import service
import { Household } from "@/lib/types/models/household";
import { ArrowLeft, Split, UserPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HouseholdDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [household, setHousehold] = useState<Household | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const loadData = async () => {
            try {
                const data = await householdApi.getHouseholdById(id);
                setHousehold(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div>Đang tải thông tin hộ khẩu...</div>;
    if (!household) return <div>Không tìm thấy hộ khẩu này.</div>;

    return (
        <div className="space-y-6">
            {/* 1. Header & Nút Back */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
                </Button>
                <div className="space-x-2">
                    {/* Các nút chức năng nâng cao */}
                    <Button variant="outline" className="gap-2">
                        <Split className="h-4 w-4" /> Tách hộ
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="h-4 w-4" /> Thêm thành viên
                    </Button>
                </div>
            </div>

            {/* 2. Card Thông tin chung */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-blue-800">Thông tin Hộ khẩu: {household.id}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Chủ hộ</p>
                        <p className="text-lg font-bold text-slate-800">{household.tenChuHo}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Địa chỉ</p>
                        <p className="text-base text-slate-800">{household.diaChi}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Diện tích</p>
                        <p className="text-base text-slate-800">{household.dienTich} m2</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Ngày lập</p>
                        <p className="text-base text-slate-800">
                            {household.ngayLap ? new Date(household.ngayLap).toLocaleDateString('vi-VN') : '--'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* 3. Danh sách thành viên (Reuse UI Table nhưng custom cột) */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                    Danh sách thành viên ({household.thanhVien.length})
                </h3>

                {/* Truyền thẳng mảng thành viên vào đây */}
                <HouseholdMembersTable members={household.thanhVien} />
            </div>
        </div>
    );
}