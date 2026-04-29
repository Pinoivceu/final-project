"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import * as argon2 from "argon2"

export async function updateProfile(values: any) {
    try {
        const { id, fullName, phoneNumber, image } = values

        if (!id) throw new Error("ID pengguna tidak valid.")

        await prisma.user.update({
            where: { id },
            data: {
                fullName,
                phoneNumber: phoneNumber || null,
                ...(image !== undefined && { image }),
            },
        })

        revalidatePath("/mandor/user")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal memperbarui profil.")
    }
}

export async function changePassword(values: any) {
    try {
        const { id, currentPassword, newPassword } = values

        if (!id) throw new Error("ID pengguna tidak valid.")

        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) throw new Error("Pengguna tidak ditemukan.")

        const isMatch = await argon2.verify(user.password, currentPassword)
        if (!isMatch) throw new Error("Password saat ini salah.")

        const hashedPassword = await argon2.hash(newPassword)

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        })

        revalidatePath("/mandor/user")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal mengubah password.")
    }
}
