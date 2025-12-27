"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
// import { updateUser } from "@/lib/api/auth"
// import { toast } from "sonner"
import React from "react"

export default function ProfilePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(true)
    const [editMode, setEditMode] = React.useState({
        username: false,
        email: false
    })
    // sau lấy từ api (db backend)
    const [formData, setFormData] = React.useState({
        username: "Nguyễn Văn A (Demo)",  // Tên giả
        email: "demo@example.com",        // Email giả
        // Dùng ảnh placeholder online hoặc đường dẫn ảnh tĩnh của bạn
        avatar: "https://github.com/shadcn.png",
        role: "ADMIN"                     // Role giả
    })


    const [passwordData, setPasswordData] = React.useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = React.useState({
        currentPassword: "",
        confirmPassword: ""
    })

    // React.useEffect(() => {
    //     const userData = localStorage.getItem("User")
    //     if (!userData) {
    //         router.push("/auth")
    //         return
    //     }

    //     try {
    //         const parsedData = JSON.parse(userData)
    //         setFormData({
    //             username: parsedData.username,
    //             email: parsedData.email,
    //             avatar: parsedData.role === "ADMIN" ? "/avatars/admin.png" : "/avatars/staff.png",
    //             role: parsedData.role
    //         })
    //     } catch (error) {
    //         console.error("Error parsing user data:", error)
    //         router.push("/auth")
    //         return
    //     }

    //     setIsLoading(false)
    // }, [router])

    const handleEdit = (field: keyof typeof editMode) => {
        setEditMode(prev => ({ ...prev, [field]: true }))
    }

    const handleSave = (field: keyof typeof editMode) => {
        setEditMode(prev => ({ ...prev, [field]: false }))
    }

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }))
        // Clear errors when user types
        if (field === 'currentPassword') {
            setErrors(prev => ({ ...prev, currentPassword: "" }))
        }
        if (field === 'confirmPassword') {
            setErrors(prev => ({ ...prev, confirmPassword: "" }))
        }
    }

    const handleUpdateProfile = async () => {
        // Reset errors
        setErrors({
            currentPassword: "",
            confirmPassword: ""
        })

        // Get user data from localStorage
        const userData = localStorage.getItem("User")
        if (!userData) {
            router.push("/auth")
            return
        }

        try {
            const parsedData = JSON.parse(userData)

            // Only validate current password if new password is being set
            if (passwordData.newPassword) {
                // Validate current password
                if (passwordData.currentPassword !== parsedData.password) {
                    setErrors(prev => ({ ...prev, currentPassword: "Current password is incorrect" }))
                    return
                }

                // Validate new password match
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: "New passwords do not match" }))
                    return
                }
            }

            // Prepare update data
            const updateData = {
                username: formData.username,
                email: formData.email,
                password: passwordData.newPassword || parsedData.password // Keep old password if no new one
            }

            // Call API
            //   await updateUser(parsedData.id, updateData)

            // Update localStorage
            const updatedUserData = {
                ...parsedData,
                ...updateData
            }
            localStorage.setItem("User", JSON.stringify(updatedUserData))

            // toast.success("Profile updated successfully", {
            //     duration: 3000,
            // })

            // Reset password fields
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
        } catch (error) {
            console.error("Error updating profile:", error)
            //         //   toast.error("Failed to update profile", {
            //         duration: 3000,
            //   })
        }
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
                                src={formData.avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                            />
                            <div className="space-y-2">
                                {/* <div className="text-2xl font-semibold leading-tight">{formData.username}</div> */}
                                <div className="text-muted-foreground text-base">{formData.email}</div>
                                <div className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
                                    Role: {formData.role}
                                </div>
                            </div>
                        </div>
                        <CardTitle className="sr-only">Profile Information</CardTitle>
                        <CardDescription className="sr-only">
                            Update your profile information here
                        </CardDescription>
                        <div className="md:ml-auto">
                            <Button onClick={() => console.log("Save clicked")} className="gap-2">
                                <Save className="w-4 h-4" /> Lưu thay đổi
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 p-2 px-6">


                            <div className="space-y-2 md:col-span-2">
                                <Label>Email (Tài khoản đăng nhập)</Label>
                                <Input value={formData.email} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                                <p className="text-xs text-muted-foreground">Vui lòng liên hệ Admin để thay đổi email.</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    placeholder="Enter current password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
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



    //     const [showChangePassword, setShowChangePassword] = React.useState(false) // State để ẩn hiện mật khẩu

    //     return (
    //         <div className="flex flex-col gap-6 p-8 max-w-4xl mx-auto">
    //             <h1 className="text-3xl font-bold text-gray-800">Cài đặt tài khoản</h1>

    //             <Card className="shadow-sm">
    //                 <CardHeader className="pb-4">
    //                     <div className="flex flex-col md:flex-row items-center gap-6">
    //                         {/* Avatar có nút upload giả */}
    //                         <div className="relative group cursor-pointer">
    //                             <img
    //                                 src={formData.avatar}
    //                                 alt="Avatar"
    //                                 className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
    //                             />
    //                             <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    //                                 <Camera className="text-white w-6 h-6" />
    //                             </div>
    //                         </div>

    //                         <div className="text-center md:text-left space-y-1">
    //                             <h2 className="text-2xl font-bold">{formData.username}</h2>
    //                             <p className="text-muted-foreground">{formData.email}</p>
    //                             <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mt-2">
    //                                 {formData.role}
    //                             </span>
    //                         </div>

    //                         {/* Nút Save đưa lên trên cho tiện tay */}
    //                         <div className="md:ml-auto">
    //                             <Button onClick={() => console.log("Save clicked")} className="gap-2">
    //                                 <Save className="w-4 h-4" /> Lưu thay đổi
    //                             </Button>
    //                         </div>
    //                     </div>
    //                 </CardHeader>

    //                 <Separator className="mb-4" /> {/* Hoặc <hr className="my-4"/> */}

    //                 <CardContent className="space-y-6">
    //                     {/* Phần 1: Thông tin cá nhân */}
    //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //                         <div className="space-y-2">
    //                             <Label>Họ và tên hiển thị</Label>
    //                             <Input
    //                                 value={formData.username}
    //                                 onChange={(e) => setFormData({ ...formData, username: e.target.value })}
    //                             />
    //                         </div>


    //                     </div>

    //                     {/* Phần 2: Đổi mật khẩu (Ẩn/Hiện) */}
    //                     <div className="pt-4 border-t">
    //                         <div className="flex items-center justify-between mb-4">
    //                             <div>
    //                                 <h3 className="font-medium text-lg">Bảo mật</h3>
    //                                 <p className="text-sm text-muted-foreground">Quản lý mật khẩu và bảo mật tài khoản</p>
    //                             </div>
    //                             <div className="flex items-center gap-2">
    //                                 <Label htmlFor="change-pass" className="cursor-pointer">Đổi mật khẩu?</Label>
    //                                 <Switch
    //                                     id="change-pass"
    //                                     checked={showChangePassword}
    //                                     onCheckedChange={setShowChangePassword}
    //                                 />
    //                             </div>
    //                         </div>

    //                         {/* Hiệu ứng trượt xuống khi bật switch */}
    //                         {showChangePassword && (
    //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 fade-in duration-300">
    //                                 <div className="space-y-2 md:col-span-2">
    //                                     <Label>Mật khẩu hiện tại</Label>
    //                                     <Input type="password" placeholder="********" />
    //                                 </div>
    //                                 <div className="space-y-2">
    //                                     <Label>Mật khẩu mới</Label>
    //                                     <Input type="password" />
    //                                 </div>
    //                                 <div className="space-y-2">
    //                                     <Label>Xác nhận mật khẩu mới</Label>
    //                                     <Input type="password" />
    //                                 </div>
    //                             </div>
    //                         )}
    //                     </div>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     )
}
