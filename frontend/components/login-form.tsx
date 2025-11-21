import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="shadow-xl sm:w-[360px]">
                <CardHeader className="text-center ">
                    <CardTitle className="text-xl font-bold text-primary">
                        Đăng nhập vào hệ thống
                    </CardTitle>
                    <CardDescription>
                        Nhập thông tin tài khoản
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid gap-6">
                            {/* email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@group4.com"
                                    required
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
                                    required
                                />
                            </div>

                            {/* Button */}
                            <Button type="submit"
                                className="w-full font-bold bg-[#003555] hover:scale-[1.02]"
                            >
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