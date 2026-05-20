import prisma from "@/lib/prisma"
import GlobalMapWrapper, { GlobalMapLand } from "./global-map-wrapper"

export default async function MapsPage() {
  // Fetch all lands with their plants and harvests
  const lands = await prisma.land.findMany({
    where: { isActive: true },
    include: {
      plants: {
        where: { status: 'active' } // Only count active plants for density
      },
      harvests: true
    }
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  // Use the last fully completed year if the current year is not over (not December)
  const targetYear = today.getMonth() === 11 ? currentYear : currentYear - 1;

  // Calculate metrics for each land
  const mapData: GlobalMapLand[] = lands.map(land => {
    const activePlantCount = land.plants.length;
    
    // Density: Trees per Hectare
    const areaInHa = land.areaSize / 10000;
    const density = areaInHa > 0 ? (activePlantCount / areaInHa) : 0;

    // Total Production: Sum of harvests for the target year
    const totalProduction = land.harvests
      .filter(h => new Date(h.harvestDate).getFullYear() === targetYear)
      .reduce((sum, h) => sum + h.totalWeight, 0);

    // Productivity: Kg per Tree (or Kg per Hectare if preferred, we use Kg/Tree based on previous cards)
    const productivity = activePlantCount > 0 ? (totalProduction / activePlantCount) : 0;

    return {
      id: land.id,
      name: land.landName,
      coordinates: land.coordinates,
      areaSize: land.areaSize,
      plantCount: activePlantCount,
      density,
      totalProduction,
      productivity
    };
  });

  return (
    <div className="size-full bg-background flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Peta Global</h1>
        <p className="text-muted-foreground text-sm">
          Pantau seluruh aset lahan Anda dalam satu peta terpadu. Gunakan opsi layer untuk menganalisis kepadatan dan produktivitas secara geografis.
        </p>
      </div>
      
      {/* Map Container */}
      <GlobalMapWrapper lands={mapData} />
    </div>
  )
}