"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { MandorSidebar } from "@/components/mandor-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <MandorSidebar />
            <main className="flex-1 overflow-y-auto min-h-screen bg-background">
                {children}
            </main>
        </SidebarProvider>
    )
}
