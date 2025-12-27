"use client"
import { KeToanSidebar } from "@/components/ketoan-sidebar"
import { QuanLySidebar } from "@/components/totruong-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth")
        }
    }, [user, isLoading, router])
    if (isLoading) return null
    if (!user) return null
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-50">
                {user.vai_tro === "ke_toan" && <KeToanSidebar />}
                {user.vai_tro === "to_truong" && <QuanLySidebar />}

                <main className="flex-1 w-full">
                    <header className="flex h-14 items-center border-b bg-white px-4 shadow-sm">
                        <SidebarTrigger />
                        <span className="ml-4 font-semibold text-slate-700">Hệ thống quản trị</span>
                    </header>

                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}