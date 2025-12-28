"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

import { useAuth } from "@/lib/hooks/use-auth";
import { UserPlus, Users } from "lucide-react";
import { UserCreateModal } from "./create-user";

export function UserManagementSection() {
    const { createUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async (formData: any) => {
        setIsCreating(true);
        await createUser(formData);
        setIsCreating(false);
    };

    return (
        <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Users className="h-5 w-5" /> Quản trị hệ thống
                </CardTitle>
                <CardDescription>
                    Chức năng dành riêng cho Tổ trưởng để quản lý nhân sự.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button onClick={() => setIsModalOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" /> Tạo tài khoản Kế toán
                </Button>

                {/* <Link href="/users">
                    <Button variant="outline" className="bg-white hover:bg-slate-100">
                        Xem danh sách người dùng <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link> */}

                {/* Modal Tạo User */}
                <UserCreateModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onSubmit={handleCreate}
                    isLoading={isCreating}
                />
            </CardContent>
        </Card>
    );
}