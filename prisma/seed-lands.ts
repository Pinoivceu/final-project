import { PrismaClient } from "../client/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

// Helper to generate a random point within a radius (in km)
function getRandomLocation(centerLat: number, centerLng: number, radiusKm: number) {
  const radiusInDegrees = radiusKm / 111.32;
  const w = radiusInDegrees * Math.sqrt(Math.random());
  const t = 2 * Math.PI * Math.random();
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  // Adjust longitude for latitude
  const newLng = x / Math.cos(centerLat * (Math.PI / 180));
  
  return {
    lat: centerLat + y,
    lng: centerLng + newLng
  };
}

async function main() {
  console.log("Starting seeding process...");
  
  // Find a mandor
  const mandors = await prisma.user.findMany({
    where: { role: 'mandor' }
  });
  
  if (mandors.length === 0) {
    throw new Error("No mandor found in the database. Please create one first.");
  }

  const mandor = mandors[0]; // Just pick the first one
  console.log(`Using Mandor: ${mandor.fullName} (ID: ${mandor.id})`);

  const centerLat = -3.725777953391052;
  const centerLng = 102.61504141426805;

  for (let i = 1; i <= 3; i++) {
    console.log(`\nCreating Lahan ${i}...`);
    
    // Generate a random center for this 1 hectare land within 10km
    const landCenter = getRandomLocation(centerLat, centerLng, 10);
    
    // 1 Hectare = 10,000 sqm. Let's make it a 100m x 100m square.
    // 100m in degrees
    const degLat100m = 100 / 111320; 
    const degLng100m = 100 / (111320 * Math.cos(landCenter.lat * (Math.PI / 180)));
    
    const halfLat = degLat100m / 2;
    const halfLng = degLng100m / 2;

    const coordinates = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [landCenter.lng - halfLng, landCenter.lat - halfLat], // Bottom-Left
            [landCenter.lng + halfLng, landCenter.lat - halfLat], // Bottom-Right
            [landCenter.lng + halfLng, landCenter.lat + halfLat], // Top-Right
            [landCenter.lng - halfLng, landCenter.lat + halfLat], // Top-Left
            [landCenter.lng - halfLng, landCenter.lat - halfLat]  // Back to start
          ]
        ]
      },
      properties: {}
    };

    // Create the Land
    const land = await prisma.land.create({
      data: {
        landName: `Lahan Kopi Robusta ${i}`,
        areaSize: 1.0, // 1 Hectare
        locationAddress: `Bengkulu Area ${i}`,
        coordinates: coordinates,
        mandorId: mandor.id
      }
    });

    console.log(`Created Land: ${land.landName} (ID: ${land.id})`);

    // Create 1500 Plants in a 2.5m x 2.5m grid
    // 100m / 2.5m = 40 rows and 40 cols = 1600 max spots. We take the first 1500.
    const plantsData = [];
    
    const latStep = degLat100m / 40;
    const lngStep = degLng100m / 40;
    
    let count = 0;
    const startLat = landCenter.lat - halfLat;
    const startLng = landCenter.lng - halfLng;

    for (let row = 0; row < 40; row++) {
      for (let col = 0; col < 40; col++) {
        if (count >= 1500) break;
        
        // Add a tiny bit of random noise so they aren't in perfectly straight robot lines
        const noiseLat = (Math.random() - 0.5) * (latStep * 0.2);
        const noiseLng = (Math.random() - 0.5) * (lngStep * 0.2);

        const plantLat = startLat + (row * latStep) + noiseLat;
        const plantLng = startLng + (col * lngStep) + noiseLng;

        plantsData.push({
          landId: land.id,
          variety: "Robusta",
          plantedAt: new Date(new Date().setFullYear(new Date().getFullYear() - 3)), // 3 years old
          status: "active",
          locationCoordinate: {
            lat: plantLat,
            lng: plantLng
          },
          activeBranches: Math.floor(Math.random() * 5) + 3 // 3 to 7 branches
        });
        
        count++;
      }
      if (count >= 1500) break;
    }

    // Bulk insert plants
    await prisma.plant.createMany({
      data: plantsData
    });

    console.log(`Planted 1500 Robusta trees in ${land.landName}.`);
  }

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
