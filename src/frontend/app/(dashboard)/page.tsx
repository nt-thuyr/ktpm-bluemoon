"use client"

import { AccountantDashboard } from "@/components/dashboard/accountant-view";
import { ManagerDashboard } from "@/components/dashboard/manager-view";
import { useAuth } from "@/lib/hooks/use-auth";

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null
  if (!user) return null

  return (
    <div className="space-y-6">
      {/* LOGIC HIỂN THỊ */}

      {/* 1. View cho Quản Lý */}
      {user.vai_tro === "to_truong" && <ManagerDashboard />}

      {/* 2. View cho Kế Toán */}
      {user.vai_tro === "ke_toan" && <AccountantDashboard />}

    </div>
  );
}