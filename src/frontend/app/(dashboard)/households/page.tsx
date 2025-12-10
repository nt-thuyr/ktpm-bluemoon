import { CreateHouseholdDialog } from "@/components/households/CreateHouseholdDialog";
import { HouseholdsTable } from "@/components/households/HouseholdsTable";

export default function HouseholdsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Quản Lý Hộ Khẩu</h1>
                <CreateHouseholdDialog />
            </div>

            <HouseholdsTable />
        </div>
    )
}