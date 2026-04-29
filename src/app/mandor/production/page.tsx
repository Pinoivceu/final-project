import prisma from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import { Scale } from "lucide-react"
import { ProductionLineChart } from "./production-chart"
import { ProductionTable } from "./production-table"
import SummaryCard from "@/components/summaryCard"

export default async function MandorProductionPage() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const payload = await decrypt(sessionToken)
    const mandorId = payload?.userId as string

    // Fetch the land assigned to this mandor
    const land = await prisma.land.findFirst({
        where: { mandorId },
        select: { id: true, landName: true },
    })

    // Fetch all harvest records for this land
    const harvests = land
        ? await prisma.harvest.findMany({
            where: { landId: land.id },
            orderBy: { harvestDate: "desc" },
        })
        : []

    // Stats calculations
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const totalAll = harvests.reduce((s, h) => s + h.totalWeight, 0)

    const thisMonthHarvests = harvests.filter((h) => {
        const d = new Date(h.harvestDate)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    const totalThisMonth = thisMonthHarvests.reduce((s, h) => s + h.totalWeight, 0)

    const lastMonthHarvests = harvests.filter((h) => {
        const d = new Date(h.harvestDate)
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })
    const totalLastMonth = lastMonthHarvests.reduce((s, h) => s + h.totalWeight, 0)

    const avgPerHarvest = harvests.length > 0 ? (totalAll / harvests.length) : 0

    const summaryStats = [
        { id: 1, label: "Total Produksi",     value: totalAll.toFixed(1),          unit: "Kg", iconEmoji: "⚖️" },
        { id: 2, label: "Panen Bulan Ini",    value: totalThisMonth.toFixed(1),    unit: "Kg", iconEmoji: "🌾" },
        { id: 3, label: "Panen Bulan Lalu",   value: totalLastMonth.toFixed(1),    unit: "Kg", iconEmoji: "📅" },
        { id: 4, label: "Rata-rata per Panen", value: avgPerHarvest.toFixed(1),    unit: "Kg", iconEmoji: "📊" },
    ]

    return (
        <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Scale className="size-7 text-foreground" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Produksi</h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    {land
                        ? `Lahan: ${land.landName} — ${harvests.length} entri panen tercatat`
                        : "Belum ada lahan yang ditugaskan."}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryStats.map((s) => (
                    <SummaryCard key={s.id} {...s} />
                ))}
            </div>

            {/* Line Chart */}
            <ProductionLineChart data={harvests as any} />

            {/* Table */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-foreground">Riwayat Panen</h2>
                {land ? (
                    <ProductionTable data={harvests as any} landId={land.id} />
                ) : (
                    <p className="text-sm text-muted-foreground">Tidak ada lahan untuk ditampilkan.</p>
                )}
            </div>

        </div>
    )
}
