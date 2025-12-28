"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/lib/services/dashboard";
import { FinancialStats, formatVND } from "@/lib/types/models/dashboard";
import { AlertCircle, Banknote, Loader2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { SimpleBarChart } from "./DashboardChart";

export function AccountantDashboard() {
    const [stats, setStats] = useState<FinancialStats | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dashboardService.getAccountantStats()
            .then(data => setStats(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    const currentMonth = new Date().getMonth() + 1;
    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Đang tải dữ liệu tài chính...</div>;
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Tài chính & Kế toán</h2>
                <p className="text-muted-foreground">Báo cáo doanh thu, công nợ và các khoản thu phí.</p>
            </div>

            {/* --- 3 CARD CHỈ SỐ THẬT --- */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Doanh thu T{currentMonth}</CardTitle>
                        <Banknote className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">
                            {formatVND(stats?.cards.tong_doanh_thu || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Tổng thu trong tháng này</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-t-4 border-t-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Căn hộ nợ phí</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats?.cards.can_ho_no_phi} Căn hộ
                        </div>
                        <p className="text-xs text-muted-foreground">Chưa hoàn thành các khoản bắt buộc</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Trạng thái hệ thống</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">Ổn định</div>
                        <p className="text-xs text-muted-foreground">Dữ liệu cập nhật thời gian thực</p>
                    </CardContent>
                </Card>
            </div>

            {/* --- BIỂU ĐỒ & DANH SÁCH --- */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Biểu đồ doanh thu 6 tháng */}
                <div className="col-span-4">
                    <SimpleBarChart
                        title="Biểu đồ doanh thu 6 tháng gần nhất"
                        data={stats?.charts.doanh_thu_6_thang || []}
                        dataKey="total"
                        color="#10b981" // Màu xanh emerald
                    />
                </div>
            </div>
        </div>
    )

}