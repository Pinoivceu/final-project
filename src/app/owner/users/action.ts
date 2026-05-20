"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
const argon2 = require('argon2');

export async function createUser(formData: any) {

    const defaultPassword = await argon2.hash("password123")

    try {
        await prisma.user.create({
            data: {
                fullName: formData.fullName,
                username: formData.username,
                role: formData.role,
                phoneNumber: formData.phoneNumber,
                password: defaultPassword,
                status: "active",
            },
        })

        revalidatePath("/owner/users")
        revalidatePath("/owner/dashboard")
        revalidatePath("/owner/maps")

        return { success: true }
    } catch (error) {
        return { success: false, error: "Gagal menambahkan user" }
    }
}

export async function deleteUser(userId: any) {


    try {
        await prisma.user.delete({ where: { id: userId }, })

        revalidatePath("/owner/users")
        revalidatePath("/owner/dashboard")
        revalidatePath("/owner/maps")

        return { success: true }
    } catch (error :any) {
       throw new Error(error.message || "Gagal menghapus user");
    }
}

export async function getUser(userId: any) {


    try {
        const userData = await prisma.user.findUnique({ where: { id: userId }, })


        return { success: true, userData }
    } catch (error) {
        return { success: false, error: "Terjadi kesalahan" }
    }
}

export async function updateUserStatus(userId: any) {


    try {

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { status: true } })
        let newStatus = "";
        if (user?.status === "active") {
            newStatus = "inactive";
        } else {
            newStatus = "active";
        }

        await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus }
        })
        revalidatePath("/owner/users")
        revalidatePath("/owner/dashboard")
        revalidatePath("/owner/maps")
        return { success: true, }
    } catch (error) {
        return { success: false, error: "Terjadi kesalahan" }
    }
}