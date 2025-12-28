// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { dashboardService } from "@/lib/services/dashboard";
// import { PopulationStats } from "@/lib/types/models/dashboard";
// import { FileText, Loader2, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import { SimpleBarChart, SimplePieChart } from "../dashboard/DashboardChart";

// export function ManagerDashboard() {
//     const [stats, setStats] = useState<PopulationStats | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchManagerData() {
//             try {
//                 setLoading(true);
//                 const data = await dashboardService.getManagerStats();
//                 setStats(data);
//             } catch (error) {
//                 console.error("Failed to fetch dashboard data", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchManagerData();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex h-[450px] items-center justify-center gap-2 text-muted-foreground">
//                 <Loader2 className="animate-spin" /> Đang tải dữ liệu thống kê...
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h2 className="text-3xl font-bold tracking-tight text-primary">Quản lý Cư dân</h2>
//                 <p className="text-muted-foreground">Tổng quan về nhân khẩu và các chỉ số phân bộ.</p>
//             </div>

//             {/* --- KHU VỰC 1: CÁC THẺ SỐ LIỆU TỔNG QUÁT --- */}
//             <div className="grid gap-4 md:grid-cols-2">
//                 {/* 1: Tổng nhân khẩu */}
//                 <Card className="border-t-4 border-t-blue-500 shadow-sm">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium text-muted-foreground">Tổng nhân khẩu</CardTitle>
//                         <Users className="h-4 w-4 text-blue-500" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold text-primary">
//                             {stats?.cards.tong_cu_dan || 0}
//                         </div>
//                         <p className="text-xs text-muted-foreground font-medium">Nhân khẩu đang cư trú thực tế</p>
//                     </CardContent>
//                 </Card>

//                 {/* 2: Tổng biến động (Tạm trú + Tạm vắng) */}
//                 <Card className="border-t-4 border-t-orange-500 shadow-sm">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium text-muted-foreground">Biến động cư trú</CardTitle>
//                         <FileText className="h-4 w-4 text-orange-500" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold text-orange-600">
//                             {stats?.cards.tong_bien_dong || 0}
//                         </div>
//                         <p className="text-xs text-muted-foreground font-medium">Hồ sơ tạm trú và tạm vắng</p>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* --- KHU VỰC 2: BIỂU ĐỒ CHI TIẾT --- */}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

//                 {/* Cột trái: 2 Biểu đồ tròn xếp chồng */}
//                 <div className="lg:col-span-3 space-y-4">
//                     <SimplePieChart
//                         title="Cơ cấu dân cư"
//                         data={stats?.charts.co_cau_dan_cu || []}
//                     />
//                     <SimplePieChart
//                         title="Tỉ lệ Giới tính"
//                         data={stats?.charts.phan_bo_gioi_tinh || []}
//                     />
//                 </div>

//                 {/* Cột phải: Biểu đồ cột và Thông báo */}
//                 <div className="lg:col-span-4 space-y-4">
//                     <SimpleBarChart
//                         title="Phân bổ độ tuổi dân cư"
//                         data={stats?.charts.phan_bo_do_tuoi || []}
//                         dataKey="value"
//                         color="#3b82f6"
//                     />

//                     <Card className="shadow-sm border-dashed border-2">
//                         <CardHeader>
//                             <CardTitle className="text-sm font-semibold flex items-center gap-2">
//                                 <span className="relative flex h-2 w-2">
//                                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
//                                     <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
//                                 </span>
//                                 Ghi chú hệ thống
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="text-sm text-muted-foreground leading-relaxed">
//                             Biểu đồ trên phản ánh sự phân bố độ tuổi trong toàn bộ nhân khẩu.
//                             Nhóm <strong>Lao động (18-60)</strong> chiếm tỉ trọng lớn nhất là dấu hiệu tích cực cho các hoạt động đóng góp cộng đồng.
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/lib/services/dashboard";
import { ProcessedPopulationStats } from "@/lib/types/models/dashboard";
import { Loader2, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { SimpleBarChart, SimplePieChart } from "../dashboard/DashboardChart";

export function ManagerDashboard() {
    const [stats, setStats] = useState<ProcessedPopulationStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardService.getManagerStats()
            .then((data) => setStats(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
    if (!stats) return <div>Không có dữ liệu.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Quản lý Cư dân</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Tổng cư dân</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tong_cu_dan}</div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Tạm trú</CardTitle>
                        <MapPin className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{stats.tam_tru}</div>
                    </CardContent>
                </Card>

                <SimplePieChart
                    title="Cơ cấu cư trú"
                    data={stats.co_cau_dan_cu}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <SimplePieChart
                    title="Tỷ lệ Giới tính"
                    data={stats.phan_bo_gioi_tinh}
                />
                <div className="w-full">
                    <SimpleBarChart
                        title="Phân bố Độ tuổi"
                        data={stats.phan_bo_do_tuoi}
                        dataKey="value"
                        color="#3b82f6"
                    />
                </div>
            </div>
        </div>
    );
}