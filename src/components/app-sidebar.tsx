import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import Link from "next/link"
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
    SidebarGroupLabel
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { ChevronUp, Command, LayoutGrid, LogOut, MapIcon, PieChart, User, UserCircle } from "lucide-react"

const navItems = [
    {
        title: "Dashboard",
        url: "/owner/dashboard",
        icon: LayoutGrid,
        isActive: true, // Menandakan menu yang sedang dipilih
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
    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>

                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const active = pathname === item.url || pathname.startsWith(`${(item.url)}/`)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton isActive={active} render={<Link href={item.url}>
                                            <item.icon className="h-6 w-6" />
                                            <span className="font-bold text-xs">{item.title}</span>
                                        </Link>}>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}