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
    const hashedPassword = await argon2.hash("password123");
    const userData: Prisma.UserCreateInput[] = [

    {
        fullName: 'Budi Setiawan',
        username: 'Owner',
        password: hashedPassword,
        role: 'owner',
        status: 'active',
        phoneNumber: '08123456789',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    },
    {
        fullName: 'Agus Prayitno',
        username: 'mandor',
        password: hashedPassword,
        role: 'mandor',
        status: 'active',
        phoneNumber: '08987654321',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus',
    },

];

    for (const u of userData) {
        await prisma.user.create({ data: u });
    }
}

main();