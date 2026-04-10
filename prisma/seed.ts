import { PrismaClient, Prisma } from "../client/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as argon2 from "argon2";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});



const prisma = new PrismaClient({
    adapter,
});


export async function main() {


    console.log("Seeding plants...");
    const plants = [];
for (let i = 0; i < 380; i++) {
  plants.push({
    landId: 1,
    variety: "Robusta",
    activeBranches: Math.floor(Math.random() * 15),
    status: "active",
    // Logika random koordinat di dalam range poligon
    locationCoordinate: JSON.stringify({
      type: "Point",
      coordinates: [
        102.6150 + Math.random() * 0.0006, 
        -3.7256 - Math.random() * 0.0008
      ]
    }),
  });
}
await prisma.plant.createMany({ data: plants });


   
    
}

main();