"use client"
import { CreateResidentDialog } from "@/components/residents/CreateResidentDialog"
import { ResidentsTable } from "@/components/residents/ResidentsTable"
import { useResidents } from "@/lib/hooks/use-residents"
import { Users } from "lucide-react"
// Trang nay gom:
// Header: Tiêu đề + Breadcrumb 
// Toolbar: Search input, Filter select, Button "Thêm mới".
// Table: Hiển thị dữ liệu.



export default function ResidentsPage() {
    const { residents, createResident, isLoading } = useResidents();

    return (
        <div className="space-y-8">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    {/* text-primary để ăn theo màu xanh đen chủ đạo */}
                    <h2 className="text-3xl font-bold tracking-tight text-primary">
                        Danh sách Cư dân
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Quản lý thông tin hồ sơ, hợp đồng và nhân khẩu từng căn hộ.
                    </p>
                </div>


                {/* <Button className="shadow-md font-medium">
                    <Plus className="mr-2 h-4 w-4" /> Thêm cư dân mới
                </Button> */}
                <CreateResidentDialog onCreate={createResident.mutateAsync} />

            </div>

            {/* TABLE SECTION */}
            <div className="flex h-[500px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50/50">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
                        <Users className="h-10 w-10 text-muted-foreground/40" />
                    </div>

                    <ResidentsTable residents={residents} isLoading={isLoading} />
                </div>
            </div>
        </div>
    )
}