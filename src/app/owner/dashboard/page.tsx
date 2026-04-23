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
    }
  })
  


const mandors = await prisma.user.findMany({
    where: {
      role: "mandor"
    },
    select: {
      id: true,
      fullName: true,
    }
  })

  const plants = await prisma.plant.findMany()
  const harvests = await prisma.harvest.findMany()

  const totalArea = fieldData.reduce((sum, f) => sum + f.areaSize, 0);
  const activePlantsCount = plants.filter(p => p.status === 'active').length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalProductionThisMonth = harvests.filter(h => {
    const d = new Date(h.harvestDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum, h) => sum + h.totalWeight, 0);

  const plantDensity = totalArea > 0 ? (activePlantsCount / totalArea).toFixed(0) : "0";

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const yearOfLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;

  const totalProductionLastMonth = harvests.filter(h => {
    const d = new Date(h.harvestDate);
    return d.getMonth() === lastMonth && d.getFullYear() === yearOfLastMonth;
  }).reduce((sum, h) => sum + h.totalWeight, 0);

  let productionGrowth = 0;
  if (totalProductionLastMonth > 0) {
    productionGrowth = ((totalProductionThisMonth - totalProductionLastMonth) / totalProductionLastMonth) * 100;
  } else if (totalProductionThisMonth > 0) {
    productionGrowth = 100;
  }
  
  const productionGrowthText = productionGrowth > 0 ? `+${productionGrowth.toFixed(1)}%` : `${productionGrowth.toFixed(1)}%`;

  const avgProductivity = activePlantsCount > 0 
    ? (totalProductionThisMonth / activePlantsCount).toFixed(2) 
    : "0";

  const dynamicStats = [
    { id: 1, label: "Total Luas Lahan", value: totalArea.toFixed(1), unit: "Ha", iconEmoji: "🗺️" },
    { id: 2, label: "Tanaman Aktif", value: activePlantsCount, unit: "Pohon", iconEmoji: "🌳" },
    { id: 3, label: "Panen Bulan Ini", value: totalProductionThisMonth, unit: "Kg", iconEmoji: "⚖️" },
    { id: 4, label: "Kepadatan Lahan", value: plantDensity, unit: "Phn/Ha", iconEmoji: "🌱" },
    { id: 5, label: "Pertumbuhan Panen", value: productionGrowthText, unit: "", iconEmoji: productionGrowth >= 0 ? "📈" : "📉" },
    { id: 6, label: "Rata-rata Produktivitas", value: avgProductivity, unit: "Kg/Phn", iconEmoji: "📊" },
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
            />
          ))}
        </div>
      </div>

    </div>
  )
}



