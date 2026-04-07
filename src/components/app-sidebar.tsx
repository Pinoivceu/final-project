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
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                                    <Command className="size-5 text-white" />
                                </div>

                                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                                    <span className="truncate font-bold text-2xl">My App</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.isActive}
                                        className="py-6" // Memberikan sedikit padding agar lebih mirip desain
                                    >
                                        <a href={item.url}>
                                            <item.icon className="size-5" strokeWidth={2} />
                                            <span className="font-bold text-sm">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>


            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="Pino" />
                                        <AvatarFallback className="rounded-lg">PI</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Pino</span>
                                        <span className="truncate text-xs">Pino@example.com</span>
                                    </div>
                                    <ChevronUp className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                align="start"
                                sideOffset={4}
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 size-4" />
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => console.log("Logout clicked")}
                                >
                                    <LogOut className="mr-2 size-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}