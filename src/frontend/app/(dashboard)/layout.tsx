import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-50">
                <AppSidebar />
                <main className="flex-1 w-full">
                    {/* Header nhỏ bên trên nội dung */}
                    <header className="flex h-14 items-center border-b bg-white px-4 shadow-sm">
                        <SidebarTrigger />
                        <span className="ml-4 font-semibold text-slate-700">Hệ thống quản trị</span>
                    </header>

                    {/* Nội dung chính của từng trang sẽ hiện ở đây */}
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}