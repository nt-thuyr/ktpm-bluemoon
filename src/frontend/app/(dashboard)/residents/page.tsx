import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"

export default function ResidentsPage() {
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

                {/* BUTTON: 
                    - Bỏ bg-blue-600 đi. 
                    - Button mặc định đã là bg-primary (xanh đen) + text-primary-foreground (trắng).
                    - Thêm shadow-md cho nổi.
                */}
                <Button className="shadow-md font-medium">
                    <Plus className="mr-2 h-4 w-4" /> Thêm cư dân mới
                </Button>
            </div>

            {/* DATA TABLE PLACEHOLDER (Empty State) */}
            {/* Mình làm khung nét đứt (dashed) để biểu thị đây là chỗ chờ dữ liệu */}
            <div className="flex h-[500px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50/50">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    {/* Icon minh họa mờ mờ */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
                        <Users className="h-10 w-10 text-muted-foreground/40" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-primary">
                        Chưa có dữ liệu hiển thị
                    </h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-xs">
                        Danh sách cư dân hiện đang trống. Hãy thêm cư dân mới hoặc nhập dữ liệu từ Excel.
                    </p>

                    {/* Nút phụ demo (Sau này dùng để Import Excel chẳng hạn) */}
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                        Tải lại dữ liệu
                    </Button>
                </div>
            </div>
        </div>
    )
}