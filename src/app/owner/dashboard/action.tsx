"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createLahan(land: any) {
  try {
  await prisma.land.create({
    data: {
      landName: land.nama,
      mandorId: land.mandorId,
      coordinates: land.polygon,
      areaSize: land.luas, 
      locationAddress: land.lokasi,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop"
    }
    })
    return { success: true }
  } catch (error) {
    throw land
  }
}

export async function deleteLand(landId: any) {


    try {
        await prisma.land.delete({ where: { id: landId }, })

        revalidatePath("/owner/dashboard")

        return { success: true }
    } catch (error) {
        return { success: false, error: "Gagal menghapus user" }
    }
}