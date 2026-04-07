import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupContent
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { ChevronUp, Command, LayoutGrid, LogOut, MapIcon, PieChart, User, UserCircle } from "lucide-react"

const navItems = [
    {
        title: "Dashboard",
        url: "owner",
        icon: LayoutGrid,
        isActive: true, // Menandakan menu yang sedang dipilih
    },
    {
        title: "Maps",
        url: "owner/maps",
        icon: MapIcon,
    },
    {
        title: "Analytics",
        url: "owner/Analytics",
        icon: PieChart,
    },
    {
        title: "User",
        url: "owner/user",
        icon: UserCircle,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>

    )
}