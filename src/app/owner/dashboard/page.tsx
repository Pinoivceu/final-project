import SummaryCard from "@/components/summaryCard";
import FieldsCard from "@/app/owner/dashboard/fields-card";
import { LahanAddForm } from "./add-land-fom";
import { Button } from "@/components/ui/button";
import { formatAreaDisplay } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function OwnerHome() {

  const fieldData = await prisma.land.findMany({
    include: {
      mandor: {
        select: {
          fullName: true
        }
      }
    },
    orderBy: [
      { isActive: 'desc' },
      { createdAt: 'desc' }
    ]
  })
  


const mandors = await prisma.user.findMany({
    where: {
      role: "mandor",
      status: "active",
      lands: { none: {} } // Only mandors without assigned lands
    },
    select: {
      id: true,
      fullName: true,
    }
  })

  const plants = await prisma.plant.findMany()
  const harvests = await prisma.harvest.findMany()

  const totalArea = fieldData.filter(f => f.isActive).reduce((sum, f) => sum + f.areaSize, 0);
  const totalAreaHa = totalArea / 10000;
  const activePlantsCount = plants.filter(p => p.status === 'active').length;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;
  const twoYearsAgo = currentYear - 2;

  const getYearlyProduction = (year: number) => harvests
    .filter(h => new Date(h.harvestDate).getFullYear() === year)
    .reduce((sum, h) => sum + h.totalWeight, 0);

  const totalProductionThisYear = getYearlyProduction(currentYear);
  const totalProductionLastYear = getYearlyProduction(lastYear);
  const totalProductionTwoYearsAgo = getYearlyProduction(twoYearsAgo);

  const plantDensity = totalAreaHa > 0 ? (activePlantsCount / totalAreaHa).toFixed(0) : "0";

  // If we are not in December, the current year is incomplete.
  // Comparing incomplete year data creates an artificial drop.
  const isYearEnded = today.getMonth() === 11;

  const growthCurrent = isYearEnded ? totalProductionThisYear : totalProductionLastYear;
  const growthPrevious = isYearEnded ? totalProductionLastYear : totalProductionTwoYearsAgo;

  let productionGrowth = 0;
  if (growthPrevious > 0) {
    productionGrowth = ((growthCurrent - growthPrevious) / growthPrevious) * 100;
  } else if (growthCurrent > 0) {
    productionGrowth = 100;
  }
  
  const productionGrowthText = productionGrowth > 0 ? `+${productionGrowth.toFixed(1)}%` : `${productionGrowth.toFixed(1)}%`;
  const growthLabel = isYearEnded 
    ? `Pertumbuhan (${lastYear}-${currentYear})`
    : `Pertumbuhan (${twoYearsAgo}-${lastYear})`;

  const productivityProduction = isYearEnded ? totalProductionThisYear : totalProductionLastYear;
  const productivityLabel = isYearEnded 
    ? `Produktivitas (${currentYear})`
    : `Produktivitas (${lastYear})`;

  const avgProductivity = activePlantsCount > 0 
    ? (productivityProduction / activePlantsCount).toFixed(2) 
    : "0";

  const [totalAreaValue, totalAreaUnit] = formatAreaDisplay(totalArea).split(" ");

  const dynamicStats = [
    { id: 1, label: "Total Luas Lahan", value: totalAreaValue, unit: totalAreaUnit, iconEmoji: "🗺️" },
    { id: 2, label: "Tanaman Aktif", value: activePlantsCount, unit: "Pohon", iconEmoji: "🌳" },
    { id: 3, label: `Panen (${currentYear})`, value: totalProductionThisYear.toFixed(1), unit: "Kg", iconEmoji: "⚖️" },
    { id: 4, label: "Kepadatan Lahan", value: plantDensity, unit: "Phn/Ha", iconEmoji: "🌱" },
    { id: 5, label: growthLabel, value: productionGrowthText, unit: "", iconEmoji: productionGrowth >= 0 ? "📈" : "📉" },
    { id: 6, label: productivityLabel, value: avgProductivity, unit: "Kg/Phn", iconEmoji: "📊" },
  ];

  return (
    <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Ringkasan performa seluruh lahan perkebunan Anda.</p>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Ringkasan Global</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dynamicStats.map((item) => (
            <SummaryCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* Fields Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Lahan Saya</h2>
            <p className="text-sm text-muted-foreground">{fieldData.length} lahan terdaftar</p>
          </div>
          <Dialog>
            <DialogTrigger render={<Button size="sm">+ Tambah Lahan</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Lahan Baru</DialogTitle>
                <DialogDescription>
                  Lengkapi data di bawah untuk mendaftarkan lahan baru.
                </DialogDescription>
              </DialogHeader>
              <LahanAddForm mandors={mandors} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Land Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fieldData.map((field) => (
            <FieldsCard
              id={field.id}
              key={field.id}
              image={field.image || "/default-kebun.jpg"}
              name={field.landName}
              area={formatAreaDisplay(field.areaSize)}
              foreman={field.mandor?.fullName || "No Mandor"}
              isActive={field.isActive}
            />
          ))}
        </div>
      </div>

    </div>
  )
}



