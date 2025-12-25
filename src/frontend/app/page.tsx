"use client"

// Import 2 dashboard con
import { AccountantDashboard } from "@/components/dashboard/accountant-dashboard";
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard";

// Giả lập user (Sau này lấy từ Authen Context)
const currentUser = {
    name: "Nguyễn Văn A",
    role: "KeToan" // Hoặc "QuanLy", "Admin"
};

export default function DashboardPage() {
    // Logic hiển thị theo Role
    if (currentUser.role === "KeToan") {
        return <AccountantDashboard />;
    }

    if (currentUser.role === "QuanLy") {
        return <ManagerDashboard />;
    }

    // Fallback cho Admin (Thấy tất cả)
    return (
        <div className="space-y-6">
            <h2 className="text-red-500 font-bold">Admin View - Thấy tất cả</h2>
            <ManagerDashboard />
            <div className="border-t border-slate-300 my-8" />
            <AccountantDashboard />
        </div>
    );
}