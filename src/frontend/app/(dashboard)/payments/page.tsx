"use client";

import { PaymentCreateModal } from "@/components/payment/CreatePaymentModel";
import { PaymentTable } from "@/components/payment/PaymentTable";
import { ReceiptModal } from "@/components/payment/ReceiptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePayment } from "@/lib/hooks/use-payment";
import { CreatePaymentRequest } from "@/lib/types/models/payment";
import { PlusCircle, ReceiptText, Search } from "lucide-react";
import { useState } from "react";

export default function PaymentManagerPage() {
    const {
        payments,
        isLoading,
        deletePayment,
        fetchReceipt,
        receiptData,
        isFetchingReceipt,
        createPayment,
        isCreating,
        searchQuery,
        setSearchQuery,
    } = usePayment();

    // States  quản lý việc đóng mở các Modal (Tạo mới, In ấn)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

    // Handlers
    const handleCreateSubmit = async (data: CreatePaymentRequest) => {
        try {
            await createPayment(data);
            setIsCreateModalOpen(false);
        } catch (error) {
        }
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa lịch sử thu phí #${id}? Hành động này không thể hoàn tác.`)) {
            await deletePayment(id);
        }
    };

    const handleViewReceiptClick = async (id: number) => {
        setIsReceiptModalOpen(true);
        await fetchReceipt(id);
        console.log("Đang mở modal in cho ID:", id);
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ReceiptText className="h-6 w-6" /> Quản lý Thu Phí
                    </h2>
                    <p className="text-muted-foreground">
                        Danh sách lịch sử nộp tiền của các hộ khẩu và các khoản thu.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ghi nhận thu phí mới
                    </Button>
                </div>
            </div>
            {/* Search bar */}
            <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên người nộp, mã hộ..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <PaymentTable
                data={payments}
                isLoading={isLoading}
                onDelete={handleDeleteClick}
                onViewReceipt={handleViewReceiptClick}
            />
            <PaymentCreateModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSubmit={handleCreateSubmit}
                isLoading={isCreating}
            />
            <ReceiptModal
                open={isReceiptModalOpen}
                onOpenChange={setIsReceiptModalOpen}
                data={receiptData}
                isLoading={isFetchingReceipt}
            />

        </div>
    );
}