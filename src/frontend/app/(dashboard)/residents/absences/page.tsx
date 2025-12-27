"use client";


import { AbsenceModal } from "@/components/absence/Absence-modal";
import { AbsenceTable } from "@/components/absence/Absence-Table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAbsence } from "@/lib/hooks/use-residents";
import { AbsenceRegistration } from "@/lib/types/models/absence-registration";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
// import { AbsenceModal } from "./absence-modal"; // (Component modal bạn sẽ làm sau)

export default function AbsenceManagerPage() {
    // 1. Gọi Hook
    const {
        registrations,
        isLoading,
        createRegistration,
        updateRegistration,
        deleteRegistration,
        isCreating,
        isUpdating,
        searchQuery,
        setSearchQuery,
    } = useAbsence();

    // State để điều khiển Modal (nếu có)
    const [selectedItem, setSelectedItem] = useState<AbsenceRegistration | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mở modal Create
    const handleOpenCreate = () => {
        setSelectedItem(null); // Clear item -> Mode Create
        setIsModalOpen(true);
    };

    // Mở modal Edit
    const handleOpenEdit = (item: AbsenceRegistration) => {
        setSelectedItem(item); // Set item -> Mode Edit
        setIsModalOpen(true);
    };
    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
            await deleteRegistration(id);
        }
    };
    const handleSubmitForm = async (formData: any) => {
        try {
            if (selectedItem) {
                await updateRegistration(selectedItem.id, formData);
            } else {
                await createRegistration(formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Lỗi khi gửi form:", error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header & Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý Tạm trú / Tạm vắng</h2>
                    <p className="text-muted-foreground">
                        Danh sách công dân khai báo tạm trú và tạm vắng tại địa bàn.
                    </p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Đăng ký mới
                </Button>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex items-center gap-2 max-w-sm">
                <Input
                    placeholder="Tìm kiếm theo tên hoặc CCCD..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table Component - Truyền props xuống */}
            <AbsenceTable
                data={registrations}
                isLoading={isLoading}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            {/* Modal dùng chung cho cả Create và Edit */}
            <AbsenceModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                initialData={selectedItem}
                onSubmit={handleSubmitForm}
                isLoading={isCreating || isUpdating}
            />
        </div>
    );
}