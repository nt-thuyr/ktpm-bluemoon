"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ResidentPieChart } from "@/components/dashboard/resident-pie-chart"; // Component bạn đã tạo lúc nãy
import { FileText, Home, UserPlus, Users } from "lucide-react";

export function ManagerDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Quản lý Cư dân</h2>
                <p className="text-muted-foreground">Tổng quan về nhân khẩu và biến động dân số.</p>
            </div>

            {/* 3 CARD CHỈ SỐ VỀ CON NGƯỜI */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng nhân khẩu</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">450</div>
                        <p className="text-xs text-muted-foreground">+5 người so với tháng trước</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ lấp đầy</CardTitle>
                        <Home className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">96%</div>
                        <p className="text-xs text-muted-foreground">115/120 Căn hộ có chủ</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tạm trú / Tạm vắng</CardTitle>
                        <FileText className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">85</div>
                        <p className="text-xs text-muted-foreground">Cần rà soát hồ sơ tháng này</p>
                    </CardContent>
                </Card>
            </div>

            {/* BIỂU ĐỒ TRÒN & DANH SÁCH MỚI */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Biểu đồ chiếm 3 phần */}
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Cơ cấu dân cư</CardTitle>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>

                {/* Danh sách cư dân mới chiếm 4 phần */}
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Cư dân mới chuyển đến
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock list items */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium text-sm">Nguyễn Văn Mới {i}</p>
                                        <p className="text-xs text-muted-foreground">Phòng P120{i} • Thường trú</p>
                                    </div>
                                    <div className="text-xs text-slate-500">Vừa xong</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}