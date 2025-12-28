"use client";

import { ChangePasswordForm } from "@/components/change-password";
import { UserManagementSection } from "@/components/manager-user-view";
import { Card, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
                <p className="text-muted-foreground">Quản lý thông tin tài khoản và bảo mật.</p>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-6">
                        <img
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover border-2 border-primary bg-slate-100"
                        />
                        <div className="space-y-1">
                            <div className="text-2xl font-semibold">{user.hoTen || user.username}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>@{user.username}</span>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-xs border border-blue-100">
                                    {user.vaiTro === 'to_truong' ? 'Tổ Trưởng' : 'Kế Toán'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <ChangePasswordForm />

            {user.vaiTro === 'to_truong' && (
                <UserManagementSection />
            )}
        </div>
    );
}