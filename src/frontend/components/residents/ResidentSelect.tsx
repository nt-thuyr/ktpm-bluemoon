"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { residentsApi } from "@/lib/services/residents";
import { Resident } from "@/lib/types/models/resident";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";

interface ResidentSelectProps {
    value?: string; // Tên người đang chọn
    onChange: (name: string, hoKhauId?: number) => void;
}

export function ResidentSelect({ value, onChange }: ResidentSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [residents, setResidents] = React.useState<Resident[]>([]);
    const [loading, setLoading] = React.useState(false);

    const debouncedSearch = useDebounce(searchTerm, 300);

    React.useEffect(() => {
        if (!debouncedSearch) {
            setResidents([]);
            return;
        }

        const fetchResidents = async () => {
            setLoading(true);
            try {
                const data = await residentsApi.getResidents({ keyword: debouncedSearch });
                setResidents(data);
            } catch (error) {
                console.error("Lỗi tìm cư dân:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResidents();
    }, [debouncedSearch]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"

                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-amber-50"
                >
                    {value ? value : "Nhập tên người nộp..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                {/* shouldFilter={false} để tắt filter mặc định của UI, vì ta filter bằng API Server */}
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Tìm theo tên hoặc CCCD..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Đang tìm...
                            </div>
                        )}

                        {!loading && residents.length === 0 && (
                            <CommandEmpty>Không tìm thấy cư dân nào.</CommandEmpty>
                        )}

                        <CommandGroup heading="Kết quả tìm kiếm">
                            {residents.map((resident) => (
                                <CommandItem
                                    key={resident.id}
                                    value={resident.hoTen}
                                    onSelect={() => {
                                        onChange(resident.hoTen, Number(resident.householdId));
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === resident.hoTen ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{resident.hoTen}</span>
                                        <span className="text-xs text-muted-foreground">
                                            CCCD: {resident.cccd || "N/A"} - Hộ khẩu ID: {resident.householdId}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}