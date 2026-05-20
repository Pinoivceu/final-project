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
      image: land.image || "/default-land.jpg"
    }
    })
    return { success: true }
  } catch (error) {
    throw land
  }
}

export async function toggleLandStatus(landId: string, isActive: boolean) {
    try {
        await prisma.land.update({ where: { id: landId }, data: { isActive } })
        revalidatePath("/owner/dashboard")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Gagal mengubah status lahan" }
    }
}