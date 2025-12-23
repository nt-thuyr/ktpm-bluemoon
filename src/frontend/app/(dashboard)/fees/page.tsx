import { CreateFeeDialog } from "@/components/fee/create-fee-dialog";
import { FeesTable } from "@/components/fee/fee-table";
export default function Apartment() {
    return (
        <div>
            <CreateFeeDialog />

            <div className="mt-6">
                <FeesTable />
            </div>

        </div>
    );

}