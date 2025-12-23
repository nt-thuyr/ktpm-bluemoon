"use client"

import { AccountantDashboard } from "@/components/dashboard/accountant-view";
import { ManagerDashboard } from "@/components/dashboard/manager-view";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useState } from "react";

// Định nghĩa các Role
type UserRole = "ADMIN" | "MANAGER" | "ACCOUNTANT";

export default function DashboardPage() {
  // STATE GIẢ LẬP: Dùng để test chuyển đổi giao diện ngay trên màn hình
  // Sau này có Auth thật thì thay bằng: const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>("MANAGER");

  return (
    <div className="space-y-6">

      {/* --- KHU VỰC DEV TOOL (Xóa khi deploy) --- */}
      <div className="flex items-center gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <span className="text-sm font-bold text-yellow-800">🛠️ DEV MODE: Giả lập vai trò user</span>
        <Select
          value={currentRole}
          onValueChange={(val) => setCurrentRole(val as UserRole)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MANAGER">Quản lý Cư dân</SelectItem>
            <SelectItem value="ACCOUNTANT">Kế toán Thu phí</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* ------------------------------------------- */}

      {/* LOGIC HIỂN THỊ */}

      {/* 1. View cho Quản Lý */}
      {currentRole === "MANAGER" && (
        <ManagerDashboard />
      )}

      {/* 2. View cho Kế Toán */}
      {currentRole === "ACCOUNTANT" && (
        <AccountantDashboard />
      )}

      {/* 3. View cho Admin (Thấy cả 2 hoặc một dashboard tổng hợp riêng) */}
      {currentRole === "ADMIN" && (
        <div className="space-y-8">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-lg font-bold text-slate-500 mb-2">Góc nhìn Quản trị cư dân</h3>
            <ManagerDashboard />
          </div>

          <div className="border-t border-slate-200" />

          <div className="border-l-4 border-green-600 pl-4">
            <h3 className="text-lg font-bold text-slate-500 mb-2">Góc nhìn Tài chính</h3>
            <AccountantDashboard />
          </div>
        </div>
      )}

    </div>
  );
}