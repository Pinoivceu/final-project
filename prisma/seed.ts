import { PrismaClient, Prisma } from "../client/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as argon2 from "argon2";
import { faker } from '@faker-js/faker';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});



const prisma = new PrismaClient({
    adapter,
});


const CENTER_LAT = -3.7312766687523116;
const CENTER_LNG = 102.63041531646236;

// Fungsi untuk membuat koordinat poligon acak di radius tertentu
function generateRandomPolygon(lat: number, lng: number) {
  const offset = 0.005; // Sekitar 500m
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[
        [lng - offset, lat - offset],
        [lng + offset, lat - offset],
        [lng + offset, lat + offset],
        [lng - offset, lat + offset],
        [lng - offset, lat - offset],
      ]]
    }
  };
}

async function main() {
  const hashedPassword = await argon2.hash("password123");
  console.log("Sowing seeds... 🌱");

  // 1. Create Owner
  const owner = await prisma.user.create({
    data: {
      fullName: "Owner Kopi Bengkulu",
      username: "owner1",
      password: hashedPassword,
      role: "owner",
      status: "active",
    }
  });

  // 2. Create Mandors
  const mandors = [];
  for (let i = 1; i <= 3; i++) {
    const m = await prisma.user.create({
      data: {
        fullName: faker.person.firstName(),
        username: `mandor${i}`,
        password: hashedPassword,
        role: "mandor",
      }
    });
    mandors.push(m);
  }

  // 3. Create Lands & Related Data
  for (const [index, mandor] of mandors.entries()) {
    const land = await prisma.land.create({
      data: {
        landName: `Perkebunan Robusta Sektor ${index + 1}`,
        areaSize: faker.number.float({ min: 2, max: 5, fractionDigits: 2 }),
        locationAddress: "Kabupaten Seluma, Bengkulu",
        coordinates: generateRandomPolygon(CENTER_LAT, CENTER_LNG) as any,
        mandorId: mandor.id,
      }
    });

    console.log(`Processing Land: ${land.landName}`);

    // --- SEED PLANTS (100 per land) ---
    const plantsData = Array.from({ length: 100 }).map(() => ({
      variety: "Robusta",
      activeBranches: faker.number.int({ min: 3, max: 8 }),
      plantedAt: faker.date.past({ years: 5 }),
      status: "active",
      landId: land.id,
      locationCoordinate: {
        lat: CENTER_LAT + (Math.random() - 0.5) * 0.01,
        lng: CENTER_LNG + (Math.random() - 0.5) * 0.01,
      } as any
    }));
    await prisma.plant.createMany({ data: plantsData });

    // --- SEED HARVEST (36 months) ---
    const harvestData = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 3);

    for (let month = 0; month < 36; month++) {
      const currentDate = new Date(startDate);
      currentDate.setMonth(currentDate.getMonth() + month);
      const isPeakSeason = currentDate.getMonth() >= 3 && currentDate.getMonth() <= 8;
      
      harvestData.push({
        harvestDate: currentDate,
        totalWeight: isPeakSeason 
          ? faker.number.float({ min: 400, max: 850, fractionDigits: 2 })
          : faker.number.float({ min: 30, max: 120, fractionDigits: 2 }),
        landId: land.id,
        mandorId: mandor.id,
      });
    }
    await prisma.harvest.createMany({ data: harvestData });

    // --- SEED TASKS (15 per land) ---
    const taskCategories = [
      { title: "Pemupukan NPK", type: "Pemupukan" },
      { title: "Pemangkasan Cabang Air", type: "Pemangkasan" },
      { title: "Penyemprotan Fungisida", type: "Penyemprotan" },
      { title: "Pembersihan Gulma Blok A", type: "Pembersihan" },
      { title: "Cek Kematangan Buah", type: "Panen" },
    ];

    const tasks = Array.from({ length: 15 }).map(() => {
      const category = faker.helpers.arrayElement(taskCategories);
      const status = faker.helpers.arrayElement(["pending", "completed", "rejected", "in_progress"]);
      const createdAt = faker.date.past({ years: 1 });
      const dueDate = new Date(createdAt);
      dueDate.setDate(dueDate.getDate() + 7);

      return {
        title: category.title,
        description: `Instruksi pengerjaan ${category.title}.`,
        activityType: category.type,
        status: status,
        createdAt: createdAt,
        dueDate: dueDate,
        startedAt: status !== "pending" ? createdAt : null,
        completedAt: status === "completed" ? dueDate : null,
        verifiedAt: status === "completed" ? dueDate : null,
        rejectionReason: status === "rejected" ? "Foto dokumentasi tidak jelas." : null,
        landId: land.id,
        mandorId: mandor.id,
      };
    });

    await prisma.task.createMany({ data: tasks });
    console.log(`✅ Created 100 plants and 15 tasks for ${land.landName}`);
  }

  console.log("Seeding completed successfully! ☕✨");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

