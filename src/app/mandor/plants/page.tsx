import prisma from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import { Sprout } from "lucide-react"
import { PlantMap } from "./plant-map"
import { PlantsTable } from "./plants-table"


export default async function MandorPlantsPage() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const payload = await decrypt(sessionToken)
    const mandorId = payload?.userId as string

    // Fetch the land assigned to this mandor
    const land = await prisma.land.findFirst({
        where: { mandorId },
        select: { id: true, landName: true, areaSize: true, coordinates: true },
    })

    // Fetch all plants on this land
    const plants = land
        ? await prisma.plant.findMany({
            where: { landId: land.id },
            orderBy: { createdAt: "desc" },
        })
        : []



    return (
        <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Sprout className="size-7 text-foreground" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Tanaman</h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    {land
                        ? `Lahan: ${land.landName} — ${plants.length} tanaman terdaftar`
                        : "Belum ada lahan yang ditugaskan."}
                </p>
            </div>



            {/* Map */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-foreground">Distribusi Tanaman</h2>
                <PlantMap plants={plants as any} land={land as any} />
            </div>

            {/* Table */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-foreground">Daftar Tanaman</h2>
                {land ? (
                    <PlantsTable data={plants as any} landId={land.id} />
                ) : (
                    <p className="text-sm text-muted-foreground">Tidak ada lahan untuk ditampilkan.</p>
                )}
            </div>

        </div>
    )
}
