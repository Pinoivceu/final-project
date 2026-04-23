import prisma from "@/lib/prisma"
import GlobalProductionChart, { AggregatedHarvest } from "./global-production-chart"
import GlobalProductionTable from "./global-production-table"

export default async function AnalyticsPage() {
  const harvests = await prisma.harvest.findMany({
    orderBy: {
      harvestDate: 'asc'
    }
  });

  // Aggregate harvests by month-year
  const aggregatedMap = new Map<string, number>();

  harvests.forEach(harvest => {
    const date = new Date(harvest.harvestDate);
    const month = date.toLocaleString('id-ID', { month: 'short' }); // "Jan", "Feb"
    const year = date.getFullYear();
    const sortKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`; // "2024-01"

    const currentTotal = aggregatedMap.get(sortKey) || 0;
    aggregatedMap.set(sortKey, currentTotal + harvest.totalWeight);
  });

  // Convert map to array format expected by components
  const data: AggregatedHarvest[] = Array.from(aggregatedMap.entries()).map(([sortKey, totalWeight]) => {
    const [year, monthNum] = sortKey.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    const period = `${date.toLocaleString('id-ID', { month: 'short' })} ${year}`;
    return {
      period,
      sortKey,
      totalWeight: Math.round(totalWeight * 10) / 10 // Round to 1 decimal place
    };
  });

  return (
    <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Pusat kendali data. Pantau tren produksi dari seluruh lahan Anda secara terpusat.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlobalProductionChart data={data} />
        <GlobalProductionTable data={data} />
      </div>
    </div>
  )
}