"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer, Tooltip as ReTooltip,
    XAxis,
    YAxis
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];


// // --- 1. BIỂU ĐỒ TRÒN (Dùng cho Giới tính, Cơ cấu) ---
// export function SimplePieChart({ data, title }: { data: any[], title: string }) {

//     return (
//         <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
//             <h3 className="font-semibold leading-none tracking-tight mb-4">{title}</h3>
//             <div className="h-[300px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                         <Pie
//                             data={data}
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={60}
//                             outerRadius={80}
//                             paddingAngle={5}
//                             dataKey="value"
//                         >
//                             {data.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <ReTooltip formatter={(value) => [value, "Số lượng"]} />
//                         <Legend verticalAlign="bottom" height={36} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// }

// --- 2. BIỂU ĐỒ CỘT (Dùng cho Độ tuổi, Doanh thu) ---
export function SimpleBarChart({ data, title, dataKey, color }: { data: any[], title: string, dataKey: string, color: string }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">{title}</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <ReTooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px' }}
                        />
                        {/* Backend bạn trả về 'fill' cho độ tuổi, nhưng doanh thu thì không. 
                Logic dưới đây ưu tiên màu backend gửi, nếu không có thì dùng màu props */}
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function SimplePieChart({ data, title }: { data: any[], title: string }) {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-4">{title}</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {/* Ưu tiên dùng màu fill từ Backend */}
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <ReTooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}