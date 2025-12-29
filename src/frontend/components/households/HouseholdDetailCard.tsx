"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { HouseholdMember } from "@/lib/types/models/household";
import { Resident } from "@/lib/types/models/resident";
import { MoreHorizontal, ShieldCheck, UserMinus, Users } from "lucide-react";
import { useState } from "react";
import { DeleteResidentDialog } from "../residents/DeleteResidentDialog";
import { EditResidentDialog } from "../residents/EditResidentDialog";

interface Props {
    members: HouseholdMember[];
    householdOptions?:  { value: string; label: string }[];
    onUpdateMember?: (id: string, data: Partial<Resident>) => void;
    onRemoveMember?: (id: string) => void;
}

export function HouseholdMembersTable({ 
    members, 
    householdOptions = [],
    onUpdateMember,
    onRemoveMember 
}: Props) {
    const [editingMember, setEditingMember] = useState<Resident | null>(null);
    const [removingMember, setRemovingMember] = useState<Resident | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);

    // ✅ Mapper:  HouseholdMember → Resident
    const toResident = (member: HouseholdMember): Resident => ({
        id: member.id,
        hoTen: member.hoTen,
        cccd: member.cccd || null,
        quanHeVoiChuHo: member.quanHe || "Thành viên",
        hoKhauId: null,
        ngaySinh: null,
        gioiTinh: "",
        ngheNghiep: null,
        danToc: "",
        tonGiao: "",
        ngayCap: null,
        noiCap: "",
        ghiChu: "",
        ngayThemNhanKhau: null,
    });

    const handleEditClick = (member: HouseholdMember) => {
        setEditingMember(toResident(member));
        setIsEditOpen(true);
    };

    const handleRemoveClick = (member: HouseholdMember) => {
        setRemovingMember(toResident(member));
        setIsRemoveOpen(true);
    };

    const handleEditConfirm = (id: string, data: Partial<Resident>) => {
        if (onUpdateMember) {
            onUpdateMember(id, data);
        }
    };

    const handleRemoveConfirm = () => {
        if (removingMember && onRemoveMember) {
            onRemoveMember(String(removingMember.id));
            setIsRemoveOpen(false);
        }
    };

    return (
        <>
            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>CCCD</TableHead>
                            <TableHead>Quan hệ với chủ hộ</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.hoTen}</TableCell>
                                <TableCell>{member.cccd || "--"}</TableCell>
                                <TableCell>
                                    {member.quanHe === "Chủ hộ" ?  (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                                            <ShieldCheck className="w-3 h-3 mr-1" /> Chủ hộ
                                        </Badge>
                                    ) : (
                                        <span className="text-slate-600">{member.quanHe}</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditClick(member)}>
                                                <Users className="mr-2 h-4 w-4" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-red-600"
                                                onClick={() => handleRemoveClick(member)}
                                            >
                                                <UserMinus className="mr-2 h-4 w-4" /> 
                                                Chuyển đi
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ✅ Tái sử dụng 2 dialog của Resident */}
            <EditResidentDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                resident={editingMember}
                householdOptions={householdOptions}
                onSave={handleEditConfirm}
            />

            <DeleteResidentDialog
                open={isRemoveOpen}
                onOpenChange={setIsRemoveOpen}
                resident={removingMember}
                onConfirm={handleRemoveConfirm}
            />
        </>
    );
}