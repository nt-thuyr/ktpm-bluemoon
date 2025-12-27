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
import { MoreHorizontal, ShieldCheck, UserMinus } from "lucide-react";

interface Props {
    members: HouseholdMember[];
}

export function HouseholdMembersTable({ members }: Props) {
    return (
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
                                {/* Highlight Chủ hộ */}
                                {member.quanHe === "Chủ hộ" ? (
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
                                        <DropdownMenuItem>
                                            Sửa quan hệ
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            <UserMinus className="mr-2 h-4 w-4" /> Chuyển đi / Tách khẩu
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}