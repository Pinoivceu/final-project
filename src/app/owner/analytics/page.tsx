import prisma from "@/lib/prisma"
import { GlobalProductionChart } from "./global-production-chart"
import { GlobalProductionTable } from "./global-production-table"

export default async function AnalyticsPage() {
  const harvests = await prisma.harvest.findMany({
    orderBy: {
      harvestDate: 'desc'
    },
    include: {
      land: {
        select: {
          landName: true,
          mandor: {
            select: {
              fullName: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Pusat kendali data. Pantau tren produksi dari seluruh lahan Anda secara terpusat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlobalProductionChart data={harvests as any} />
        <GlobalProductionTable data={harvests as any} />
      </div>
    </div>
  )
}