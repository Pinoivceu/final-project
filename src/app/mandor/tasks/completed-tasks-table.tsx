"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2, CheckCircle2, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { deleteCompletedTask } from "./action"
import { ACTIVITY_COLOR, type TaskItem } from "./task-card"

function formatDate(date: Date | null) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
    })
}

function formatDateTime(date: Date | null) {
    if (!date) return "-"
    return new Date(date).toLocaleString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

function DeleteButton({ taskId }: { taskId: number }) {
    const [open, setOpen] = useState(false)

    async function handleDelete() {
        toast.promise(deleteCompletedTask(taskId), {
            loading: "Menghapus dari log...",
            success: "Tugas berhasil dihapus dari log.",
            error: (err) => err.message,
        })
        setOpen(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger render={<Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
                <Trash2 className="size-4" />
            </Button>}>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus dari Log Aktivitas?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tugas yang sudah selesai ini akan dihapus permanen dari log. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleDelete}
                    >
                        Ya, Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function CompletedTasksTable({ tasks }: { tasks: TaskItem[] }) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground rounded-xl border border-dashed bg-muted/20">
                <History className="size-9 opacity-30" />
                <p className="text-sm font-medium">Belum ada tugas yang tercatat sebagai selesai.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40">
                        <TableHead className="w-10 text-center text-xs">#</TableHead>
                        <TableHead className="text-xs">Judul Tugas</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Aktivitas</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Lahan</TableHead>
                        <TableHead className="text-xs hidden lg:table-cell">Mulai</TableHead>
                        <TableHead className="text-xs hidden lg:table-cell">Selesai</TableHead>
                        <TableHead className="text-xs hidden xl:table-cell">Diverifikasi</TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task, i) => {
                        const activityColor =
                            ACTIVITY_COLOR[task.activityType?.toLowerCase()] ??
                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

                        return (
                            <TableRow key={task.id} className="hover:bg-muted/30 transition-colors">
                                {/* Row number */}
                                <TableCell className="text-center text-xs text-muted-foreground font-mono">
                                    {i + 1}
                                </TableCell>

                                {/* Title + mobile meta */}
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium text-sm text-foreground leading-snug line-clamp-2">
                                            {task.title}
                                        </span>
                                        {/* Mobile fallback info */}
                                        <div className="flex flex-wrap gap-1 sm:hidden mt-0.5">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${activityColor}`}>
                                                {task.activityType}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {task.land?.landName ?? "-"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Activity */}
                                <TableCell className="hidden sm:table-cell">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${activityColor}`}>
                                        {task.activityType}
                                    </span>
                                </TableCell>

                                {/* Land */}
                                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                                    {task.land?.landName ?? "-"}
                                </TableCell>

                                {/* Started */}
                                <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                                    {formatDate(task.startedAt)}
                                </TableCell>

                                {/* Completed */}
                                <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                                    {formatDate(task.completedAt)}
                                </TableCell>

                                {/* Verified */}
                                <TableCell className="hidden xl:table-cell">
                                    {task.verifiedAt ? (
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                                            <span className="text-xs text-green-600 dark:text-green-400">
                                                {formatDate(task.verifiedAt)}
                                            </span>
                                        </div>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px]">Belum diverifikasi</Badge>
                                    )}
                                </TableCell>

                                {/* Delete */}
                                <TableCell className="text-right">
                                    <DeleteButton taskId={task.id} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
