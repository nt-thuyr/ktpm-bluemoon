"use client"
import { CreateFeeDialog } from "@/components/fee/create-fee-dialog";
import { FeesTable } from "@/components/fee/fee-table";
import { Input } from "@/components/ui/input";
import { useFees } from "@/lib/hooks/use-fee";
import { useEffect } from "react";
export default function Apartment() {
    const { fees, isLoading, fetchFees, deleteFee, updateFee, addFee, searchQuery, setSearchQuery } = useFees();

    useEffect(() => {
        fetchFees();
    }, [fetchFees]);
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <CreateFeeDialog onAddSuccess={addFee} />
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Tìm kiếm khoản thu (tên khoản thu)..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="mt-6">
                <FeesTable data={fees}
                    isLoading={isLoading}
                    onDelete={deleteFee}
                    onUpdate={updateFee} />
            </div>

        </div>
    );

}