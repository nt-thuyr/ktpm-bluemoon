// app/(routes)/quan-ly-cu-dan/page.tsx
"use client"

import { CreateResidentDialog } from "@/components/residents/CreateResidentDialog"
import { ResidentsTable } from "@/components/residents/ResidentsTable"
import { Input } from "@/components/ui/input"
import { useHouseholds } from "@/lib/hooks/use-households"
import { useResidents } from "@/lib/hooks/use-residents"
import { Search } from "lucide-react"
import { useEffect } from "react"

export default function ResidentsPage() {
    // 1. Hook Cư dân
    const {
        residents,
        isLoading,
        createResident,
        updateResident,
        deleteResident,
        searchQuery,
        setSearchQuery
    } = useResidents();

    // 2. Hook Hộ khẩu (Để lấy list cho Combobox)
    const { households, fetchHouseholds } = useHouseholds();

    // Quan trọng: Phải fetch dữ liệu hộ khẩu khi vào trang
    useEffect(() => {
        fetchHouseholds();
    }, [fetchHouseholds]);

    // 3. Chuẩn hóa options cho Combobox
    const householdOptions = (households || []).map(h => ({
        value: h.id.toString(),
        // Label hiển thị: "Phòng 101 - Nguyễn Văn A"
        label: `Phòng ${h.soNha} - ${h.tenChuHo || 'Chưa có chủ hộ'}`
    }));

    return (
        <div className="space-y-6 p-6">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold tracking-tight text-primary">
                        Quản Lý Cư Dân
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Quản lý thông tin nhân khẩu, số CCCD và thông tin liên lạc.
                    </p>
                </div>

                {/* Truyền householdOptions vào để form tạo mới cũng chọn được */}
                <CreateResidentDialog
                    onAddSuccess={createResident}
                    householdOptions={householdOptions}
                />
            </div>

            {/* --- TOOLBAR SECTION (SEARCH) --- */}
            <div className="flex items-center space-x-2 bg-white p-1 rounded-md">
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên, CCCD, số phòng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 bg-white"
                    />
                </div>
            </div>

            {/* --- TABLE SECTION --- */}
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <ResidentsTable
                    data={residents}
                    isLoading={isLoading}
                    onUpdate={updateResident}
                    onDelete={deleteResident}
                    householdOptions={householdOptions} // Truyền xuống để form edit dùng
                />
            </div>
        </div>
    )
}