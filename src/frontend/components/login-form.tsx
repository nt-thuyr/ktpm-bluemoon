"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
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
            setError(err.message || "Đăng nhập thất bại");
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
                        Nhập email và mật khẩu để truy cập hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            {/* username */}
                            <div className="grid gap-2">
                                <Label htmlFor="username">Email/Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin@group4.com"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            {/* password */}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <a href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
                                    >
                                        Quên mật khẩu?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {/* Nut dang nhap */}
                            <Button type="submit"
                                className="w-full text-base font-medium px-4 py-2 rounded-lg shadow hover:opacity-90 transition">
                                Đăng nhập hệ thống
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