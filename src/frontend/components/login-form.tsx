"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import component Alert
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react"; // Import thêm icon
import React, { useState } from "react";

export default function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(username, password);
        } catch (err: any) {
            setError("Tên đăng nhập hoặc mật khẩu không đúng.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="shadow-lg border-none sm:w-[360px]">
                <CardHeader className="text-center ">
                    <CardTitle className="text-xl font-bold text-primary">
                        Đăng nhập
                    </CardTitle>
                    <CardDescription>
                        Nhập username và mật khẩu để truy cập hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">

                            {error && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="ml-2 font-semibold text-sm">Lỗi đăng nhập</AlertTitle>
                                    <AlertDescription >
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {/* username */}
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    required
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError(null); // Xóa lỗi khi người dùng gõ lại
                                    }}
                                    className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                            </div>

                            {/* password */}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    required
                                    className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full text-base font-medium px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Đăng nhập hệ thống"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                Cần hỗ trợ kỹ thuật? <a href="#">Liên hệ IT</a>
            </div>
        </div>
    )
}