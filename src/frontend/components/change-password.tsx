"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { AlertCircle, CheckCircle2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function ChangePasswordForm() {
    const { changePassword } = useAuth();

    const [data, setData] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false); // ✅ Thêm state success

    const handleSubmit = async () => {
        setError(null);
        setSuccess(false); // ✅ Reset success khi submit lại
        
        if (!data.current) {
            setError("Vui lòng nhập mật khẩu hiện tại.");
            return;
        }
        if (!data.new) {
            setError("Vui lòng nhập mật khẩu mới.");
            return;
        }
        if (data.new.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        if (data.new !== data.confirm) {
            setError("Mật khẩu xác nhận không trùng khớp.");
            return;
        }
        if (data.current === data.new) {
            setError("Mật khẩu mới không được trùng với mật khẩu cũ.");
            return;
        }
        
        setLoading(true);
        const isSuccess = await changePassword(data. current, data.new);
        setLoading(false);

        if (isSuccess) {
            setData({ current: "", new:  "", confirm: "" });
            setSuccess(true); // ✅ Hiển thị thông báo thành công
        } else {
            setError("Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.");
        }
    };

    const handleChange = (field:  keyof typeof data, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
        if (success) setSuccess(false); // ✅ Ẩn thông báo success khi gõ
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LockKeyhole className="h-5 w-5" /> Đổi mật khẩu
                </CardTitle>
                <CardDescription>Cập nhật mật khẩu định kỳ để bảo vệ tài khoản.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
                {/* ✅ Thông báo thành công */}
                {success && (
                    <Alert className="border-green-500 bg-green-50 text-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Thành công!</AlertTitle>
                        <AlertDescription className="text-green-700">
                            Mật khẩu của bạn đã được cập nhật thành công. 
                        </AlertDescription>
                    </Alert>
                )}

                {/* Thông báo lỗi */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label>Mật khẩu hiện tại</Label>
                    <Input
                        type="password"
                        placeholder="••••••"
                        value={data.current}
                        onChange={e => handleChange("current", e.target.value)}
                        className={error && !data.current ? "border-red-500" : ""}
                    />
                </div>
                
                <div className="space-y-2">
                    <Label>Mật khẩu mới</Label>
                    <Input
                        type="password"
                        placeholder="••••••"
                        value={data.new}
                        onChange={e => handleChange("new", e.target.value)}
                    />
                </div>
                
                <div className="space-y-2">
                    <Label>Xác nhận mật khẩu mới</Label>
                    <Input
                        type="password"
                        placeholder="••••••"
                        value={data.confirm}
                        onChange={e => handleChange("confirm", e.target. value)}
                        className={error && data.new !== data.confirm ? "border-red-500" : ""}
                    />
                </div>

                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Lưu mật khẩu mới"}
                </Button>
            </CardContent>
        </Card>
    );
}