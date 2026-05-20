"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"

export async function updateProfile(values: any) {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get("session")?.value
        const payload = await decrypt(sessionToken)
        
        if (!payload?.userId) {
            throw new Error("Sesi tidak valid.")
        }

        const { fullName, phoneNumber, image } = values

        const updateData: any = {
            fullName,
            phoneNumber,
        }

        if (image !== undefined) {
            updateData.image = image || "/avatar-placeholder.png"
        }

        await prisma.user.update({
            where: { id: payload.userId as string },
            data: updateData
        })

        revalidatePath("/owner/profile")
        return { success: true }
    } catch (error: any) {
        console.error("UPDATE_PROFILE_ERROR:", error)
        return { success: false, error: error.message || "Gagal memperbarui profil." }
    }
}
