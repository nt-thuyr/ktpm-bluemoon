"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/use-auth"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"
// import { updateUser } from "@/lib/api/auth"
// import { toast } from "sonner"
import React, { useEffect } from "react"
import { toast } from "sonner"

export default function ProfilePage() {
    const router = useRouter()

    const { user, changePassword, isLoading } = useAuth();

    const [passwordData, setPasswordData] = React.useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = React.useState({
        currentPassword: "",
        confirmPassword: ""
    })

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }))
        // Xóa lỗi khi người dùng bắt đầu gõ lại
        if (field === 'currentPassword') setErrors(prev => ({ ...prev, currentPassword: "" }))
        if (field === 'confirmPassword') setErrors(prev => ({ ...prev, confirmPassword: "" }))
    }

    const handleUpdateProfile = async () => {
        // Reset lỗi cũ
        setErrors({ currentPassword: "", confirmPassword: "" });

        // Validate Client-side
        if (!passwordData.currentPassword) {
            setErrors(prev => ({ ...prev, currentPassword: "Vui lòng nhập mật khẩu hiện tại" }));
            return;
        }

        if (!passwordData.newPassword) {
            toast.error("Vui lòng nhập mật khẩu mới");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: "Mật khẩu xác nhận không khớp" }));
            return;
        }

        // Gọi API
        setIsSubmitting(true);
        const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        setIsSubmitting(false);

        if (success) {
            // Reset form nếu thành công
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        }
    }

    if (isLoading || !user) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
    }
    return (
        <div className="flex flex-col gap-4 py-6 md:gap-6 px-12">
            <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold">Quản lý tài khoản</h1>
            </div>

            <div className="space-y-6 px-10">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-6 px-6 pt-4">
                            <img
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-2 border-primary bg-slate-100"
                            />
                            <div className="space-y-2 text-center md:text-left">
                                <div className="text-2xl font-semibold leading-tight">{user.username}</div>
                                <div className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary w-fit mx-auto md:mx-0">
                                    Vai trò: {user.vai_tro === 'to_truong' ? 'Tổ Trưởng' : 'Kế Toán'}
                                </div>
                            </div>

                        </div>
                        <CardTitle className="sr-only">Profile Information</CardTitle>
                        <CardDescription className="sr-only">
                            Update your profile information here
                        </CardDescription>
                        <div className="md:ml-auto">
                            <Button onClick={handleUpdateProfile} disabled={isSubmitting} className="gap-2">
                                <Save className="w-4 h-4" /> Lưu thay đổi
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 p-2 px-6">

                            <div className="space-y-2 md:col-span-2">
                                <Label>Username (Tài khoản đăng nhập)</Label>
                                <Input value={user.username} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                                <p className="text-xs text-muted-foreground">Vui lòng liên hệ Admin để thay đổi ten.</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    placeholder="Enter current password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                    className={errors.currentPassword ? "border-red-500" : ""}
                                />
                                {errors.currentPassword && (
                                    <p className="text-sm text-red-500">{errors.currentPassword}</p>
                                )}
                            </div>
                            <hr></hr>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}