"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function startTask(taskId: number) {
    try {
        const task = await prisma.task.findUnique({ where: { id: taskId } })

        if (!task) throw new Error("Tugas tidak ditemukan.")
        if (task.status !== "pending")
            throw new Error("Hanya tugas berstatus 'pending' yang bisa dimulai.")

        await prisma.task.update({
            where: { id: taskId },
            data: {
                status: "in_progress",
                startedAt: new Date(),
                rejectionReason: null, // clear any previous rejection reason
            },
        })

        revalidatePath("/mandor/tasks")
        revalidatePath("/mandor/dashboard")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal memulai tugas.")
    }
}

export async function submitTask(taskId: number) {
    try {
        const task = await prisma.task.findUnique({ where: { id: taskId } })

        if (!task) throw new Error("Tugas tidak ditemukan.")
        if (task.status !== "in_progress")
            throw new Error("Hanya tugas yang sedang dikerjakan yang bisa disubmit.")

        await prisma.task.update({
            where: { id: taskId },
            data: {
                status: "on_approval",
                completedAt: new Date(),
            },
        })

        revalidatePath("/mandor/tasks")
        revalidatePath("/mandor/dashboard")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal mengajukan tugas ke owner.")
    }
}

export async function getMandorTasks(mandorId: string) {
    try {
        const tasks = await prisma.task.findMany({
            where: { mandorId },
            include: {
                land: { select: { landName: true } },
            },
            orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        })
        return { success: true, tasks }
    } catch (error: any) {
        return { success: false, tasks: [] }
    }
}

export async function deleteCompletedTask(taskId: number) {
    try {
        const task = await prisma.task.findUnique({ where: { id: taskId } })

        if (!task) throw new Error("Tugas tidak ditemukan.")
        if (task.status !== "completed")
            throw new Error("Hanya tugas yang sudah selesai yang bisa dihapus dari log.")

        await prisma.task.delete({ where: { id: taskId } })

        revalidatePath("/mandor/tasks")
        revalidatePath("/mandor/dashboard")
        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal menghapus tugas.")
    }
}
