"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/hooks/use-auth";


import {
    LogOut,
    Settings,
} from "lucide-react";

import { Banknote, Home } from "lucide-react";

// Menu items
const items = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Khoản thu", url: "/fees", icon: Banknote },
    { title: "Lịch sử thu phí", url: "/payments", icon: Banknote },
    { title: "Tài khoản", url: "/profile", icon: Settings },
]

export function KeToanSidebar() {
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
    }
    return (
        <Sidebar
            className="bg-primary-gradient text-white border-none w-64 min-h-screen"

            style={{
                "--sidebar": "transparent",
                "--sidebar-border": "transparent"
            } as React.CSSProperties}
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-bold text-white mb-4 px-4 pt-4">
                        Quản Lý Chung Cư
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-2 gap-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        size="lg"
                                        className="text-white/90 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto border-t border-white/10">
                <SidebarMenuButton onClick={handleLogout} className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span >Đăng xuất</span>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}