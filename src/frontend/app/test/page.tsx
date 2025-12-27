"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResidents } from "@/lib/hooks/use-residents"; // Sửa lại đường dẫn hook của bạn
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"; // Icon cho đẹp

export default function TestResidentsPage() {
    // 1. Gọi Hook
    const {
        residents,
        isLoading,
        isError,
        searchQuery,
        setSearchQuery,
        createResident,
        updateResident,
        deleteResident,
        refetch,
    } = useResidents();

    // --- HÀM TEST THÊM (Dùng window.prompt cho nhanh) ---
    const handleTestCreate = async () => {
        const name = window.prompt("Nhập tên cư dân mới:", "Nguyễn Văn Test");
        if (!name) return;

        // Giả lập dữ liệu gửi lên
        await createResident.mutateAsync({
            hoTen: name,
            cccd: "00123456789" + Math.floor(Math.random() * 100), // Random để đỡ trùng
            gioiTinh: "Nam",
            ngaySinh: "1990-01-01",

            // 2. Các trường phụ (bắt buộc phải khai báo, nhưng có thể để null hoặc string giả)
            danToc: "Kinh",
            tonGiao: "Không",
            ngayCap: "2021-01-01",
            noiCap: "Cục Cảnh sát QLHC về TTXH",
            ngheNghiep: "Lập trình viên",
            ghiChu: "Cư dân tạo từ trang Test",

            // Quan trọng: Nếu chưa có hộ khẩu, phải để null rõ ràng
            householdId: null,
            quanHeVoiChuHo: "Chủ hộ", // Hoặc null
        });
    };

    // --- HÀM TEST SỬA ---
    const handleTestUpdate = async (id: string, oldName: string) => {
        const newName = window.prompt("Sửa tên cư dân thành:", oldName);
        if (!newName) return;

        await updateResident.mutateAsync(id, {
            hoTen: newName,
        });
    };

    // --- HÀM TEST XÓA ---
    const handleTestDelete = async (id: string) => {
        if (window.confirm("Bạn chắc chắn muốn xóa cư dân này?")) {
            await deleteResident.mutateAsync(id);
        }
    };

    return (
        <div className="p-10 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Test API Cư Dân</h1>
                <Button onClick={() => refetch()} variant="outline">
                    Làm mới dữ liệu
                </Button>
            </div>

            {/* 2. Test Chức năng Tìm kiếm */}
            <div className="flex gap-4">
                <Input
                    placeholder="Tìm kiếm theo tên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                {/* Nút Thêm */}
                <Button onClick={handleTestCreate} disabled={createResident.isLoading}>
                    {createResident.isLoading ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    Thêm Test
                </Button>
            </div>

            {/* 3. Test Hiển thị danh sách & Loading */}
            {isLoading ? (
                <div className="text-center py-10">Đang tải danh sách...</div>
            ) : isError ? (
                <div className="text-red-500 font-bold">Lỗi khi gọi API! Kiểm tra lại Server/Network.</div>
            ) : (
                <div className="grid gap-4">
                    <p className="text-sm text-muted-foreground">Tổng số: {residents.length} cư dân</p>

                    {residents.length === 0 && <div className="text-center">Chưa có dữ liệu</div>}

                    {residents.map((resident) => (
                        <Card key={resident.id} className="flex flex-row items-center justify-between p-4 shadow-sm">
                            <div className="space-y-1">
                                <div className="font-semibold text-lg">{resident.hoTen}</div>
                                <div className="text-sm text-gray-500">
                                    CCCD: {resident.cccd} - Giới tính: {resident.gioiTinh}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {/* Nút Sửa */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleTestUpdate(resident.id, resident.hoTen)}
                                    disabled={updateResident.isLoading}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>

                                {/* Nút Xóa */}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleTestDelete(resident.id)}
                                    disabled={deleteResident.isLoading}
                                >
                                    {deleteResident.isLoading ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}