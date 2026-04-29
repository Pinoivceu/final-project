import prisma from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import { ClipboardList, History } from "lucide-react"
import { TaskBoard } from "./task-board"
import { CompletedTasksTable } from "./completed-tasks-table"

export default async function MandorTasksPage() {
    // Resolve mandorId from session
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const payload = await decrypt(sessionToken)
    const mandorId = payload?.userId as string

    // Fetch all tasks for this mandor
    const allTasks = await prisma.task.findMany({
        where: { mandorId },
        include: {
            land: { select: { landName: true } },
        },
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    })

    // Split active vs completed
    const activeTasks = allTasks.filter((t) => t.status !== "completed")
    const completedTasks = allTasks.filter((t) => t.status === "completed")
        .sort((a, b) => {
            // Sort completed by verifiedAt or completedAt desc (most recent first)
            const aDate = a.verifiedAt ?? a.completedAt ?? a.createdAt
            const bDate = b.verifiedAt ?? b.completedAt ?? b.createdAt
            return new Date(bDate).getTime() - new Date(aDate).getTime()
        })

    const pendingCount = activeTasks.filter((t) => t.status === "pending").length
    const inProgressCount = activeTasks.filter((t) => t.status === "in_progress").length

    return (
        <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <ClipboardList className="size-7 text-foreground" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Tugas Saya</h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    {pendingCount > 0
                        ? `${pendingCount} tugas menunggu dikerjakan${inProgressCount > 0 ? `, ${inProgressCount} sedang dikerjakan` : ""}.`
                        : inProgressCount > 0
                        ? `${inProgressCount} tugas sedang dikerjakan.`
                        : "Semua tugas aktif sudah ditangani. 🎉"}
                </p>
            </div>

            {/* Kanban Board — active tasks only */}
            <TaskBoard tasks={activeTasks as any} />

            {/* Activity Log — completed tasks */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="size-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold text-foreground">Log Aktivitas Selesai</h2>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {completedTasks.length} tugas tercatat
                    </span>
                </div>
                <CompletedTasksTable tasks={completedTasks as any} />
            </div>

        </div>
    )
}
