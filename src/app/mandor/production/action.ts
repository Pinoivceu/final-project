"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createHarvest(values: any) {
    try {
        const { totalWeight, harvestDate, notes, variety, landId } = values

        if (!totalWeight || !landId) throw new Error("Berat dan Lahan wajib diisi.")

        await prisma.harvest.create({
            data: {
                totalWeight: parseFloat(totalWeight),
                harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
                variety: variety || null,
                notes: notes || null,
                landId,
            },
        })

        revalidatePath("/mandor/production")
        revalidatePath("/mandor/dashboard")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal mencatat hasil panen.")
    }
}

export async function updateHarvest(values: any) {
    try {
        const { id, totalWeight, harvestDate, notes, variety } = values

        if (!id) throw new Error("ID panen tidak ditemukan.")

        await prisma.harvest.update({
            where: { id },
            data: {
                totalWeight: parseFloat(totalWeight),
                harvestDate: harvestDate ? new Date(harvestDate) : undefined,
                variety: variety || null,
                notes: notes || null,
            },
        })

        revalidatePath("/mandor/production")
        revalidatePath("/mandor/dashboard")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal memperbarui data panen.")
    }
}

export async function deleteHarvest(id: string) {
    try {
        await prisma.harvest.delete({ where: { id } })
        revalidatePath("/mandor/production")
        revalidatePath("/mandor/dashboard")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal menghapus data panen.")
    }
}
