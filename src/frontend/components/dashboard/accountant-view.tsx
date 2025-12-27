"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Banknote, TrendingUp } from "lucide-react";

export function AccountantDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Tài chính & Kế toán</h2>
                <p className="text-muted-foreground">Báo cáo doanh thu, công nợ và các khoản thu phí.</p>
            </div>

            {/* 3 CARD CHỈ SỐ VỀ TIỀN */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Doanh thu T11</CardTitle>
                        <Banknote className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">150.000.000 đ</div>
                        <p className="text-xs text-muted-foreground">+12% so với tháng 10</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Nợ quá hạn</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">12.500.000 đ</div>
                        <p className="text-xs text-muted-foreground">12 Căn hộ chưa đóng phí</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Dự kiến thu</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">180.000.000 đ</div>
                        <p className="text-xs text-muted-foreground">Đạt 85% kế hoạch</p>
                    </CardContent>
                </Card>
            </div>

            {/* BIỂU ĐỒ CỘT & DANH SÁCH NỢ */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Biểu đồ doanh thu chiếm 4 phần */}
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Biểu đồ doanh thu 6 tháng</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Giữ chỗ cho biểu đồ cột */}
                    </CardContent>
                </Card>

                {/* Danh sách nợ chiếm 3 phần */}
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-red-600 text-base">Cần nhắc nhở thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock list items */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                                            P{i}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Phòng 10{i}</p>
                                            <p className="text-xs text-red-500">Nợ 3 tháng</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-sm text-slate-700">1.2tr</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}