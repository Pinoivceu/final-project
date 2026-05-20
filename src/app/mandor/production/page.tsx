import prisma from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import { Scale } from "lucide-react"
import { ProductionLineChart } from "./production-chart"
import { ProductionTable } from "./production-table"


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
