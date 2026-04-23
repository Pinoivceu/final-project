"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LayoutGrid, LogOut, MapIcon, PieChart, UserCircle } from "lucide-react"
import { logout } from "@/app/owner/action"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
    {
        title: "Dashboard",
        url: "/owner/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Maps",
        url: "/owner/maps",
        icon: MapIcon,
    },
    {
        title: "Analytics",
        url: "/owner/analytics",
        icon: PieChart,
    },
    {
        title: "User Management",
        url: "/owner/users",
        icon: UserCircle,
    },
];

export function AppSidebar() {
    const pathname = usePathname()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    async function handleLogout() {
        setIsLoggingOut(true)
        await logout()
    }

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="flex flex-row items-center justify-between px-2 py-2">
                <SidebarTrigger />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const active = pathname === item.url || pathname.startsWith(`${item.url}/`)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton isActive={active} render={
                                            <Link href={item.url}>
                                                <item.icon className="h-5 w-5" />
                                                <span className="font-semibold text-sm">{item.title}</span>
                                            </Link>
                                        } />
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-2 flex flex-col gap-1 border-t">
                <div className="flex items-center justify-between px-1 py-1">
                    <span className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">Tema</span>
                    <ThemeToggle />
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <SidebarMenuButton className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="h-5 w-5" />
                            <span className="font-semibold text-sm">Keluar</span>
                        </SidebarMenuButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                            <AlertDialogDescription>
                                Anda akan keluar dari sesi ini. Pastikan semua perubahan sudah tersimpan sebelum melanjutkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                {isLoggingOut ? "Keluar..." : "Ya, Keluar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarFooter>
        </Sidebar>
    )
}