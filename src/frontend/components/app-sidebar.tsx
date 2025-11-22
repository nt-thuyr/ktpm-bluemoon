"use client"

import {
    LogOut,
    Settings,
    Users
} from "lucide-react";

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
import { Banknote, Home } from "lucide-react";

// Menu items
const items = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Cư dân", url: "/residents", icon: Users },
    { title: "Thu phí", url: "/fees", icon: Banknote },
    { title: "Cài đặt", url: "/settings", icon: Settings },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-bold text-blue-700 px-4 py-4">
                        Quản Lý Chung Cư
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild size="lg" className="hover:bg-blue-50 hover:text-blue-700">
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

            {/* Phần chân trang của Sidebar (Nút đăng xuất) */}
            <SidebarFooter className="p-4 border-t">
                <SidebarMenuButton className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}