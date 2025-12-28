"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { AlertCircle, LockKeyhole } from "lucide-react";
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

    const handleSubmit = async () => {
        setError(null);
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
        const success = await changePassword(data.current, data.new);
        setLoading(false);

        if (success) {
            setData({ current: "", new: "", confirm: "" });
        }
        else {
            setError("Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.");
        }
    };
    const handleChange = (field: keyof typeof data, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null); // Xóa lỗi ngay khi gõ
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
                        onChange={e => handleChange("confirm", e.target.value)}
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