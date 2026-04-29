"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Loader2,
    Play,
    SendHorizontal,
    ChevronRight,
    Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { startTask, submitTask, deleteCompletedTask } from "./action"

// ─── Shared Types & Helpers ───────────────────────────────────────────────────

export type TaskItem = {
    id: number
    title: string
    description: string | null
    activityType: string
    status: string
    dueDate: Date | null
    startedAt: Date | null
    completedAt: Date | null
    verifiedAt: Date | null
    rejectionReason: string | null
    createdAt: Date
    land: { landName: string } | null
}

export function getDaysLeft(dueDate: Date | null): number | null {
    if (!dueDate) return null
    const now = new Date(); now.setHours(0, 0, 0, 0)
    const due = new Date(dueDate); due.setHours(0, 0, 0, 0)
    return Math.ceil((due.getTime() - now.getTime()) / 86400000)
}

export const ACTIVITY_COLOR: Record<string, string> = {
    pemupukan:    "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    penyiraman:   "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    pemangkasan:  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    penyemprotan: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    pemanenan:    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
}

export function DeadlineBadge({ daysLeft }: { daysLeft: number | null }) {
    if (daysLeft === null)
        return <Badge variant="secondary" className="text-[10px] px-2">Tanpa Tenggat</Badge>
    if (daysLeft < 0)
        return <Badge className="bg-destructive text-destructive-foreground text-[10px] px-2">Terlambat {Math.abs(daysLeft)}h</Badge>
    if (daysLeft === 0)
        return <Badge className="bg-destructive/90 text-destructive-foreground text-[10px] px-2 animate-pulse">Hari Ini!</Badge>
    if (daysLeft <= 3)
        return <Badge className="bg-[var(--yellow)] text-[var(--yellow-foreground)] text-[10px] px-2">{daysLeft}h lagi</Badge>
    return <Badge className="bg-primary/90 text-primary-foreground text-[10px] px-2">{daysLeft}h lagi</Badge>
}

export function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case "completed":   return <CheckCircle2 className="size-4 text-green-500 shrink-0" />
        case "in_progress": return <Loader2 className="size-4 text-blue-500 shrink-0 animate-spin" />
        case "on_approval": return <Clock className="size-4 text-yellow-500 shrink-0" />
        default:            return <AlertTriangle className="size-4 text-muted-foreground shrink-0" />
    }
}

// urgency border color on the left strip
function urgencyStrip(daysLeft: number | null, status: string): string {
    if (status === "completed")   return "bg-green-500"
    if (status === "on_approval") return "bg-yellow-400"
    if (status === "in_progress") return "bg-blue-500"
    if (daysLeft === null)        return "bg-muted-foreground/30"
    if (daysLeft < 0)             return "bg-destructive"
    if (daysLeft === 0)           return "bg-destructive/90"
    if (daysLeft <= 3)            return "bg-[var(--yellow)]"
    return "bg-primary"
}

// ─── Kanban Task Card ─────────────────────────────────────────────────────────

export function TaskCard({
    task,
    onOpenDetail,
}: {
    task: TaskItem
    onOpenDetail: (task: TaskItem) => void
}) {
    const daysLeft = getDaysLeft(task.dueDate)
    const strip = urgencyStrip(daysLeft, task.status)
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
            className="group relative flex rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
        >
            {/* Left urgency strip */}
            <div className={`w-1.5 shrink-0 ${strip} rounded-l-xl`} />

            <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
                {/* Rejection banner */}
                {task.rejectionReason && (
                    <div className="flex items-start gap-2 text-[11px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                        <span className="leading-relaxed"><b>Dikembalikan:</b> {task.rejectionReason}</span>
                    </div>
                )}

                {/* Activity pill + chevron */}
                <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${activityColor}`}>
                        {task.activityType}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>

                {/* Title */}
                <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
                    {task.title}
                </p>

                {/* Land + date meta */}
                <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                    <span>🌿 {task.land?.landName ?? "-"}</span>
                    {task.dueDate && (
                        <span>
                            📅 {new Date(task.dueDate).toLocaleDateString("id-ID", {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </span>
                    )}
                </div>

                {/* Deadline countdown */}
                <DeadlineBadge daysLeft={daysLeft} />

                {/* CTA button */}
                {task.status === "pending" && (
                    <Button
                        size="sm"
                        className="w-full gap-2 mt-1 font-semibold"
                        onClick={handleStart}
                    >
                        <Play className="size-3.5" /> Mulai Kerjakan
                    </Button>
                )}
                {task.status === "in_progress" && (
                    <Button
                        size="sm"
                        className="w-full gap-2 mt-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        onClick={handleSubmit}
                    >
                        <SendHorizontal className="size-3.5" /> Submit ke Owner
                    </Button>
                )}
                {task.status === "on_approval" && (
                    <div className="text-[11px] text-center text-yellow-600 dark:text-yellow-400 py-2 px-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 font-medium">
                        ⏳ Menunggu persetujuan owner...
                    </div>
                )}
                {task.status === "completed" && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 text-[11px] text-center text-primary py-2 px-3 rounded-lg bg-primary/10 border border-primary/20 font-medium">
                            ✅ Selesai & diverifikasi owner
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 h-9 w-9 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus dari Log Aktivitas?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tugas ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toast.promise(deleteCompletedTask(task.id), {
                                                loading: "Menghapus dari log...",
                                                success: "Tugas berhasil dihapus.",
                                                error: (err) => err.message,
                                            })
                                        }}
                                    >
                                        Ya, Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    )
}
