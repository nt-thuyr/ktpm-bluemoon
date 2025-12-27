"use client";
import { CreateHouseholdDialog } from "@/components/households/CreateHouseholdDialog";
import { HouseholdsTable } from "@/components/households/HouseholdsTable";
import { useHouseholds } from "@/lib/hooks/use-households";
import { useEffect } from "react";

export default function HouseholdsPage() {
    const { households, isLoading, fetchHouseholds, addHousehold, updateHousehold, deleteHousehold } = useHouseholds();

    useEffect(() => {
        fetchHouseholds();
    }, [fetchHouseholds]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Quản Lý Hộ Khẩu</h1>
                <CreateHouseholdDialog onAddSuccess={addHousehold} />
            </div>

            <HouseholdsTable data={households}
                isLoading={isLoading}
                onUpdate={updateHousehold}
                onDelete={deleteHousehold}
            />
        </div>
    )
}