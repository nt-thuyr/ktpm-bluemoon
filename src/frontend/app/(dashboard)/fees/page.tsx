"use client"
import { CreateFeeDialog } from "@/components/fee/create-fee-dialog";
import { FeesTable } from "@/components/fee/fee-table";
import { useFees } from "@/lib/hooks/use-fee";
import { useEffect } from "react";
export default function Apartment() {
    const { fees, isLoading, fetchFees, deleteFee, updateFee, addFee } = useFees();

    useEffect(() => {
        fetchFees();
    }, [fetchFees]);
    return (
        <div>
            <CreateFeeDialog onAddSuccess={addFee} />

            <div className="mt-6">
                <FeesTable data={fees}
                    isLoading={isLoading}
                    onDelete={deleteFee}
                    onUpdate={updateFee} />
            </div>

        </div>
    );

}