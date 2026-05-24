"use client"

import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    AlignLeft,
    Calendar,
    Clock3,
    Info,
    Play,
    SendHorizontal,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { startTask, submitTask } from "./action"
import { type TaskItem, DeadlineBadge, getDaysLeft, ACTIVITY_COLOR, StatusIcon } from "./task-card"
import { SubmitTaskDialog } from "./submit-task-dialog"
import { RejectTaskDialog } from "./reject-task-dialog"

const STATUS_LABEL: Record<string, string> = {
    pending:     "Menunggu",
    in_progress: "Sedang Dikerjakan",
    on_approval: "Menunggu Persetujuan",
    completed:   "Selesai",
}

export function TaskDetailSheet({
    task,
    open,
    onOpenChange,
}: {
    task: TaskItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

    if (!task) return null

    const daysLeft = getDaysLeft(task.dueDate)
    const activityColor = ACTIVITY_COLOR[task.activityType?.toLowerCase()] ??
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

    async function handleStart() {
        toast.promise(startTask(task!.id), {
            loading: "Memulai tugas...",
            success: () => { onOpenChange(false); return "Tugas berhasil dimulai!" },
            error: (err) => err.message,
        })
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md overflow-y-auto p-6 flex flex-col gap-0">
                <SheetHeader className="border-b pb-4 mb-0">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full w-fit capitalize ${activityColor}`}>
                        {task.activityType}
                    </span>
                    <SheetTitle className="text-xl leading-tight">{task.title}</SheetTitle>
                    <SheetDescription>
                        Detail instruksi dan progres pengerjaan tugas Anda.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-5 flex-1">
                    {/* Rejection Alert */}
                    {task.rejectionReason && (
                        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                            <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide mb-1">Dikembalikan oleh Owner</p>
                                <p className="text-sm">{task.rejectionReason}</p>
                            </div>
                        </div>
                    )}

                    {/* Current Status */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-2">
                            <StatusIcon status={task.status} />
                            <span className="text-sm font-medium">Status Saat Ini</span>
                        </div>
                        <Badge className={
                            task.status === "completed"   ? "bg-primary text-primary-foreground" :
                            task.status === "on_approval" ? "bg-[var(--yellow)] text-[var(--yellow-foreground)]" :
                            task.status === "in_progress" ? "bg-[var(--blue)] text-[var(--blue-foreground)]" :
                            "bg-muted-foreground text-secondary"
                        }>
                            {STATUS_LABEL[task.status] ?? task.status}
                        </Badge>
                    </div>

                    {/* Description */}
                    <div className="flex gap-3">
                        <AlignLeft className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Deskripsi</p>
                            <p className="text-sm leading-relaxed">{task.description || "Tidak ada deskripsi tambahan."}</p>
                        </div>
                    </div>

                    {/* Land */}
                    <div className="flex gap-3">
                        <span className="text-lg leading-none shrink-0">🌿</span>
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Lahan</p>
                            <p className="text-sm font-medium">{task.land?.landName ?? "-"}</p>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex gap-3">
                        <Calendar className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Tenggat Waktu</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm">
                                    {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString("id-ID", {
                                            day: "numeric", month: "long", year: "numeric",
                                        })
                                        : "Tidak ada tenggat"}
                                </p>
                                <DeadlineBadge daysLeft={daysLeft} />
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex gap-3">
                        <Clock3 className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Timeline</p>
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Dibuat</span>
                                    <span className="font-medium text-foreground">
                                        {new Date(task.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                </div>
                                {task.startedAt && (
                                    <div className="flex justify-between">
                                        <span>Dimulai</span>
                                        <span className="font-medium text-foreground">
                                            {new Date(task.startedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                )}
                                {task.completedAt && (
                                    <div className="flex justify-between">
                                        <span>Disubmit</span>
                                        <span className="font-medium text-foreground">
                                            {new Date(task.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                )}
                                {task.verifiedAt && (
                                    <div className="flex justify-between">
                                        <span>Diverifikasi</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            {new Date(task.verifiedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* System Log */}
                    <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Info className="size-4" />
                            <h4 className="text-xs font-bold uppercase tracking-wider">Log Sistem</h4>
                        </div>
                        <div className="text-[11px] text-muted-foreground space-y-1 bg-muted/20 p-2 rounded">
                            <p>ID Tugas: #{task.id}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t pt-4 mt-auto">
                    {task.status === "pending" && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
                                onClick={() => setIsRejectDialogOpen(true)}
                            >
                                Tolak Tugas
                            </Button>
                            <Button className="flex-1 font-semibold" onClick={handleStart}>
                                <Play className="size-4" /> Mulai
                            </Button>
                        </div>
                    )}
                    {task.status === "in_progress" && (
                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                onClick={() => setIsSubmitDialogOpen(true)}
                            >
                                <SendHorizontal className="size-4" /> Submit ke Owner
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground italic">
                                Pastikan pekerjaan sudah benar-benar selesai sebelum disubmit.
                            </p>
                        </div>
                    )}
                    {task.status === "on_approval" && (
                        <div className="flex items-center justify-center gap-2 py-3 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800 font-medium">
                            <Clock3 className="size-4 shrink-0" />
                            Menunggu persetujuan dari owner...
                        </div>
                    )}
                    {task.status === "completed" && (
                        <div className="flex items-center justify-center gap-2 py-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 font-medium">
                            <CheckCircle2 className="size-4 shrink-0" />
                            Tugas telah diverifikasi oleh owner
                        </div>
                    )}
                </div>
            </SheetContent>
            <SubmitTaskDialog
                taskId={task.id}
                open={isSubmitDialogOpen}
                onOpenChange={setIsSubmitDialogOpen}
                onSuccess={() => onOpenChange(false)}
            />
            <RejectTaskDialog
                taskId={task.id}
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
                onSuccess={() => onOpenChange(false)}
            />
        </Sheet>
    )
}
