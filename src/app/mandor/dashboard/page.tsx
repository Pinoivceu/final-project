import prisma from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import { formatAreaDisplay } from "@/lib/definitions"
import SummaryCard from "@/components/summaryCard"
import { CalendarClock } from "lucide-react"
import { DashboardTasks } from "./dashboard-tasks"



export default async function MandorDashboard() {
    // Get the current mandor's userId from session
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const payload = await decrypt(sessionToken)
    const mandorId = payload?.userId as string

    // Fetch mandor's profile and assigned land
    const mandor = await prisma.user.findUnique({
        where: { id: mandorId },
        select: { fullName: true, }
    })

    const land = await prisma.land.findFirst({
        where: { mandorId },
        include: {
            plants: { select: { id: true, status: true } },
            harvests: { select: { totalWeight: true, harvestDate: true } },
        }
    })

    // Fetch active (non-completed) tasks for this mandor sorted by urgency
    const tasks = await prisma.task.findMany({
        where: {
            mandorId,
            status: { not: "completed" }
        },
        include: {
            land: { select: { landName: true } }
        },
        orderBy: [
            { dueDate: "asc" },
            { createdAt: "asc" }
        ],
        take: 10,
    })

    // Calculate land stats
    const activePlants = land?.plants.filter(p => p.status === "active").length ?? 0
    const totalPlants = land?.plants.length ?? 0

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const harvestThisMonth = (land?.harvests ?? [])
        .filter(h => {
            const d = new Date(h.harvestDate)
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear
        })
        .reduce((sum, h) => sum + h.totalWeight, 0)

    const totalHarvest = (land?.harvests ?? []).reduce((sum, h) => sum + h.totalWeight, 0)

    const pendingCount = tasks.filter(t => t.status === "pending").length
    const inProgressCount = tasks.filter(t => t.status === "in_progress").length
    const onApprovalCount = tasks.filter(t => t.status === "on_approval").length

    const summaryStats = [
        {
            id: 1,
            label: "Luas Lahan",
            value: land ? formatAreaDisplay(land.areaSize) : "-",
            unit: "",
            iconEmoji: "🗺️"
        },
        {
            id: 2,
            label: "Tanaman Aktif",
            value: activePlants,
            unit: `/ ${totalPlants} Pohon`,
            iconEmoji: "🌳"
        },
        {
            id: 3,
            label: "Panen Bulan Ini",
            value: harvestThisMonth.toLocaleString("id-ID"),
            unit: "Kg",
            iconEmoji: "⚖️"
        },
        {
            id: 4,
            label: "Total Panen",
            value: totalHarvest.toLocaleString("id-ID"),
            unit: "Kg",
            iconEmoji: "📦"
        },
        {
            id: 5,
            label: "Tugas Tertunda",
            value: pendingCount,
            unit: "Tugas",
            iconEmoji: "📋"
        },
        {
            id: 6,
            label: "Menunggu Approval",
            value: onApprovalCount,
            unit: "Tugas",
            iconEmoji: "✅"
        },
    ]

    // Greet based on hour
    const hour = new Date().getHours()
    const greeting =
        hour < 11 ? "Selamat Pagi" :
            hour < 15 ? "Selamat Siang" :
                hour < 18 ? "Selamat Sore" : "Selamat Malam"

    return (
        <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">{greeting} 👋</p>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {mandor?.fullName ?? "Mandor"}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {land
                        ? `Anda mengelola lahan "${land.landName}"`
                        : "Belum ada lahan yang ditugaskan."}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground">Ringkasan Lahan</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {summaryStats.map((item) => (
                        <SummaryCard key={item.id} {...item} />
                    ))}
                </div>
            </div>

            {/* Task Priority Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <CalendarClock className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Tugas Mendatang</h2>
                </div>
                <DashboardTasks tasks={tasks as any} />
            </div>

        </div>
    )
}
