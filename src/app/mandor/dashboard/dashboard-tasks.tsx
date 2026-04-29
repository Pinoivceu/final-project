"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Play,
    SendHorizontal,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { startTask, submitTask } from "@/app/mandor/tasks/action"
import { TaskDetailSheet } from "@/app/mandor/tasks/task-detail-sheet"
import { getDaysLeft, ACTIVITY_COLOR, type TaskItem } from "@/app/mandor/tasks/task-card"

function urgencyConfig(daysLeft: number | null, status: string) {
    if (status === "on_approval") return {
        strip: "from-yellow-400 to-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-200 dark:border-yellow-800",
        countdownColor: "text-yellow-600 dark:text-yellow-400",
    }
    if (status === "in_progress") return {
        strip: "from-blue-400 to-blue-600",
        bg: "bg-blue-50 dark:bg-blue-950/20",
        border: "border-blue-200 dark:border-blue-800",
        countdownColor: "text-blue-600 dark:text-blue-400",
    }
    if (daysLeft === null || daysLeft > 3) return {
        strip: "from-emerald-400 to-emerald-600",
        bg: "bg-muted/30",
        border: "border-border",
        countdownColor: "text-emerald-600 dark:text-emerald-400",
    }
    if (daysLeft < 0 || daysLeft === 0) return {
        strip: "from-red-500 to-red-600",
        bg: "bg-red-50 dark:bg-red-950/20",
        border: "border-red-200 dark:border-red-800",
        countdownColor: "text-red-600 dark:text-red-400",
    }
    return {
        strip: "from-orange-400 to-orange-500",
        bg: "bg-orange-50 dark:bg-orange-950/20",
        border: "border-orange-200 dark:border-orange-800",
        countdownColor: "text-orange-600 dark:text-orange-400",
    }
}

function countdownLabel(daysLeft: number | null): string {
    if (daysLeft === null) return "Tanpa tenggat"
    if (daysLeft < 0) return `${Math.abs(daysLeft)} hari terlambat`
    if (daysLeft === 0) return "Tenggat hari ini!"
    return `${daysLeft} hari lagi`
}

function PriorityTaskCard({
    task,
    onOpenDetail,
}: {
    task: TaskItem
    onOpenDetail: (t: TaskItem) => void
}) {
    const daysLeft = getDaysLeft(task.dueDate)
    const cfg = urgencyConfig(daysLeft, task.status)
    const activityColor =
        ACTIVITY_COLOR[task.activityType?.toLowerCase()] ??
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

    async function handleStart(e: React.MouseEvent) {
        e.stopPropagation()
        toast.promise(startTask(task.id), {
            loading: "Memulai tugas...",
            success: "Tugas berhasil dimulai!",
            error: (err) => err.message,
        })
    }

    async function handleSubmit(e: React.MouseEvent) {
        e.stopPropagation()
        toast.promise(submitTask(task.id), {
            loading: "Mengajukan ke owner...",
            success: "Berhasil diajukan untuk persetujuan!",
            error: (err) => err.message,
        })
    }

    return (
        <div
            onClick={() => onOpenDetail(task)}
            className={`group relative flex rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200`}
        >
            {/* Gradient left strip */}
            <div className={`w-2 shrink-0 bg-gradient-to-b ${cfg.strip}`} />

            <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
                {/* Rejection notice */}
                {task.rejectionReason && (
                    <div className="flex items-start gap-2 text-[11px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-2.5 py-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                        <span><b>Dikembalikan:</b> {task.rejectionReason}</span>
                    </div>
                )}

                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize w-fit ${activityColor}`}>
                            {task.activityType}
                        </span>
                        <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
                            {task.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            🌿 {task.land?.landName ?? "-"}
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="flex flex-col items-end shrink-0 gap-1">
                        <p className={`text-lg font-black leading-none tabular-nums ${cfg.countdownColor}`}>
                            {daysLeft !== null && daysLeft >= 0 && daysLeft <= 99
                                ? daysLeft
                                : daysLeft !== null && daysLeft < 0
                                ? `+${Math.abs(daysLeft)}`
                                : "∞"}
                        </p>
                        <p className={`text-[10px] font-semibold ${cfg.countdownColor}`}>
                            {daysLeft !== null && daysLeft >= 0 ? "hari lagi" :
                             daysLeft !== null && daysLeft < 0 ? "terlambat" : "hari"}
                        </p>
                    </div>
                </div>

                {/* Action */}
                {task.status === "pending" && (
                    <Button size="sm" className="w-full gap-2 font-semibold" onClick={handleStart}>
                        <Play className="size-3.5" /> Mulai Kerjakan
                    </Button>
                )}
                {task.status === "in_progress" && (
                    <Button
                        size="sm"
                        className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        onClick={handleSubmit}
                    >
                        <SendHorizontal className="size-3.5" /> Submit ke Owner
                    </Button>
                )}
                {task.status === "on_approval" && (
                    <div className="text-[11px] flex items-center justify-center gap-1.5 text-yellow-600 dark:text-yellow-400 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 font-medium">
                        <Clock className="size-3.5" /> Menunggu persetujuan owner...
                    </div>
                )}
            </div>
        </div>
    )
}

export function DashboardTasks({ tasks }: { tasks: TaskItem[] }) {
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground rounded-2xl border border-dashed bg-muted/20">
                <CheckCircle2 className="size-10 text-green-500/60" />
                <p className="font-medium">Semua tugas telah selesai! 🎉</p>
                <p className="text-sm text-center">Tidak ada tugas aktif saat ini.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {tasks.map((task) => (
                    <PriorityTaskCard
                        key={task.id}
                        task={task}
                        onOpenDetail={(t) => { setSelectedTask(t); setSheetOpen(true) }}
                    />
                ))}
            </div>

            {/* See all link */}
            <Link
                href="/mandor/tasks"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
                Lihat semua tugas <ArrowRight className="size-4" />
            </Link>

            <TaskDetailSheet
                task={selectedTask}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </>
    )
}
