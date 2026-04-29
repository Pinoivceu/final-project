"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Prisma } from "../../../../client/generated/prisma/client"
export async function createPlant(values: any) {
    try {
        const { variety, landId, lat, lng, plantedAt } = values

        if (!variety || !landId) throw new Error("Varietas dan Lahan wajib diisi.")

        const land = await prisma.land.findUnique({ where: { id: landId } })
        if (!land) throw new Error("Lahan tidak ditemukan.")

        const newPlant = await prisma.plant.create({
            data: {
                variety,
                status: "active",
                landId,
                plantedAt: plantedAt ? new Date(plantedAt) : null,
                locationCoordinate: (lat && lng)
                    ? { lat: parseFloat(lat), lng: parseFloat(lng) }
                    : Prisma.JsonNull,
            },
        })

        revalidatePath("/mandor/plants")
        return { success: true, data: newPlant }
    } catch (error: any) {
        throw new Error(error.message || "Gagal menambahkan tanaman.")
    }
}

export async function updatePlant(values: any) {
    try {
        const { id, variety, lat, lng, plantedAt, status } = values

        if (!id) throw new Error("ID tanaman tidak ditemukan.")

        const updated = await prisma.plant.update({
            where: { id: Number(id) },
            data: {
                variety,
                status,
                plantedAt: plantedAt ? new Date(plantedAt) : null,
                locationCoordinate: (lat && lng)
                    ? { lat: parseFloat(lat), lng: parseFloat(lng) }
                    : Prisma.JsonNull,
            },
        })

        revalidatePath("/mandor/plants")
        return { success: true, data: updated }
    } catch (error: any) {
        throw new Error(error.message || "Gagal memperbarui tanaman.")
    }
}

export async function deletePlant(plantId: number) {
    try {
        await prisma.plant.delete({ where: { id: plantId } })
        revalidatePath("/mandor/plants")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal menghapus tanaman.")
    }
}

export async function togglePlantStatus(plantId: number, currentStatus: string) {
    try {
        const newStatus = currentStatus === "active" ? "inactive" : "active"
        await prisma.plant.update({
            where: { id: plantId },
            data: { status: newStatus },
        })
        revalidatePath("/mandor/plants")
        return { success: true, newStatus }
    } catch (error: any) {
        throw new Error(error.message || "Gagal mengubah status tanaman.")
    }
}
